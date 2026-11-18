import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const workout = readFileSync(new URL('../src/pages/Workout.jsx', import.meta.url), 'utf8')
const hook = readFileSync(new URL('../src/hooks/useGymFlowData.js', import.meta.url), 'utf8')
function extract(source, name) {
  const start = source.indexOf(`  function ${name}(`)
  assert.notEqual(start, -1)
  const end = source.indexOf('\n  }', start) + 4
  return source.slice(start, end)
}
function harness(draft = null) {
  const queued = []
  const context = vm.createContext({
    activeDraft: draft,
    pendingDaySwitchRef: { current: null },
    activeDays: ['a', 'b', 'c'].map(id => ({ id, exerciseIds: ['lift'], name: id })),
    exercises: [{ id: 'lift', name: 'Lift' }],
    setActiveDraft: update => queued.push(update),
    selectedDayId: draft?.workoutDayId ?? null,
    onSelectWorkoutDay: id => { context.parentDayId = id },
    setSelectedDayId: id => { context.selectedDayId = id },
    setPendingDaySwitch: value => { context.pending = value },
    setSelectedExerciseState() {}, setCompletedSummary() {}, setShowConfirm() {},
    setCustomExerciseNotice() {}, setTargetedWarmupPopupOpen() {}, setTargetedWarmupPopupMode() {},
    createDraft: (day, exercises) => ({ id: `new-${day.id}`, workoutDayId: day.id, exercises }),
  })
  vm.runInContext([
    extract(hook, 'startDraft'),
    ...['cancelDaySwitch', 'selectWorkoutDay', 'confirmDaySwitch', 'applyWorkoutDay'].map(name => extract(workout, name)),
  ].join('\n'), context)
  context.flush = () => { while (queued.length) context.activeDraft = queued.shift()(context.activeDraft) }
  return context
}
const draft = () => ({ id: 'saved-draft', workoutDayId: 'a', exercises: [{ setsText: '12/40 + 10/50' }], durationMinutes: 45 })

test('A: without draft a selected day starts normally', () => {
  const h = harness(); h.selectWorkoutDay('b'); h.startDraft(h.activeDays[1], h.exercises); h.flush()
  assert.equal(h.activeDraft.workoutDayId, 'b'); assert.equal(h.pending, undefined)
})
test('B: same day preserves the exact draft and entered data', () => {
  const existing = draft(); const h = harness(existing)
  h.selectWorkoutDay('a'); h.startDraft(h.activeDays[0], h.exercises); h.flush()
  assert.equal(h.activeDraft, existing); assert.equal(h.pending, undefined)
})
test('C: different day requests confirmation without changing day or draft', () => {
  const existing = draft(); const h = harness(existing); h.selectWorkoutDay('b'); h.flush()
  assert.equal(h.activeDraft, existing); assert.equal(h.selectedDayId, 'a'); assert.equal(h.pending.dayId, 'b')
})
test('D: cancel preserves current day and all data', () => {
  const existing = draft(); const h = harness(existing); h.selectWorkoutDay('b'); h.cancelDaySwitch(); h.confirmDaySwitch(); h.flush()
  assert.equal(h.activeDraft, existing); assert.equal(h.selectedDayId, 'a')
})
test('E: explicit discard starts the requested day', () => {
  const h = harness(draft()); h.selectWorkoutDay('b'); h.confirmDaySwitch(); h.flush()
  assert.equal(h.activeDraft.workoutDayId, 'b'); assert.equal(h.selectedDayId, 'b')
})
test('F: rapid selections and double confirmation cannot change the captured target', () => {
  const h = harness(draft()); h.selectWorkoutDay('b'); h.selectWorkoutDay('c')
  assert.equal(h.pending.dayId, 'b'); h.confirmDaySwitch(); h.confirmDaySwitch(); h.flush()
  assert.equal(h.activeDraft.workoutDayId, 'b')
})
test('G: stale confirmation preserves newer data, including an update queued before discard', () => {
  const h = harness(draft()); h.selectWorkoutDay('b'); const newer = { ...h.activeDraft, durationMinutes: 60 }
  h.activeDraft = newer; h.confirmDaySwitch(); h.flush(); assert.equal(h.activeDraft, newer)
  const race = harness(draft()); race.selectWorkoutDay('b')
  race.setActiveDraft(current => ({ ...current, durationMinutes: 75 }))
  race.confirmDaySwitch(); race.flush(); assert.equal(race.activeDraft.workoutDayId, 'a'); assert.equal(race.activeDraft.durationMinutes, 75)
})
test('H: restored old draft without optional fields is preserved by automatic start', () => {
  const restored = JSON.parse('{"id":"old","workoutDayId":"a","exercises":[]}')
  const h = harness(restored); h.startDraft(h.activeDays[0], h.exercises); h.startDraft(h.activeDays[1], h.exercises); h.flush()
  assert.equal(h.activeDraft, restored)
})
