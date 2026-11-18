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

const sessionsKey = 'gymflow_sessions'
const draftKey = 'gymflow_active_draft'
const legacySession = {
  id: 'legacy-1',
  date: '2025-12-01',
  startTime: '08:00',
  workoutName: 'Vanha testitreeni',
  status: 'completed',
  exercises: [{ exerciseId: 'barbell-bench', name: 'Penkki', sets: [{ reps: 5, weight: 40 }] }],
}
const draft = {
  id: 'old-draft',
  date: legacySession.date,
  startTime: '16:00',
  createdAt: '2025-12-01T16:00:00.000Z',
  workoutDayId: 'day-upper-push',
  workoutName: 'SAFE-2 testitreeni',
  durationMinutes: 60,
  feeling: 'Hyvä',
  status: 'draft',
  exercises: [
    {
      exerciseId: 'barbell-bench',
      trackingType: 'sets',
      setsText: '12/40',
      sets: [{ reps: 12, weight: 40 }],
      exerciseComment: 'Testikommentti',
      durationMinutes: 14,
    },
    {
      exerciseId: 'rowing-warmup',
      trackingType: 'warmupDuration',
      durationMinutes: 8,
      warmupType: 'Soutu',
      completed: true,
      note: 'Testilämmittely',
    },
  ],
}

test('SAFE-2 saves and recovers through Workout and History', { timeout: 45_000 }, async (t) => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
  t.after(() => server.close())
  await server.listen()
  const url = server.resolvedUrls.local[0]

  const profile = await mkdtemp(join(tmpdir(), 'gymflow-safe2-'))
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
  const getRaw = (key) => evaluate(`localStorage.getItem(${JSON.stringify(key)})`)
  const read = async (key) => JSON.parse(await getRaw(key))
  async function reload() {
    await evaluate('window.beforeSafe2Reload = true')
    await cdp('Page.reload')
    await waitFor(`!window.beforeSafe2Reload && ${view('Tänään')}`)
  }
  async function seed(sessionData = JSON.stringify([legacySession]), nextDraft = draft) {
    await evaluate(`window.restoreTestWrites?.();
      localStorage.setItem(${JSON.stringify(sessionsKey)}, ${JSON.stringify(sessionData)});
      localStorage.setItem(${JSON.stringify(draftKey)}, ${JSON.stringify(JSON.stringify(nextDraft))})`)
    await reload()
    await click('Treeni')
  }
  async function instrument() {
    await evaluate(`(() => {
      const write = Storage.prototype.setItem;
      window.restoreTestWrites = () => { Storage.prototype.setItem = write; };
      window.sessionWrites = [];
      Storage.prototype.setItem = function (key, value) {
        if (key === '${sessionsKey}') {
          window.sessionWrites.push(['session', JSON.parse(this.getItem('${draftKey}'))?.id]);
          if (window.failSession) throw new DOMException('Test quota', 'QuotaExceededError');
        }
        if (key === '${draftKey}' && value === 'null') {
          const ids = JSON.parse(this.getItem('${sessionsKey}')).map(session => session.id);
          window.sessionWrites.push(['cleanup', ids]);
          if (window.failCleanup) throw new DOMException('Test access', 'SecurityError');
        }
        return write.call(this, key, value);
      };
    })()`)
  }
  const openConfirmation = () => click('Merkitse valmiiksi')
  const confirm = (repeat) => click('Kyllä, tallenna', repeat)
  const retry = () => click('Yritä uudelleen')
  const assertError = async (message) => {
    await waitFor(`document.querySelector('[role="alert"]')?.textContent.includes(${JSON.stringify(message)})`)
    assert.equal(await evaluate(view('Treeni')), true)
    assert.equal(await evaluate(`Boolean(${button('Yritä uudelleen')})`), true)
  }

  await cdp('Page.navigate', { url })
  await waitFor(view('Tänään'))

  await t.test('first confirmation appends to the latest stored history', async () => {
    await seed('[]')
    await evaluate(`localStorage.setItem('${sessionsKey}', ${JSON.stringify(JSON.stringify([legacySession]))})`)
    await openConfirmation()
    await confirm(true)
    await waitFor(view('Historia'))
    const [legacy, saved, ...extra] = await read(sessionsKey)
    assert.deepEqual(legacy, legacySession)
    assert.equal(saved.workoutName, draft.workoutName)
    assert.deepEqual(extra, [])
    assert.equal(await read(draftKey), null)
  })

  await t.test('quota failure preserves the draft, retry writes once before cleanup, reload preserves History', async () => {
    await seed()
    await instrument()
    await evaluate('window.failSession = true')
    await openConfirmation()
    await confirm()
    await assertError('Treeniä ei voitu tallentaa')
    assert.deepEqual(await read(draftKey), draft)
    assert.deepEqual(await read(sessionsKey), [legacySession])
    assert.deepEqual(await evaluate('window.sessionWrites'), [['session', draft.id]])

    await evaluate('window.failSession = false; window.sessionWrites = []')
    await click('Yritä uudelleen', true)
    await waitFor(view('Historia'))
    const [legacy, ...saved] = await read(sessionsKey)
    assert.deepEqual(legacy, legacySession)
    assert.equal(saved.length, 1)
    const [session] = saved
    assert.deepEqual(await evaluate('window.sessionWrites.slice(0, 2)'), [
      ['session', draft.id], ['cleanup', [legacy.id, session.id]],
    ])
    assert.equal(await evaluate('window.sessionWrites.filter(([kind]) => kind === "session").length'), 1)
    assert.equal(await read(draftKey), null)
    assert.deepEqual(session.exercises, draft.exercises)
    for (const key of ['date', 'startTime', 'createdAt', 'workoutDayId', 'workoutName', 'durationMinutes', 'feeling']) {
      assert.equal(session[key], draft[key])
    }
    assert.equal(session.status, 'completed')
    assert.match(session.endTime, /^\d\d:\d\d$/)
    assert.ok(Date.parse(session.completedAt))
    assert.equal(session.updatedAt, session.completedAt)

    await reload()
    assert.equal(await read(draftKey), null)
    await click('Historia')
    await waitFor(`document.querySelector('main').textContent.includes('${draft.workoutName}') &&
      document.querySelector('main').textContent.includes('${legacy.workoutName}')`)
    await click('Treeni')
    await waitFor(`localStorage.getItem('${draftKey}') !== 'null'`)
    assert.notEqual((await read(draftKey)).id, draft.id)
    assert.deepEqual(await read(sessionsKey), [legacy, session])
  })

  await t.test('cleanup failure survives refresh and retries without rewriting the session', async () => {
    await seed()
    await instrument()
    await evaluate('window.failCleanup = true')
    await openConfirmation()
    await confirm(true)
    await assertError('Treeni on tallennettu')
    const saved = await read(sessionsKey)
    assert.equal(saved.length, 2)
    assert.deepEqual(await read(draftKey), draft)

    await reload()
    await click('Treeni')
    await assertError('Treeni on tallennettu')
    await instrument()
    await evaluate('window.failSession = true')
    await retry()
    await waitFor(view('Historia'))
    assert.deepEqual(await evaluate('window.sessionWrites[0]'), ['cleanup', saved.map(({ id }) => id)])
    assert.deepEqual(await read(sessionsKey), saved)
    assert.equal(await read(draftKey), null)
  })

  await t.test('malformed session storage survives startup and a save attempt', async () => {
    for (const malformed of ['{bad json', '{"sessions":[]}', '[null]']) {
      await seed(malformed)
      assert.equal(await getRaw(sessionsKey), malformed)
      await openConfirmation()
      await confirm()
      await assertError('Treeniä ei voitu tallentaa')
      assert.equal(await getRaw(sessionsKey), malformed)
      assert.deepEqual(await read(draftKey), draft)
    }
  })

  await t.test('blocked storage reads can be retried with a legacy draft missing optional fields', async () => {
    const olderDraft = { ...draft, id: 'older-draft', exercises: [] }
    delete olderDraft.createdAt
    delete olderDraft.durationMinutes
    await seed(JSON.stringify([legacySession]), olderDraft)
    await evaluate(`(() => {
      const read = Storage.prototype.getItem;
      Storage.prototype.getItem = function (key) {
        if (window.failRead && key === '${sessionsKey}') throw new DOMException('Test access', 'SecurityError');
        return read.call(this, key);
      };
      window.failRead = true;
    })()`)
    await openConfirmation()
    await confirm()
    await assertError('Treeniä ei voitu tallentaa')
    assert.deepEqual(await read(draftKey), olderDraft)
    await evaluate('window.failRead = false')
    await retry()
    await waitFor(view('Historia'))
    const [legacy, saved] = await read(sessionsKey)
    assert.deepEqual(legacy, legacySession)
    assert.equal(saved.durationMinutes, 0)
    assert.equal(saved.createdAt, saved.completedAt)
  })
})
