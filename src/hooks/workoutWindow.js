// A document owns the workout only while its exclusive Web Lock is held.
const lockName = 'gymflow:workout'
const channelName = 'gymflow:workout-handoff'
const waitMs = 5000

export function coordinateWorkoutWindow({ locks, onAcquire, onState, canRelease }) {
  let channel
  let releaseLock
  let pending
  let closed = false
  let sequence = 0
  const windowId = globalThis.crypto?.randomUUID?.()
  const publish = (state) => { if (!closed) onState(state) }

  try {
    if (windowId) channel = new BroadcastChannel(channelName)
  } catch {
    // The lock still protects writes when the message channel is unavailable.
  }

  function release() {
    const unlock = releaseLock
    releaseLock = null
    unlock?.()
  }

  if (channel) channel.onmessage = ({ data }) => {
    if (data?.type === 'request' && releaseLock && data.expiresAt > Date.now()) {
      if (canRelease()) {
        release()
        publish('yielded')
      } else {
        channel.postMessage({ type: 'dirty', requestId: data.requestId })
      }
    } else if (data?.type === 'dirty' && pending?.id === data.requestId) {
      pending.failure = 'dirty'
      pending.controller.abort()
    }
  }

  async function acquire(transfer = false) {
    if (closed || pending || releaseLock) return
    if (!locks?.request) {
      publish('unavailable')
      return
    }

    const request = {
      id: `${windowId}:${++sequence}`,
      controller: new AbortController(),
      failure: 'timeout',
    }
    pending = request
    if (transfer) publish('requesting')
    const expiresAt = Date.now() + waitMs
    const timer = transfer ? setTimeout(() => request.controller.abort(), waitMs) : null
    try {
      const lockRequest = locks.request(lockName, transfer
        ? { signal: request.controller.signal }
        : { ifAvailable: true }, (lock) => {
        if (closed || request.controller.signal.aborted) return
        if (!lock) {
          publish('readonly')
          return
        }
        clearTimeout(timer)
        pending = null
        return new Promise((resolve) => {
          releaseLock = resolve
          try {
            if (onAcquire(transfer)) {
              publish('owner')
            } else {
              release()
              publish('storage-blocked')
            }
          } catch {
            release()
            publish('unavailable')
          }
        })
      })
      if (transfer) channel?.postMessage({ type: 'request', requestId: request.id, expiresAt })
      await lockRequest
    } catch {
      publish(request.controller.signal.aborted ? request.failure : 'unavailable')
    } finally {
      clearTimeout(timer)
      if (pending === request) pending = null
    }
  }

  return {
    ownsWorkout: () => Boolean(releaseLock),
    acquire,
    close() {
      closed = true
      pending?.controller.abort()
      release()
      channel?.close()
    },
  }
}
