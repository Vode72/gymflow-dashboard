export const defaultProgram = {
  id: 'default-gymflow-program',
  name: 'GymFlow demo-ohjelma',
  workoutDays: [
    {
      id: 'day-upper-push',
      name: 'Päivä 1',
      description: 'Rinta, olkapäät ja ojentajat',
      exerciseIds: ['treadmill', 'shoulder-warmup', 'barbell-bench', 'smith-shoulder-press', 'dumbbell-lateral-raise', 'close-smith-bench', 'face-pull'],
      order: 1,
      active: true,
    },
    {
      id: 'day-lower-a',
      name: 'Päivä 2',
      description: 'Jalat ja keskivartalo',
      exerciseIds: ['treadmill', 'leg-press', 'hack-squat', 'leg-extension', 'hamstring-curl', 'ab-machine'],
      order: 2,
      active: true,
    },
    {
      id: 'day-upper-pull',
      name: 'Päivä 3',
      description: 'Selkä, hauis ja epäkkäät',
      exerciseIds: ['treadmill', 'lat-pulldown', 'bent-over-row', 'low-row', 'shrug', 'scott-curl', 'ab-bench'],
      order: 3,
      active: true,
    },
    {
      id: 'day-full-body',
      name: 'Päivä 4',
      description: 'Voimapainotteinen koko keho',
      exerciseIds: ['treadmill', 'trapbar-deadlift', 'incline-dumbbell-bench', 'pec-deck', 'face-pull', 'ab-machine'],
      order: 4,
      active: true,
    },
  ],
}
