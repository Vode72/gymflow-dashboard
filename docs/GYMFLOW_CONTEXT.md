# GymFlow Dashboard — Master Context

Last updated: 2026-05-23

## 1. Project name

GymFlow Dashboard

## 2. Product goal

GymFlow Dashboard is a React + Vite + PWA-ready mobile-first workout diary / training dashboard.

The product should feel like:

- fast to use at the gym
- mobile-first
- visually polished
- SAP Light Beige / FleetFlow Light inspired
- premium minimal
- dashboard-style
- offline-first
- product-like
- portfolio-ready
- potentially sellable later

The product is not:

- a social fitness app
- a calorie tracking ecosystem
- an AI coach
- a MyFitnessPal clone
- an Excel clone
- a generic workout form demo

Core product questions:

- What should I do today?
- What did I do last time?
- Am I progressing?

## 3. Workflow rule

Toni and ChatGPT plan the architecture, UX, data model and implementation steps together.

Important workflow rule:

- ChatGPT must not give a copy-paste Codex prompt or code before Toni confirms that the step should be turned into a Codex prompt.
- First: discuss and plan.
- Then: define the safe scope.
- Then: ask Toni for confirmation.
- Only after confirmation: provide one clear copy-paste-ready Codex prompt.
- Codex implements the code changes.
- Each code step must be small, safe and testable.
- After each implementation step, Codex must update this context file.

Standard context update rule for future Codex prompts:

> After implementing any future step, update `docs/GYMFLOW_CONTEXT.md` by appending a new section with the step number, summary, files changed, key decisions, tests run, build/lint result and next recommended step. Do not delete previous context unless Toni explicitly asks to clean or compact the file.

## 4. Current tech stack

- React
- Vite
- JavaScript
- CSS
- localStorage
- PWA-ready manifest
- GitHub Pages deployment
- No backend in MVP
- No login in MVP
- No cloud sync in MVP

## 5. Visual direction

Current visual direction:

- GymFlow™ Dashboard
- Made by Toni V
- SAP Light Beige / FleetFlow Light style
- calm premium minimal UI
- compact dashboard cards
- mobile-friendly large touch targets
- warm beige / amber / green semantic color system
- no neon fitness look
- no Excel-like tiny grid cells
- no overloaded form UI

Design decisions:

- Success green is reserved for save / complete / accept actions.
- Amber / yellow is used for add, selected, suggestion, PR and achievement-style actions.
- Secondary gray is used for neutral actions such as back, cancel and switch day.
- Danger / reddish brown is reserved for destructive actions.
- Chips and badges may remain pill-shaped.
- Cards and buttons are intentionally less round than the first versions.
- The product should feel sharper and more premium, not overly soft.

Current important visual tokens / decisions:

- Card radius has been tightened.
- Button radius has been tightened.
- Success green direction has been accepted.
- Header has a compact three-column layout.
- Active page title is centered and uppercase.
- Bottom navigation is fixed and mobile-first.

Header page title mapping:

- `TÄNÄÄN`
- `TREENI`
- `HISTORIA`
- `KEHITYS`
- `OHJELMA`
- `ASETUKSET`

## 6. Core architecture decisions

Important architecture rules:

- Workout days must not be hardcoded as fixed Day 1-4 logic.
- The app must support any number of user-defined workout days later.
- The current 4-day program is demo/default content only.
- Users should later be able to add, delete, rename and reorder workout days.
- Exercise bank must be editable later.
- Users should later be able to add, edit and delete exercises.
- Multiple workout sessions on the same calendar day must be supported.
- `workoutSession` means one training event, not one day.
- Next workout suggestion is based on the latest completed session and active `workoutDays` order.
- Completed workouts must be editable later.
- Records and progress should be calculated from saved sessions, not stored as a fragile separate truth source.

## 7. Workout logging model

Set-based exercise logging:

- Fast set input is reps first, weight second.
- Supported examples:
  - `15/40 + 10/60 + 6/75`
  - `15x40 / 10x60 / 6x75`
- Internal set format:
  - `{ reps, weight }`

Tracking types:

- Strength / set-based exercises use set logging.
- General warmups use warmup duration style logging.
- Targeted warmups use note/duration/completed style logging.
- Duration and note exercises do not calculate top kg or estimated 1RM.

Current workout draft behavior:

- Active workout draft is stored in localStorage.
- Draft persists through refresh and browser reopen.
- If an active draft exists, Workout must use its `workoutDayId` before suggested next day logic.
- Draft supports duration, feeling, warmups, targeted warmups, exercise logs, quality stars and exercise comments.
- Completing a workout stores a completed session in the sessions list and clears the draft only after successful save.

## 8. Current app views

Main views:

- Home / Tänään
- Workout / Treeni
- History / Historia
- Progress / Kehitys
- Program / Ohjelma
- Settings / Asetukset

## 9. Current completed feature areas

### Foundation

Implemented:

- mobile-first app shell
- bottom navigation
- main views
- demo program
- exercise bank structure
- demo sessions
- localStorage hooks
- utility structure
- i18n-ready structure
- PWA manifest
- reps-first parser
- generic workoutDays model
- multiple sessions per day supported by data model

### Header and navigation polish

Implemented:

- branded header
- GymFlow™ Dashboard
- Made by Toni V
- Demo status pill
- compact three-column header
- centered uppercase active page title
- bottom nav safe-area spacing
- fixed bottom navigation
- active bottom nav visual polish

### Workout Logging Core

Implemented:

- active workout draft
- reps-first set input
- parsed structured sets
- top kg calculation
- top reps calculation
- estimated 1RM calculation using Epley-style logic
- feeling input
- duration input
- autosave
- completion confirmation modal
- completed session save to History
- History reads both demo sessions and saved completed sessions
- Progress reads saved sessions for basic personal record data

### Warmup model

Implemented:

- General warmup
- Targeted warmup
- Warmup type handling
- Custom warmup name support
- Warmup note support
- Warmup completed state
- Warmup duration logic
- Targeted warmup popup confirmation
- Inline targeted warmup cards
- Multi-targeted warmup support
- Per-card targeted warmup actions:
  - type dropdown
  - note
  - duration stepper
  - completed toggle
  - remove action
- Disabled or empty targeted warmups do not save as completed workout entries.
- `enabled` alone does not count as a logged exercise.
- Targeted warmup can collapse into a compact done card after marking done.
- Compact done card can be reopened for editing.

### Workout exercise list / detail flow

Implemented:

- Workout shows a day-level exercise list first.
- Selecting an exercise opens a detail view.
- Detail view uses `ExerciseLogCard`.
- Detail view preserves reps-first input and set-by-set controls.
- Back to exercise list supported.
- `Liike valmis` closes detail view and returns to list.
- `Liike valmis` scrolls toward the next unfinished exercise if available.
- Exercise list cards show:
  - exercise name
  - type
  - current logging state
  - latest result if available
- Workout list is grouped into sections:
  - Warmup
  - Daily exercises
  - Custom exercise placeholder

### Set-by-set editor

Implemented:

- weight +/- control
- reps +/- control
- quality stars
- add set
- remove set
- parsed set chips / summary
- compact set row polish
- visible `Poista` action
- remove button has accessible label
- mobile wrapping avoids horizontal overflow

### Duration and feeling

Implemented:

- workout duration stepper
- duration quick presets:
  - 30
  - 45
  - 60
  - 75
  - 90
  - 105
  - 120
- plus/minus supports 1 minute fine tuning
- new workout draft default duration is currently 45 minutes
- selected duration preset highlights when value matches
- feeling select is aligned with duration controls in the detail meta area

### History

Implemented:

- completed sessions visible in History
- History cards show session summary
- History shows:
  - completed exercise count
  - total sets
  - best set-based performance when available
  - completed and missing exercises
- History exercise chips are clickable and open light detail inside the same session.
- History better answers “What did I do last time?”

Still missing:

- full completed workout reopening / editing flow
- exercise comments shown in History detail
- calendar view
- achievements
- progress charts

### Program

Implemented:

- Program page shows demo program structure.
- Placeholder actions explain that editing is coming later.
- Program editing is not yet implemented.
- Exercise bank editing is not yet implemented.
- Add/remove/reorder workout days is not yet implemented.

## 10. Current recent QA status

Recent QA fixes completed on 2026-05-23:

- Active draft restore fixed.
- Refresh/F5 no longer changes the active workout day incorrectly when a draft exists.
- Browser close and reopen preserves active draft day via localStorage.
- Duration default changed to 45 min for new drafts.
- Duration quick presets added.
- Completion confirmation now navigates to History after successful save.
- Success button text contrast improved.
- Amber add/action buttons polished.
- Set row spacing tightened.
- Set row remove action made visible and accessible.
- General warmup lower duplicate duration input removed from UI.
- Exercise-level comment field added to exercise detail.
- `exerciseComment` is optional and saved in draft/completed data.
- Comment display in History is still pending.
- Targeted warmup can collapse into compact done state.
- Sarjakohtainen kirjaus was made more compact without a large data model change.

Recent known limitations:

- Manual browser click-through testing was limited in the session.
- Build and lint passed for recent steps.
- Full compact logging redesign is still optional.
- Exercise thumbnail UI connection is not yet implemented.

## 11. Exercise image bank

### Image style standard

GymFlow exercise image style:

- one image per exercise
- PNG format
- saved in `src/assets/exercises/`
- grayscale anatomical muscle-map body
- target muscles highlighted in red/orange
- light neutral background
- realistic gym equipment / bench / dumbbells / cable machine
- no text
- no logos
- filename in English
- lowercase kebab-case
- filename, future `id` and future `imageKey` should align where possible

Image generation workflow rule:

- When creating a new GymFlow exercise image, also provide:
  - Finnish exercise name
  - English exercise name
  - kebab-case slug / filename
- Example:
  - FI: Sivuolkapää vinopenkissä rintatuettu käsipainoilla
  - EN: Chest-Supported Incline Dumbbell Lateral Raise
  - slug: `chest-supported-incline-dumbbell-lateral-raise`

### Initial image batch already accepted earlier

Earlier saved / accepted images:

- `bench-press-barbell.png`
- `lat-pulldown.png`
- `seated-cable-row.png`
- `scott-bench-curl.png`
- `smith-close-grip-flat-bench-press.png`
- `smith-incline-bench-press.png`
- `cable-rope-triceps-pushdown.png`
- `cable-straight-bar-triceps-pushdown.png`
- `cable-ez-bar-triceps-pushdown.png`

### New image batch added to GitHub on 2026-05-23

A new batch of 16 exercise images was added to:

`src/assets/exercises/`

Commit:

- `Add new GymFlow exercise images`

The Smith machine shoulder press filename was later normalized to lowercase kebab-case.

Added images:

- `smith-machine-seated-shoulder-press.png`
- `barbell-back-squat.png`
- `bench-supported-one-arm-dumbbell-row.png`
- `bench-supported-one-arm-dumbbell-triceps-kickback.png`
- `cable-lateral-raise.png`
- `chest-supported-incline-dumbbell-lateral-raise.png`
- `chest-supported-seated-machine-row.png`
- `face-pull.png`
- `leg-press.png`
- `machine-hack-squat.png`
- `seated-incline-dumbbell-curl.png`
- `seated-incline-dumbbell-hammer-curl.png`
- `single-arm-high-cable-wrist-curl.png`
- `single-arm-seated-dumbbell-wrist-curl.png`
- `smith-machine-back-squat.png`
- `standing-dumbbell-shrug.png`

Exercise name mapping for the new image batch:

| File | Finnish name | English name |
|---|---|---|
| `smith-machine-seated-shoulder-press.png` | Smith pystypunnerrus vinopenkissä | Smith Machine Seated Shoulder Press |
| `barbell-back-squat.png` | Jalkakyykky tangolla | Barbell Back Squat |
| `bench-supported-one-arm-dumbbell-row.png` | Kulmasoutu penkillä käsipainolla | Bench-Supported One-Arm Dumbbell Row |
| `bench-supported-one-arm-dumbbell-triceps-kickback.png` | Kickback käsipainolla penkillä | Bench-Supported One-Arm Dumbbell Triceps Kickback |
| `cable-lateral-raise.png` | Sivuolkapää alataljassa | Cable Lateral Raise |
| `chest-supported-incline-dumbbell-lateral-raise.png` | Sivuolkapää vinopenkissä rintatuettu käsipainoilla | Chest-Supported Incline Dumbbell Lateral Raise |
| `chest-supported-seated-machine-row.png` | Kulmasoutu laitteessa, rintatuettu | Chest-Supported Seated Machine Row |
| `face-pull.png` | Face pull | Face Pull |
| `leg-press.png` | Jalkaprässi | Leg Press |
| `machine-hack-squat.png` | Hack-kyykky | Machine Hack Squat |
| `seated-incline-dumbbell-curl.png` | Hauiskääntö vinopenkissä käsipainoilla | Seated Incline Dumbbell Curl |
| `seated-incline-dumbbell-hammer-curl.png` | Hammer-kääntö vinopenkissä käsipainoilla | Seated Incline Dumbbell Hammer Curl |
| `single-arm-high-cable-wrist-curl.png` | Rannekääntö ylätaljassa | Single-Arm High Cable Wrist Curl |
| `single-arm-seated-dumbbell-wrist-curl.png` | Rannekääntö istuen penkillä käsipainolla | Single-Arm Seated Dumbbell Wrist Curl |
| `smith-machine-back-squat.png` | Jalkakyykky Smith-laitteessa | Smith Machine Back Squat |
| `standing-dumbbell-shrug.png` | Hartianosto käsipainoilla | Standing Dumbbell Shrug |

Important current decision:

- Images are now in the repo as assets.
- Images are not yet connected to the app UI.
- The next implementation step for images must be separate and safe.

Recommended future image step:

### Step IMG-2 — Connect Exercise Image Assets to Exercise Bank

Scope:

- add `imageKey` or `image` field to exercise data
- create central exercise image mapping
- show thumbnails in Workout exercise list cards
- optionally show a larger image in exercise detail
- add fallback image or initials when image is missing
- do not change parser logic
- do not change autosave logic
- do not change completed-session persistence
- do not change workout session data structure except optional image metadata if needed

## 12. Important files

Likely important files:

- `src/App.jsx`
- `src/components/AppShell.jsx`
- `src/components/BottomNav.jsx`
- `src/components/Card.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/components/SetInputRow.jsx`
- `src/components/CompletionSummary.jsx`
- `src/components/WorkoutDayPicker.jsx`
- `src/hooks/useGymFlowData.js`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/History.jsx`
- `src/pages/Progress.jsx`
- `src/pages/Program.jsx`
- `src/pages/Settings.jsx`
- `src/data/defaultExercises.js`
- `src/data/defaultWorkoutDays.js`
- `src/data/demoSessions.js`
- `src/utils/parseSets.js`
- `src/utils/progressLogic.js`
- `src/utils/workoutLogUtils.js`
- `src/utils/exerciseTracking.js`
- `src/utils/durationUtils.js`
- `src/App.css`
- `src/assets/exercises/`
- `docs/GYMFLOW_CONTEXT.md`

## 13. Current stable state

Latest known stable state:

- Build has passed after recent QA changes.
- Lint has passed after recent QA changes.
- New exercise images were added and pushed to GitHub.
- Smith machine seated shoulder press image filename was normalized to kebab-case.
- The project is ready for the next planned step after a quick `git status`, `npm run build` and optional manual smoke test.

Recommended status check before next Codex step:

```powershell
git status
npm run build
npm run lint
```

## 14. What not to break

Future steps must not accidentally break:

- active draft restore
- localStorage keys
- autosave
- completed-session save
- reps-first parser
- set-by-set editor
- targeted warmup multi-card logic
- duration presets
- History completed session reading
- generic `workoutDays` model
- multiple sessions per calendar day support
- mobile-first layout
- bottom nav safe-area behavior
- current visual token system

## 15. Current recommended next steps

Primary recommended next step:

### Step IMG-2 — Connect Exercise Image Assets to Exercise Bank

Reason:

- The image assets are now in the repo.
- The next logical step is to use them in the app.
- This should be UI/data display only, not a logging logic change.

Safe scope:

- Add image mapping.
- Add image keys to matching default exercises.
- Show thumbnails in Workout exercise list.
- Optionally show image in Exercise detail.
- Add fallback for missing image.
- Do not touch parser, autosave or completed-session save logic.

Alternative next steps:

### Step NOTES1B — Show Exercise Comments in History Detail

Reason:

- Exercise-level comments are already saved in draft/completed data.
- History does not yet display them.

### Step QA1B — Full Compact Set Logging Layout

Reason:

- Current compact set polish is acceptable, but a stronger mobile-first logging row could still improve the gym use case.

### Step P2 — Home Today Hero Card

Reason:

- Improves “What should I do today?” product feel.
- Should be visual/UI only.

## 16. Current product direction summary

GymFlow should become a premium mobile workout dashboard that feels fast during real gym use.

The most important UX principle:

- During training, the user should not fight forms.
- The user should see the day, pick an exercise, log sets quickly, mark the exercise done, and move on.
- History and progress should answer what happened last time and whether performance is improving.
- Program and exercise bank editing can come later, but the architecture must keep supporting them.