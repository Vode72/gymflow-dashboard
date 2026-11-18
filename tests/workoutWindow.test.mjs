import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer as createNetServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'
import { createServer } from 'vite'

function protocol(send, receive) {
  let sequence = 0
  const pending = new Map()
  receive((message) => {
    const { id, result, error, message: detail } = JSON.parse(message)
    const request = pending.get(id)
    if (!request) return
    pending.delete(id)
    if (error) request.reject(new Error(detail ?? error.message ?? error))
    else request.resolve(result)
  })
  return (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    send(JSON.stringify({ id, method, params, sessionId }))
  })
}

function launch(t, bin, args, options) {
  const child = spawn(bin, args, options)
  child.on('error', (error) => t.diagnostic(error.message))
  t.after(async () => {
    if (!child.pid || child.exitCode !== null || child.signalCode !== null) return
    const exited = new Promise((resolve) => child.once('exit', resolve))
    child.kill()
    await exited
  })
  return child
}

async function chromiumDriver(t, bin, profile) {
  const browser = launch(t, bin, [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
    '--remote-debugging-pipe', `--user-data-dir=${profile}`,
  ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] })
  const send = protocol(
    (message) => browser.stdio[3].write(message + '\0'),
    (accept) => {
      let buffer = ''
      browser.stdio[4].setEncoding('utf8').on('data', (chunk) => {
        const messages = (buffer + chunk).split('\0')
        buffer = messages.pop()
        for (const message of messages) accept(message)
      })
    },
  )
  t.diagnostic((await send('Browser.getVersion')).product)

  return async () => {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
    const cdp = (method, params) => send(method, params, sessionId)
    await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
    return {
      go: (url) => cdp('Page.navigate', { url }),
      close: () => send('Target.closeTarget', { targetId }),
      async eval(expression) {
        const response = await cdp('Runtime.evaluate', { expression, returnByValue: true })
        if (response.exceptionDetails) throw new Error(response.result.description ?? response.exceptionDetails.text)
        return response.result.value
      },
    }
  }
}

async function firefoxDriver(t, bin, profile) {
  const listener = createNetServer()
  await new Promise((resolve, reject) => {
    listener.once('error', reject)
    listener.listen(0, '127.0.0.1', resolve)
  })
  const { port } = listener.address()
  await new Promise((resolve) => listener.close(resolve))
  launch(t, process.env.GECKODRIVER_BIN || 'geckodriver', ['--port', String(port), '--profile-root', profile], {
    stdio: 'ignore',
    env: { ...process.env, XDG_CACHE_HOME: profile, XDG_CONFIG_HOME: profile },
  })
  const url = `http://127.0.0.1:${port}`
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await fetch(`${url}/status`).then((response) => response.ok).catch(() => false)) break
    await delay(100)
  }
  const response = await fetch(`${url}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ capabilities: { alwaysMatch: {
      browserName: 'firefox',
      webSocketUrl: true,
      'moz:firefoxOptions': { binary: bin, args: ['-headless'] },
    } } }),
  })
  const { value } = await response.json()
  assert.equal(response.ok, true, JSON.stringify(value))
  t.after(() => fetch(`${url}/session/${value.sessionId}`, { method: 'DELETE' }).catch(() => {}))
  t.diagnostic(`Firefox ${value.capabilities.browserVersion}`)
  const socket = new WebSocket(value.capabilities.webSocketUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  t.after(() => socket.close())
  const send = protocol((message) => socket.send(message), (accept) => {
    socket.addEventListener('message', (event) => accept(event.data))
  })
  return async () => {
    const { context } = await send('browsingContext.create', { type: 'tab' })
    await send('browsingContext.setViewport', { context, viewport: { width: 390, height: 844 } })
    return {
      go: (url) => send('browsingContext.navigate', { context, url, wait: 'interactive' }),
      close: () => send('browsingContext.close', { context }),
      async eval(expression) {
        const result = await send('script.evaluate', {
          expression: `JSON.stringify((${expression}))`, target: { context }, awaitPromise: false,
        })
        if (result.type === 'exception') throw new Error(result.exceptionDetails.text)
        return result.result.value === undefined ? undefined : JSON.parse(result.result.value)
      },
    }
  }
}

const draft = 'gymflow_active_draft'
const sessions = 'gymflow_sessions'
const transfer = 'Pyydä treenin hallinta'
const saved = 'Luonnos tallennettu'
const button = (label) => `[...document.querySelectorAll('button')].find(button => button.textContent.trim() === ${JSON.stringify(label)})`
const durationButton = (minutes) => `[...document.querySelectorAll('[aria-label="Treenin keston pikavalinnat"] button')].find(button => button.textContent === '${minutes}')`
const text = (value) => `document.querySelector('main')?.textContent.includes(${JSON.stringify(value)})`
const savedStatus = `[...document.querySelectorAll('main [role=status]')].some(node => node.textContent === '${saved}')`
const selectedDuration = (minutes) => `(${durationButton(minutes)})?.getAttribute('aria-pressed') === 'true'`
const raw = (page, key = draft) => page.eval(`localStorage.getItem('${key}')`)
const view = (label) => `document.querySelector('nav [aria-current="page"]')?.textContent.trim() === '${label}'`

async function waitFor(page, condition, timeout = 8000) {
  const deadline = Date.now() + timeout
  do {
    if (await page.eval(condition).catch(() => false)) return
    await delay(50)
  } while (Date.now() < deadline)
  assert.fail(`Browser condition did not become true: ${condition}`)
}

async function click(page, label, repeat = false) {
  const target = button(label)
  await waitFor(page, `Boolean(${target})`)
  await page.eval(`(() => { const target = ${target}; target.click(); ${repeat ? 'target.click();' : ''} })()`)
}

async function edit(page, minutes) {
  const target = durationButton(minutes)
  await waitFor(page, `Boolean(${target})`)
  await page.eval(`(${target}).click()`)
  await waitFor(page, selectedDuration(minutes))
}

const browserFamily = process.env.FIREFOX_BIN ? 'Firefox' : 'Chromium/CDP'
test(`SAFE-4B workout conflicts in ${browserFamily}`, { timeout: 90_000 }, async (t) => {
  const profile = await mkdtemp(join(tmpdir(), 'gymflow-safe4b-'))
  const driverHooks = []
  t.after(async () => {
    for (const cleanup of driverHooks.reverse()) await cleanup()
    await rm(profile, { recursive: true, force: true, maxRetries: 5 })
  })
  const server = await createServer({
    cacheDir: join(profile, 'vite'),
    server: { host: '127.0.0.1', port: 0 },
    plugins: [{
      name: 'safe4b-test-browser-capabilities',
      transformIndexHtml(html, context) {
        if (context.originalUrl?.includes('no-locks')) {
          return html.replace('<head>', '<head><script>Object.defineProperty(navigator, "locks", { value: undefined })</script>')
        }
        if (context.originalUrl?.includes('no-channel')) {
          return html.replace('<head>', '<head><script>globalThis.BroadcastChannel = undefined</script>')
        }
        return html
      },
    }],
  })
  await server.listen()
  t.after(() => server.close())
  const url = server.resolvedUrls.local[0]
  const driverContext = { after: (callback) => driverHooks.push(callback), diagnostic: (message) => t.diagnostic(message) }
  const tab = process.env.FIREFOX_BIN
    ? await firefoxDriver(driverContext, process.env.FIREFOX_BIN, profile)
    : await chromiumDriver(driverContext, process.env.CHROMIUM_BIN || 'chromium', profile)

  async function open(path = '') {
    const page = await tab()
    await page.go(url + path)
    await click(page, 'Treeni')
    return page
  }

  const findOwner = `Boolean(${button('Merkitse valmiiksi')})`
  const first = await open()
  await t.test('one window edits and persists a workout', async () => {
    await waitFor(first, savedStatus)
    await edit(first, 60)
    await waitFor(first, savedStatus)
    const stored = JSON.parse(await raw(first))
    assert.equal(stored.durationMinutes, 60)
    assert.ok(Date.parse(stored.savedAt))
  })

  const second = await open()
  await t.test('second window is read-only, with timestamps and working History, Progress and blocked reset', async () => {
    await waitFor(second, text('Treeni on aktiivinen toisessa ikkunassa.'))
    assert.equal(await second.eval(findOwner), false)
    assert.equal(await second.eval(`[...document.querySelectorAll('main p')].slice(1, 4).some(p => p.textContent.includes('Ei tiedossa'))`), false)
    assert.equal(await second.eval('document.documentElement.scrollWidth <= innerWidth'), true)
    for (const label of ['Historia', 'Kehitys']) {
      await click(second, label)
      await waitFor(second, view(label))
    }
    const before = await second.eval('JSON.stringify(Object.entries(localStorage).sort())')
    await click(second, 'Asetukset')
    await click(second, 'Palauta demodata')
    await click(second, 'Vahvista palautus')
    await waitFor(second, text('Palautus estettiin.'))
    assert.equal(await second.eval('JSON.stringify(Object.entries(localStorage).sort())'), before)
    await click(second, 'Treeni')
  })

  await t.test('failed and queued saves prevent transfer until explicitly saved, repeated clicks transfer once', async () => {
    const before = await raw(first)
    await first.eval(`(() => {
      const enqueue = window.queueMicrotask
      window.queueMicrotask = callback => {
        if (new Error().stack.includes('useGymFlowData.js')) window.delayedAutosave = callback
        else enqueue(callback)
      }
      const original = Storage.prototype.setItem
      window.failDraft = true
      Storage.prototype.setItem = function(key, value) {
        if (window.failDraft && key === '${draft}') throw new DOMException('Test', 'QuotaExceededError')
        return original.call(this, key, value)
      }
    })()`)
    await edit(first, 75)
    await waitFor(first, 'typeof window.delayedAutosave === "function"')
    await click(second, transfer, true)
    await waitFor(second, text('Toisessa ikkunassa oli tallentamattomia muutoksia pyyntöhetkellä.'))
    assert.equal(await raw(first), before)
    await first.eval('window.delayedAutosave()')
    await waitFor(first, text('Luonnoksen tallennus epäonnistui.'))
    await click(second, transfer)
    await waitFor(second, text('Toisessa ikkunassa oli tallentamattomia muutoksia pyyntöhetkellä.'))
    await edit(first, 90)
    await first.eval('(window.failDraft = false)')
    await click(first, 'Tallenna luonnos')
    await waitFor(first, savedStatus)
    await click(second, transfer, true)
    await waitFor(second, selectedDuration(90))
    await waitFor(first, text('Treenin hallinta luovutettiin.'))
    await edit(second, 105)
    await waitFor(second, savedStatus)
    const updated = await raw(second)
    await first.eval('window.delayedAutosave()')
    assert.equal(await raw(first), updated)
    assert.equal(JSON.parse(updated).durationMinutes, 105)
    assert.equal(await first.eval(findOwner), false)
  })

  await t.test('ownership can be recovered after the owning tab closes, and refresh restores the draft', async () => {
    await second.close()
    await click(first, transfer)
    await waitFor(first, selectedDuration(105))
    await first.go(url + '?refreshed')
    await click(first, 'Treeni')
    await waitFor(first, selectedDuration(105))
    await waitFor(first, savedStatus)
  })

  await t.test('a newer raw snapshot blocks a stale save even before any storage notification', async () => {
    await first.eval(`(() => {
      const stored = JSON.parse(localStorage.getItem('${draft}'))
      localStorage.setItem('${draft}', JSON.stringify({ ...stored, durationMinutes: 120 }))
      ;(${durationButton(45)}).click()
    })()`)
    await waitFor(first, text('Tallennettu treenidata muuttui'))
    assert.equal(JSON.parse(await raw(first)).durationMinutes, 120)
    await first.close()
  })

  await t.test('concurrent tabs get one writer, a nonresponding owner keeps its lock, and completion persists', async () => {
    const silentOwner = await open('?no-channel')
    await waitFor(silentOwner, selectedDuration(120))
    const follower = await open()
    await click(follower, transfer, true)
    await waitFor(follower, text('Hallintaa ei saatu.'))
    assert.equal(await follower.eval(findOwner), false)
    assert.equal(await silentOwner.eval(findOwner), true)
    await silentOwner.close()
    await click(follower, transfer)
    await waitFor(follower, selectedDuration(120))
    await click(follower, 'Merkitse valmiiksi')
    await click(follower, 'Kyllä, tallenna')
    await waitFor(follower, view('Historia'))
    assert.equal(await raw(follower), 'null')
    const completed = JSON.parse(await raw(follower, sessions)).filter((session) => session.id.startsWith('session-from-'))
    assert.equal(completed.length, 1)
    assert.equal(completed[0].durationMinutes, 120)
    assert.equal(Object.hasOwn(completed[0], 'savedAt'), false)
    await follower.close()

    const pages = await Promise.all([open(), open()])
    await Promise.all(pages.map((page) => waitFor(page, `${findOwner} || ${text('Treeni on aktiivinen toisessa ikkunassa.')}`)))
    const writers = await Promise.all(pages.map((page) => page.eval(findOwner)))
    assert.equal(writers.filter(Boolean).length, 1)
    const [winner, loser] = writers[0] ? pages : pages.toReversed()
    await Promise.all([
      edit(winner, 30),
      loser.eval(`(${durationButton(75)})?.click()`),
    ])
    await waitFor(winner, savedStatus)
    assert.equal(JSON.parse(await raw(winner)).durationMinutes, 30)
    await Promise.all(pages.map((page) => page.close()))
  })

  await t.test('handoff with unreadable workout data leaves the requester read-only', async () => {
    const owner = await open()
    await waitFor(owner, savedStatus)
    const follower = await open()
    await waitFor(follower, text('Treeni on aktiivinen toisessa ikkunassa.'))
    await owner.eval(`localStorage.setItem('${draft}', '{ broken draft')`)
    await click(follower, transfer)
    await waitFor(follower, text('Tallennettua treenidataa ei voitu lukea turvallisesti.'))
    assert.equal(await follower.eval(findOwner), false)
    assert.equal(await raw(follower), '{ broken draft')
    await owner.close()
    await follower.close()
  })

  await t.test('without Web Locks, Workout and reset fail closed while History stays accessible', async () => {
    const noLocks = await open('?no-locks')
    await waitFor(noLocks, text('Selain ei tässä näkymässä voi varmistaa'))
    assert.equal(await noLocks.eval(findOwner), false)
    const before = await raw(noLocks)
    await click(noLocks, 'Historia')
    await waitFor(noLocks, view('Historia'))
    await click(noLocks, 'Asetukset')
    await click(noLocks, 'Palauta demodata')
    await click(noLocks, 'Vahvista palautus')
    await waitFor(noLocks, text('Palautus estettiin.'))
    assert.equal(await raw(noLocks), before)
    await noLocks.close()
  })
})
