import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createServer } from 'vite'
import { defaultProgram } from '../src/data/defaultProgram.js'
import { defaultExercises } from '../src/data/defaultExercises.js'

// Chromium runs against a local Vite instance with a disposable browser profile.
function connectToChromium(browser) {
  let sequence = 0
  let buffer = ''
  const pending = new Map()
  browser.stdio[4].setEncoding('utf8').on('data', (chunk) => {
    buffer += chunk
    const messages = buffer.split('\0')
    buffer = messages.pop()
    for (const message of messages) {
      const { id, result, error } = JSON.parse(message)
      const request = pending.get(id)
      if (!request) continue
      pending.delete(id)
      if (error) request.reject(new Error(error.message))
      else request.resolve(result)
    }
  })
  function disconnect(error) {
    for (const request of pending.values()) request.reject(error)
    pending.clear()
  }
  browser.on('error', disconnect)
  browser.stdio[3].on('error', disconnect)
  browser.on('exit', () => disconnect(new Error('Chromium exited')))
  return (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    browser.stdio[3].write(JSON.stringify({ id, method, params, sessionId }) + '\0')
  })
}

test('SAFE-4A demo reset and storage protection', { timeout: 45_000 }, async (t) => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  t.after(() => server.close())
  await server.listen()
  const url = server.resolvedUrls.local[0]

  const profile = await mkdtemp(join(tmpdir(), 'gymflow-safe4a-'))
  const browser = spawn(process.env.CHROMIUM_BIN || 'chromium', [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
    '--remote-debugging-pipe', `--user-data-dir=${profile}`,
  ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] })
  t.after(async () => {
    if (browser.pid && browser.exitCode === null && browser.signalCode === null) {
      const exited = new Promise((resolve) => browser.once('exit', resolve))
      browser.kill()
      await exited
    }
    await rm(profile, { force: true, recursive: true, maxRetries: 5 })
  })

  const send = connectToChromium(browser)
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const cdp = (method, params) => send(method, params, sessionId)
  await cdp('Page.enable')
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  async function evaluate(expression) {
    const { result, exceptionDetails } = await cdp('Runtime.evaluate', { expression, returnByValue: true })
    if (exceptionDetails) throw new Error(result.description ?? exceptionDetails.text)
    return result.value
  }
  async function waitFor(expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression).catch(() => false)) return
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    assert.fail(`Browser condition did not become true: ${expression}`)
  }

  const button = (label) => `[...document.querySelectorAll('button')]
    .find(button => button.textContent.trim() === ${JSON.stringify(label)})`
  const view = (label) => `document.querySelector('nav button[aria-current="page"]')?.textContent.trim() === ${JSON.stringify(label)}`
  async function click(label, repeat = false) {
    await waitFor(`Boolean(${button(label)})`)
    await evaluate(`(() => {
      const button = ${button(label)};
      button.click();
      ${repeat ? 'button.click();' : ''}
    })()`)
  }
  const program = 'gymflow_program'
  const exercises = 'gymflow_exercises'
  const settings = 'gymflow_settings'
  const profileKey = 'gymflow_user_profile'
  const sessions = 'gymflow_sessions'
  const draft = 'gymflow_active_draft'
  const keys = [program, exercises, settings, profileKey, sessions, draft]
  const demoSettings = { language: 'fi', theme: 'light-beige', units: 'kg' }
  const stored = {
    [program]: JSON.stringify({ ...defaultProgram, name: 'Oma ohjelma' }),
    [exercises]: JSON.stringify(defaultExercises.slice(0, -1)),
    [settings]: JSON.stringify({ ...demoSettings, language: 'sv' }),
    [profileKey]: '{ "name": "Testiprofiili", "weightKg": 72, "heightCm": 180 }',
    [sessions]: '[ { "id": "saved-1", "status": "completed", "date": "2025-12-01", "exercises": [] } ]',
    [draft]: 'null',
    extra: 'Keep this unrelated key',
  }
  const compatible = {
    id: 'test-draft', workoutDayId: 'day-upper-push', status: 'draft',
    durationMinutes: 45, exercises: [],
  }
  const customDay = { ...defaultProgram.workoutDays[0], id: 'custom-day' }
  const custom = {
    [draft]: JSON.stringify({ ...compatible, workoutDayId: customDay.id }),
    [program]: JSON.stringify({ ...defaultProgram, workoutDays: [customDay] }),
  }
  const raw = (key) => evaluate(`localStorage.getItem(${JSON.stringify(key)})`)
  const snapshot = () => evaluate(`Object.fromEntries(Object.entries(localStorage))`)
  const goSettings = () => click('Asetukset')
  const open = (repeat) => click('Palauta demodata', repeat)
  const confirm = (repeat) => click('Vahvista palautus', repeat)
  const discard = (repeat) => click('Hylkää luonnos ja palauta', repeat)
  const expectSuccess = () => waitFor('document.querySelector("main [role=status]")?.textContent.includes("palautettiin")')
  const expectError = (text) => waitFor(`document.querySelector("main [role=alert]")?.textContent.includes(${JSON.stringify(text)})`)
  const duration = (minutes) => `[...document.querySelectorAll('[aria-label="Treenin keston pikavalinnat"] button')]
    .find(button => button.textContent === '${minutes}')`
  async function edit(minutes) {
    await waitFor(`Boolean(${duration(minutes)})`)
    await evaluate(`(${duration(minutes)}).click()`)
    await expectDuration(minutes)
  }
  const expectDuration = (minutes) => waitFor(`(${duration(minutes)})?.getAttribute('aria-pressed') === 'true'`)

  async function seed(values = stored, beforeStartup = '') {
    await evaluate(`window.restoreWrites?.(); localStorage.clear();
      for (const [key, value] of Object.entries(${JSON.stringify(values)})) localStorage.setItem(key, value);
      window.beforeSafe4Reload = true`)
    const script = beforeStartup
      ? await cdp('Page.addScriptToEvaluateOnNewDocument', { source: beforeStartup })
      : null
    if (script) await cdp('Page.navigate', { url: new URL('?startup-read-failure', url).href })
    else await cdp('Page.reload')
    await waitFor(`!window.beforeSafe4Reload && ${view('Tänään')}`)
    if (script) await cdp('Page.removeScriptToEvaluateOnNewDocument', script)
  }

  function watchWrites(failure = 'false') {
    return evaluate(`(() => {
      const write = Storage.prototype.setItem;
      window.restoreWrites = () => { Storage.prototype.setItem = write; };
      window.writes = [];
      Storage.prototype.setItem = function (key, value) {
        window.writes.push([key, value]);
        if (${failure}) throw new DOMException('Injected write failure', 'QuotaExceededError');
        return write.call(this, key, value);
      };
    })()`)
  }
  const writeKeys = () => evaluate('window.writes.map(([key]) => key)')

  await cdp('Page.navigate', { url })
  await waitFor(view('Tänään'))

  await t.test('T01 reset preserves saved sessions byte-for-byte', async () => {
    await seed()
    await goSettings()
    await open()
    await confirm()
    await expectSuccess()
    assert.equal(await raw(sessions), stored[sessions])
  })

  await t.test('T02 reset preserves the user profile byte-for-byte', async () => {
    await seed()
    await goSettings()
    await open()
    await confirm()
    await expectSuccess()
    assert.equal(await raw(profileKey), stored[profileKey])
    assert.equal(await evaluate('document.querySelector("main input").value'), 'Testiprofiili')
  })

  await t.test('T03 reset writes only program, exercises and settings', async () => {
    await seed()
    await goSettings()
    await watchWrites()
    await open()
    await confirm()
    await expectSuccess()
    assert.deepEqual(await snapshot(), {
      ...stored,
      [program]: JSON.stringify(defaultProgram),
      [exercises]: JSON.stringify(defaultExercises),
      [settings]: JSON.stringify(demoSettings),
    })
    assert.deepEqual(await writeKeys(), [program, exercises, settings])
  })

  await t.test('T04 cancel leaves all localStorage bytes untouched', async () => {
    await seed()
    await goSettings()
    await watchWrites()
    await open()
    await waitFor('document.activeElement?.textContent === "Peruuta"')
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await waitFor('!document.querySelector("dialog[open]")')
    assert.deepEqual(await snapshot(), stored)
    assert.deepEqual(await writeKeys(), [])
  })

  await t.test('T05 a compatible draft is preserved and an incompatible draft needs a second confirmation', async () => {
    const compatibleRaw = JSON.stringify(compatible, null, 2)
    await seed({ ...stored, [draft]: compatibleRaw })
    await goSettings()
    await open()
    await confirm()
    await expectSuccess()
    assert.equal(await raw(draft), compatibleRaw)
    await click('Treeni')
    await expectDuration(45)

    await seed({ ...stored, ...custom })
    await goSettings()
    await open()
    await confirm(true)
    await waitFor('document.querySelector("dialog[open]")?.textContent.includes("tallentamattomat muutokset")')
    assert.deepEqual(await snapshot(), { ...stored, ...custom })
    await click('Peruuta')
  })

  await t.test('T06 canceling discard preserves latest edits after a failed autosave', async () => {
    await seed({ ...stored, ...custom })
    await click('Treeni')
    await watchWrites(`key === '${draft}'`)
    await edit(75)
    await waitFor('document.querySelector("main [role=status]")?.textContent.includes("epäonnistui")')
    await goSettings()
    await open()
    await confirm()
    await click('Peruuta')
    assert.deepEqual(await snapshot(), { ...stored, ...custom })
    await click('Treeni')
    await expectDuration(75)
  })

  await t.test('T07 confirmed discard clears only the draft in addition to demo data', async () => {
    await seed({ ...stored, ...custom })
    await goSettings()
    await watchWrites()
    await open()
    await confirm()
    await discard(true)
    await expectSuccess()
    assert.equal(await raw(draft), 'null')
    assert.equal(await raw(sessions), stored[sessions])
    assert.equal(await raw(profileKey), stored[profileKey])
    assert.deepEqual(await writeKeys(), [program, exercises, settings, draft])

    await seed({ ...stored, ...custom })
    await goSettings()
    await open()
    await confirm()
    const newerRaw = JSON.stringify({ ...JSON.parse(custom[draft]), durationMinutes: 75 })
    await evaluate(`localStorage.setItem('${draft}', ${JSON.stringify(newerRaw)})`)
    await discard()
    await expectError('Palautus estettiin')
    assert.deepEqual(await snapshot(), { ...stored, ...custom, [draft]: newerRaw })
  })

  for (const [id, key] of [['T08', sessions], ['T09', draft]]) {
    await t.test(`${id} malformed ${key} blocks reset and survives unchanged`, async () => {
      const values = { ...stored, [key]: '  [{"broken": ' }
      await seed(values)
      await goSettings()
      await watchWrites()
      await open()
      await confirm()
      await expectError('Palautus estettiin')
      assert.deepEqual(await snapshot(), values)
      assert.deepEqual(await writeKeys(), [])
    })
  }

  await t.test('T10 SecurityError reading sessions, drafts or reset-owned data prevents writes', async () => {
    for (const key of [sessions, draft, program, exercises, settings]) {
      await seed()
      await goSettings()
      await watchWrites()
      await evaluate(`(() => {
        const read = Storage.prototype.getItem;
        Storage.prototype.getItem = function (key) {
          if (key === '${key}') throw new DOMException('Injected read failure', 'SecurityError');
          return read.call(this, key);
        };
      })()`)
      await open()
      await confirm()
      await expectError('Palautus estettiin')
      assert.deepEqual(await snapshot(), stored)
      assert.deepEqual(await writeKeys(), [])
    }
  })

  await t.test('T11 malformed JSON and unusable parsed shapes survive startup and draft autosave', async () => {
    for (const values of [
      Object.fromEntries(keys.map((key) => [key, ' { bad JSON '])),
      { [profileKey]: '[]', [program]: '{"workoutDays":[null]}', [exercises]: '[null]',
        [settings]: '{"theme":[]}', [draft]: '{"id":"draft","exercises":[]}', [sessions]: '[{"exercises":[null]}]' },
    ]) {
      await seed(values)
      await click('Treeni')
      await waitFor('document.querySelector("main [role=status]")?.textContent.includes("epäonnistui")')
      assert.deepEqual(await snapshot(), values)
      await goSettings()
      await open()
      await confirm()
      await expectError('Palautus estettiin')
      assert.deepEqual(await snapshot(), values)
    }

    await seed(stored, `(() => {
      const read = Storage.prototype.getItem;
      Storage.prototype.getItem = function () { throw new DOMException('Injected startup failure', 'SecurityError'); };
      window.restoreReads = () => { Storage.prototype.getItem = read; };
    })()`)
    assert.deepEqual(await snapshot(), stored)
    await evaluate('window.restoreReads()')
    await click('Treeni')
    await waitFor('document.querySelector("main [role=status]")?.textContent.includes("epäonnistui")')
    assert.deepEqual(await snapshot(), stored)
  })

  await t.test('T12 missing keys initialize with existing default behavior', async () => {
    await seed({})
    await waitFor(`localStorage.getItem('${settings}') !== null`)
    assert.deepEqual(Object.keys(await snapshot()).sort(), [profileKey, program, exercises, settings].sort())
    assert.deepEqual(JSON.parse(await raw(program)), defaultProgram)
    assert.deepEqual(JSON.parse(await raw(exercises)), defaultExercises)
    assert.deepEqual(JSON.parse(await raw(settings)), demoSettings)
    await click('Treeni')
    await waitFor(`Boolean(JSON.parse(localStorage.getItem('${draft}'))?.id)`)
  })

  await t.test('T13 write failure rolls back or reports incomplete restoration, never success', async () => {
    for (const rollbackFails of [false, true]) {
      await seed()
      await goSettings()
      await watchWrites(`key === '${settings}' ||
        (${rollbackFails} && key === '${program}' && value.includes('Oma ohjelma'))`)
      await open()
      await confirm()
      await expectError(rollbackFails ? 'saattoi muuttua' : 'muutokset peruttiin')
      assert.equal(await evaluate('Boolean(document.querySelector("main [role=status]"))'), false)
      assert.deepEqual(await snapshot(), rollbackFails
        ? { ...stored, [program]: JSON.stringify(defaultProgram) }
        : stored)
    }

    const values = { ...stored, ...custom }
    await seed(values)
    await goSettings()
    await watchWrites(`key === '${draft}'`)
    await open()
    await confirm()
    await discard()
    await expectError('muutokset peruttiin')
    assert.deepEqual(await snapshot(), values)
    await click('Treeni')
    await expectDuration(45)
  })

  await t.test('T14 rapid repeated reset taps execute one set of writes', async () => {
    await seed()
    await goSettings()
    await watchWrites()
    await open(true)
    await confirm(true)
    await expectSuccess()
    assert.deepEqual(await writeKeys(), [program, exercises, settings])
    assert.equal(await evaluate('Boolean(document.querySelector("dialog[open]"))'), false)
  })

  await t.test('T15 compatible pending or failed SAFE-3 edits survive reset and can still persist', async () => {
    for (const failure of [false, true]) {
      await seed({ ...stored, [draft]: JSON.stringify(compatible) })
      await click('Treeni')
      await watchWrites(`${failure} && !window.allowDraftWrites && key === '${draft}'`)
      if (!failure) {
        await evaluate(`(() => {
          const queue = window.queueMicrotask;
          window.queueMicrotask = (callback) => {
            if (new Error().stack.includes('useGymFlowData.js')) window.pendingDraftWrite = callback;
            else queue(callback);
          };
        })()`)
      }
      await edit(90)
      await waitFor(failure
        ? 'document.querySelector("main [role=status]")?.textContent.includes("epäonnistui")'
        : 'typeof window.pendingDraftWrite === "function"')
      await goSettings()
      await open()
      await confirm()
      await expectSuccess()
      assert.equal(JSON.parse(await raw(draft)).durationMinutes, 45)
      await click('Treeni')
      await expectDuration(90)
      if (failure) {
        await evaluate('window.allowDraftWrites = true')
        await click('Tallenna luonnos')
      } else {
        await evaluate('window.pendingDraftWrite()')
      }
      await waitFor('document.querySelector("main [role=status]")?.textContent === "Luonnos tallennettu"')
      assert.equal(JSON.parse(await raw(draft)).durationMinutes, 90)
    }
  })
})
