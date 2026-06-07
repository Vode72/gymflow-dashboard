import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defaultExercises } from '../src/data/defaultExercises.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = path.join(repoRoot, 'src', 'assets', 'exercises')
const imageMapPath = path.join(repoRoot, 'src', 'data', 'exerciseImages.js')

const expectedMappings = [
  ['Kävelymatto', 'Treadmill Walking', 'treadmill-walking'],
  ['Olkapäiden lämmittelyä', 'Shoulder Warm-Up Routine', 'shoulder-warm-up-routine'],
  ['Venyttelyä', 'Stretching Routine', 'stretching-routine'],
  ['Kuntopyörä', 'Stationary Bike', 'stationary-bike'],
  ['Scott-penkki', 'Scott Bench Curl', 'scott-bench-curl'],
  ['Kapea penkki Smith', 'Smith Machine Close-Grip Bench Press', 'smith-close-grip-flat-bench-press'],
  ['Ylätalja naruilla', 'Cable Rope Triceps Pushdown', 'cable-rope-triceps-pushdown'],
  ['Ylätalja tangolla, suora', 'Cable Straight Bar Triceps Pushdown', 'cable-straight-bar-triceps-pushdown'],
  ['Ylätalja tangolla, ez bar', 'Cable EZ Bar Triceps Pushdown', 'cable-ez-bar-triceps-pushdown'],
  ['Kickback käsip.', 'Bench-Supported One-Arm Dumbbell Triceps Kickback', 'bench-supported-one-arm-dumbbell-triceps-kickback'],
  ['Ranskalainen ylätaljassa narulla', 'Cable Rope Overhead Triceps Extension', 'cable-rope-overhead-triceps-extension'],
  ['Smith pystypunnerrus vinopenkissä', 'Smith Machine Seated Shoulder Press', 'smith-machine-seated-shoulder-press'],
  ['Sivuolkapää vinopenkissä rintatuettu käsip.', 'Chest-Supported Incline Dumbbell Lateral Raise', 'chest-supported-incline-dumbbell-lateral-raise'],
  ['Sivuolkapäät käsipainoilla, seisten', 'Dumbbell Lateral Raise', 'dumbbell-lateral-raise'],
  ['Etuolkapäät käsipainoilla, seisten', 'Standing Dumbbell Front Raise', 'standing-dumbbell-front-raise'],
  ['Sivuolkapää alataljassa', 'Cable Lateral Raise', 'cable-lateral-raise'],
  ['Face pull', 'Face Pull', 'face-pull'],
  ['Pystypunnerrus käsipainoilla vinop.', 'Seated Incline Dumbbell Shoulder Press', 'seated-incline-dumbbell-shoulder-press'],
  ['Pystypunnerrus laitteessa', 'Machine Shoulder Press', 'machine-shoulder-press'],
  ['Takaolkapää vinopenkissä rintatuettu käsip.', 'Chest-Supported Incline Dumbbell Rear Delt Raise', 'chest-supported-incline-dumbbell-rear-delt-raise'],
  ['Vatsapenkki', 'Decline Sit-Up Bench', 'decline-sit-up-bench'],
  ['Vatsarutistukset laitteella', 'Machine Ab Crunch', 'machine-ab-crunch'],
  ['Jalkaprässi', 'Leg Press', 'leg-press'],
  ['Hack-kyykky', 'Machine Hack Squat', 'machine-hack-squat'],
  ['Jalkakyykky tangolla / Smith', 'Barbell Back Squat / Smith Machine Back Squat', 'barbell-back-squat'],
  ['Reisiojennus', 'Leg Extension', 'leg-extension'],
  ['Takareisi koukistus', 'Leg Curl', 'leg-curl'],
  ['Pohkeet / tangolla / laitteessa', 'Machine Calf Raise', 'machine-calf-raise'],
  ['Ylätalja', 'Lat Pulldown', 'lat-pulldown'],
  ['Kulmasoutu laitteessa, rintatuettu', 'Chest-Supported Seated Machine Row', 'chest-supported-seated-machine-row'],
  ['Kulmasoutu penkillä käsip.', 'Bench-Supported One-Arm Dumbbell Row', 'bench-supported-one-arm-dumbbell-row'],
  ['Hartianosto käsip.', 'Standing Dumbbell Shrug', 'standing-dumbbell-shrug'],
  ['Trapbar mave', 'Trap Bar Deadlift', 'trap-bar-deadlift'],
  ['Maastaveto tangolla', 'Barbell Deadlift', 'barbell-deadlift'],
  ['Alatalja soutu', 'Seated Cable Row', 'seated-cable-row'],
  ['Alaselkä', 'Back Extension', 'back-extension'],
  ['Penkki tangolla', 'Barbell Bench Press', 'bench-press'],
  ['Pec Deck', 'Pec Deck Machine Fly', 'pec-deck-machine-fly'],
  ['Vinopenkki käsipainoilla', 'Incline Dumbbell Bench Press', 'incline-dumbbell-bench-press'],
  ['Smith, vinopenkki', 'Smith Machine Incline Bench Press', 'smith-machine-incline-bench-press'],
  ['Ristikkäistalja alhaalta', 'Low Cable Chest Fly', 'low-cable-chest-fly'],
  ['Ristikkäistalja ylhäältä', 'High Cable Chest Fly', 'high-cable-chest-fly'],
  ['Pullover', 'Dumbbell Pullover on Bench', 'dumbbell-pullover-on-bench'],
  ['Hauiskääntö alataljassa', 'Low Cable EZ Bar Curl', 'low-cable-ez-bar-curl'],
  ['Hauiskääntö vinopenkissä käsip.', 'Seated Incline Dumbbell Curl', 'seated-incline-dumbbell-curl'],
  ['Hammer vinopenkissä', 'Seated Incline Dumbbell Hammer Curl', 'seated-incline-dumbbell-hammer-curl'],
  ['Rannekääntö ylätaljassa', 'Single-Arm High Cable Wrist Curl', 'single-arm-high-cable-wrist-curl'],
  ['Rannekääntö käsipainolla, penkillä istuen', 'Single-Arm Seated Dumbbell Wrist Curl', 'single-arm-seated-dumbbell-wrist-curl'],
].map(([finnishName, englishName, imageKey]) => ({ finnishName, englishName, imageKey }))

const knownAliases = new Map([
  ['Kävelymatto', ['Yleislämmittely']],
  ['Olkapäiden lämmittelyä', ['Kohdennettu lämmittely']],
  ['Vatsarutistukset laitteella', ['Vatsalaite']],
  ['Sivuolkapäät käsipainoilla, seisten', ['Sivuolkapää käsipainoilla']],
  ['Smith pystypunnerrus vinopenkissä', ['Smith pystypunnerrus']],
  ['Trapbar mave', ['Trapbar maastaveto']],
  ['Alatalja soutu', ['Alatalja']],
  ['Hartianosto käsip.', ['Hartianosto']],
])

function parseExportedImageKeys(source) {
  const keys = new Set()
  const exportBlock = source.match(/export const exerciseImages = \{([\s\S]*?)\n\}/)
  if (!exportBlock) return keys

  for (const match of exportBlock[1].matchAll(/'([^']+)'\s*:/g)) {
    keys.add(match[1])
  }

  return keys
}

function parseImportedImageKeys(source) {
  const keys = new Set()

  for (const match of source.matchAll(/from ['"]\.\.\/assets\/exercises\/([^'"]+)\.png['"]/g)) {
    keys.add(match[1])
  }

  return keys
}

function isExpectedExercisePresent(expected, exercises) {
  const acceptedNames = [expected.finnishName, ...(knownAliases.get(expected.finnishName) ?? [])]

  return exercises.some((exercise) => (
    acceptedNames.includes(exercise.name) ||
    acceptedNames.includes(exercise.defaultWarmupType) ||
    exercise.imageKey === expected.imageKey
  ))
}

function formatExercise(exercise) {
  return `${exercise.name} (${exercise.id})`
}

function printGroup(title, items, emptyText) {
  console.log(`\n${title}`)
  if (!items.length) {
    console.log(`  ${emptyText}`)
    return
  }

  for (const item of items) {
    console.log(`  - ${item}`)
  }
}

const assetFiles = await readdir(assetsDir)
const imageFiles = new Set(assetFiles.filter((file) => file.endsWith('.png')))
const imageFileKeys = new Set([...imageFiles].map((file) => file.replace(/\.png$/, '')))
const imageMapSource = await readFile(imageMapPath, 'utf8')
const exportedImageKeys = parseExportedImageKeys(imageMapSource)
const importedImageKeys = parseImportedImageKeys(imageMapSource)
const usedImageKeys = new Set(defaultExercises.map((exercise) => exercise.imageKey).filter(Boolean))

const withImageKeyAndFile = defaultExercises
  .filter((exercise) => exercise.imageKey && imageFiles.has(`${exercise.imageKey}.png`))
  .map((exercise) => `${formatExercise(exercise)} -> ${exercise.imageKey}.png`)

const missingImageKey = defaultExercises
  .filter((exercise) => !exercise.imageKey)
  .map((exercise) => formatExercise(exercise))

const imageKeyMissingFile = defaultExercises
  .filter((exercise) => exercise.imageKey && !imageFiles.has(`${exercise.imageKey}.png`))
  .map((exercise) => `${formatExercise(exercise)} -> ${exercise.imageKey}.png`)

const imageKeyMissingExport = defaultExercises
  .filter((exercise) => exercise.imageKey && !exportedImageKeys.has(exercise.imageKey))
  .map((exercise) => `${formatExercise(exercise)} -> ${exercise.imageKey}`)

const exportedMissingImport = [...exportedImageKeys]
  .filter((imageKey) => !importedImageKeys.has(imageKey))
  .sort()
  .map((imageKey) => `${imageKey} is exported but no matching import was found`)

const importedMissingFile = [...importedImageKeys]
  .filter((imageKey) => !imageFileKeys.has(imageKey))
  .sort()
  .map((imageKey) => `${imageKey}.png is imported but missing from src/assets/exercises`)

const unusedImageFiles = [...imageFileKeys]
  .filter((imageKey) => !usedImageKeys.has(imageKey))
  .sort()
  .map((imageKey) => `${imageKey}.png`)

const expectedMissingExercises = expectedMappings
  .filter((expected) => !isExpectedExercisePresent(expected, defaultExercises))
  .map((expected) => `${expected.finnishName} -> ${expected.imageKey}`)

const possibleFinnishTypos = defaultExercises
  .filter((exercise) => exercise.name.includes('Sivulkapää'))
  .map((exercise) => `${formatExercise(exercise)}: did you mean Sivuolkapää?`)

console.log('GymFlow exercise image audit')
console.log('================================')
console.log(`Default exercises: ${defaultExercises.length}`)
console.log(`Image files: ${imageFiles.size}`)
console.log(`Exported image keys: ${exportedImageKeys.size}`)

printGroup('✅ exercises with imageKey and existing image file', withImageKeyAndFile, 'None')
printGroup('⚠️ exercises missing imageKey', missingImageKey, 'None')
printGroup('❌ exercises with imageKey but missing image file', imageKeyMissingFile, 'None')
printGroup('❌ imageKey used in defaultExercises but not exported from exerciseImages.js', imageKeyMissingExport, 'None')
printGroup('❌ exported/imported image mapping problems', [...exportedMissingImport, ...importedMissingFile], 'None')
printGroup('⚠️ image files that exist but are not referenced by any default exercise', unusedImageFiles, 'None')
printGroup('⚠️ expected exercise names missing from defaultExercises.js', expectedMissingExercises, 'None')
printGroup('⚠️ possible Finnish name typos', possibleFinnishTypos, 'None')

const criticalCount = imageKeyMissingFile.length + imageKeyMissingExport.length + exportedMissingImport.length + importedMissingFile.length
const warningCount = missingImageKey.length + unusedImageFiles.length + expectedMissingExercises.length + possibleFinnishTypos.length

console.log('\nSummary')
console.log(`  Critical errors: ${criticalCount}`)
console.log(`  Warnings: ${warningCount}`)

process.exitCode = criticalCount ? 1 : 0
