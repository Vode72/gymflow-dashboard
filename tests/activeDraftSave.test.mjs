import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createServer } from 'vite'

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

test('SAFE-3 active draft persistence through Workout', { timeout: 45_000 }, async (t) => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  t.after(() => server.close())
  await server.listen()
  const url = server.resolvedUrls.local[0]

  const profile = await mkdtemp(join(tmpdir(), 'gymflow-safe3-'))
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
  const draftKey = 'gymflow_active_draft'
  const sessionsKey = 'gymflow_sessions'
  const saved = 'Luonnos tallennettu'
  const unsaved = 'Tallentamattomia muutoksia'
  const error = 'Luonnoksen tallennus epäonnistui. Yritä uudelleen.'
  const status = 'document.querySelector("main [role=status]")?.textContent'
  const expectStatus = (message) => waitFor(`${status} === ${JSON.stringify(message)}`)
  const read = (key = draftKey) => evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
  const durationButton = (minutes) =>
    `[...document.querySelectorAll('[aria-label="Treenin keston pikavalinnat"] button')]
      .find(button => button.textContent === '${minutes}')`
  const edit = (minutes) => evaluate(`${durationButton(minutes)}.click()`)
  const expectDuration = (minutes) => waitFor(`${durationButton(minutes)}?.getAttribute('aria-pressed') === 'true'`)
  const retry = () => click('Tallenna luonnos')
  const failure = (name) => evaluate(`window.testDraftWriteError = ${JSON.stringify(name)}`)
  const writes = () => evaluate('window.testDraftWrites')
  const release = () => evaluate('window.testDraftAutosaves.shift()()')
  const waitForQueue = (count) => waitFor(`window.testDraftAutosaves.length === ${count}`)

  async function instrument() {
    await evaluate(`(() => {
      const write = Storage.prototype.setItem;
      const schedule = window.queueMicrotask;
      window.testDraftWrites = [];
      window.testDraftAutosaves = [];
      Storage.prototype.setItem = function (key, value) {
        if (key === '${draftKey}') {
          window.testDraftWrites.push([JSON.parse(value)?.durationMinutes ?? null, ${status} ?? null]);
          if (value !== 'null' && window.testDraftWriteError) {
            throw new DOMException('Injected storage failure', window.testDraftWriteError);
          }
        }
        return write.call(this, key, value);
      };
      window.queueMicrotask = (callback) => {
        if (window.holdDraftAutosaves && new Error().stack.includes('useGymFlowData.js')) {
          window.testDraftAutosaves.push(callback);
        } else {
          schedule(callback);
        }
      };
    })()`)
  }

  async function reload() {
    await evaluate('window.beforeSafe3Reload = true')
    await cdp('Page.reload')
    await waitFor(`!window.beforeSafe3Reload && ${view('Tänään')}`)
    await click('Treeni')
    await expectStatus(saved)
    await instrument()
  }

  await cdp('Page.navigate', { url })
  await waitFor(view('Tänään'))
  await click('Treeni')
  await expectStatus(saved)
  await instrument()

  await t.test('T01 autosave acknowledges an edit only after writing it', async () => {
    await edit(60)
    await expectStatus(saved)
    assert.equal((await read()).durationMinutes, 60)
    assert.deepEqual(await writes(), [[60, unsaved]])
  })

  await t.test('T02 quota failure preserves the stored and in-memory drafts', async () => {
    await failure('QuotaExceededError')
    await edit(75)
    await expectStatus(error)
    await expectDuration(75)
    assert.equal((await read()).durationMinutes, 60)
  })

  await t.test('T03 manual save attempts a synchronous write and retries the latest edits', async () => {
    const saveButton = button('Tallenna luonnos')
    const attempted = () => evaluate(`(() => {
      const before = window.testDraftWrites.length;
      (${saveButton}).click();
      return window.testDraftWrites.length - before;
    })()`)
    assert.equal(await attempted(), 1)
    await expectStatus(error)
    assert.equal((await read()).durationMinutes, 60)
    await failure(null)
    assert.equal(await attempted(), 1)
    await expectStatus(saved)
    assert.equal((await read()).durationMinutes, 75)
  })

  await t.test('T04 rapid committed edits cannot receive a stale acknowledgement', async () => {
    await evaluate('window.holdDraftAutosaves = true; window.testDraftWrites = []')
    await edit(90)
    await waitForQueue(1)
    await expectStatus(unsaved)
    await edit(105)
    await waitForQueue(2)
    await release()
    assert.deepEqual(await writes(), [])
    assert.equal(await evaluate(status), unsaved)
    assert.equal((await read()).durationMinutes, 75)
    await release()
    await expectStatus(saved)
    assert.deepEqual(await writes(), [[105, unsaved]])
    assert.equal((await read()).durationMinutes, 105)
    await evaluate('window.holdDraftAutosaves = false')
  })

  await t.test('T05 reload before retry restores the previous persisted version', async () => {
    await failure('QuotaExceededError')
    await edit(120)
    await expectStatus(error)
    await expectDuration(120)
    assert.equal((await read()).durationMinutes, 105)
    await reload()
    await expectDuration(105)
    assert.equal((await read()).durationMinutes, 105)
  })

  await t.test('T06 reload after a successful retry restores the latest edits', async () => {
    await failure('QuotaExceededError')
    await edit(120)
    await expectStatus(error)
    await failure(null)
    await retry()
    await expectStatus(saved)
    await reload()
    await expectDuration(120)
    assert.equal((await read()).durationMinutes, 120)
  })

  await t.test('T07 switching days explicitly warns about failed edits and cancel preserves them', async () => {
    const persisted = await read()
    await failure('SecurityError')
    await edit(45)
    await expectStatus(error)
    await evaluate('document.querySelectorAll(".workout-day-picker button")[1].click()')
    await waitFor('document.querySelector("dialog[open]")?.textContent.includes("Luonnoksessa on tallentamattomia muutoksia.")')
    assert.deepEqual(await read(), persisted)
    await click('Peruuta')
    await expectStatus(error)
    await expectDuration(45)
    assert.deepEqual(await read(), persisted)
  })

  await t.test('T08 completion saves the latest edits and cancels pending draft autosave', async () => {
    const persisted = await read()
    await failure(null)
    await evaluate('window.holdDraftAutosaves = true; window.testDraftWrites = []')
    await edit(30)
    await waitForQueue(1)
    await click('Merkitse valmiiksi')
    await click('Kyllä, tallenna')
    await waitFor(view('Historia'))
    await release()
    assert.deepEqual(await writes(), [[null, error]])
    assert.equal(await read(), null)
    const sessions = await read(sessionsKey)
    const completed = sessions.filter(({ id }) => id === `session-from-${persisted.id}`)
    assert.equal(completed.length, 1)
    assert.equal(completed[0].durationMinutes, 30)
    assert.equal(completed[0].status, 'completed')
  })

  await t.test('T09 legacy drafts with missing optional fields can be restored and saved', async () => {
    const legacy = {
      id: 'safe3-legacy', date: '2025-12-01', startTime: '16:00', status: 'draft',
      workoutDayId: 'day-upper-push', workoutName: 'Vanha luonnos', exercises: [],
    }
    await evaluate(`localStorage.setItem('${draftKey}', ${JSON.stringify(JSON.stringify(legacy))})`)
    await reload()
    assert.deepEqual(await read(), legacy)
    await edit(30)
    await expectStatus(saved)
    const { updatedAt, ...persisted } = await read()
    assert.ok(Date.parse(updatedAt))
    assert.deepEqual(persisted, { ...legacy, durationMinutes: 30 })
  })

  await t.test('T10 restricted storage keeps the error until a successful write', async () => {
    const persisted = await read()
    await failure('SecurityError')
    await edit(45)
    await expectStatus(error)
    await edit(60)
    await expectDuration(60)
    await expectStatus(error)
    assert.deepEqual(await read(), persisted)
    await failure(null)
    assert.equal(await evaluate(status), error)
    await edit(75)
    await expectStatus(saved)
    assert.equal((await read()).durationMinutes, 75)
  })
})
