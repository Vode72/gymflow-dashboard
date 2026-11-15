# GymFlow Dashboard — Master Context

Last updated: 2026-11-15 — OP-001 (documentation only; awaiting user approval)

## 1. Project

GymFlow Dashboard is a React + Vite + PWA-ready, mobile-first workout diary and training dashboard.

Product direction:
- Fast to use at the gym.
- Mobile-first.
- SAP Light Beige / FleetFlow Light inspired.
- Premium minimal dashboard style.
- Offline-first MVP using localStorage.
- Portfolio-ready and product-like.

The product should answer:
- What should I do today?
- What did I do last time?
- Am I progressing?

The product is not:
- A social fitness app.
- A calorie tracking ecosystem.
- An AI coach.
- A MyFitnessPal clone.
- An Excel clone.
- A generic workout form demo.

## 2. Workflow Rule

Toni and ChatGPT plan architecture, UX, data model and implementation steps together.

Important workflow rule:
- ChatGPT must not give a copy-paste Codex prompt or code before Toni confirms that the step should be turned into a Codex prompt.
- First: discuss and plan.
- Then: define the safe scope.
- Then: ask Toni for confirmation.
- Only after confirmation: provide one clear copy-paste-ready Codex prompt.
- Codex implements code changes.
- Each code step must be small, safe and testable.
- After each implementation step, Codex must update `docs/GYMFLOW_CONTEXT.md`.

Standard context update rule:

> After implementing any future step, update `docs/GYMFLOW_CONTEXT.md` by appending or integrating a section with the step number, summary, files changed, key decisions, tests run, build/lint/audit result and next recommended step. Do not delete important project knowledge unless Toni explicitly asks to clean or compact the file.

## 3. Current Tech Stack

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

## 4. Visual Direction

Current visual direction:
- GymFlow™ Dashboard
- Made by Toni V
- SAP Light Beige / FleetFlow Light style
- Calm premium minimal UI
- Compact dashboard cards
- Mobile-friendly large touch targets
- Warm beige / amber / green semantic color system
- No neon fitness look
- No Excel-like tiny grid cells
- No overloaded form UI

Design decisions:
- Success green is reserved for save / complete / accept actions.
- Amber / yellow is used for add, selected, suggestion, PR and achievement-style actions.
- Secondary gray is used for neutral actions such as back, cancel and switch day.
- Danger / reddish brown is reserved for destructive actions.
- Chips and badges may remain pill-shaped.
- Cards and buttons are intentionally less round than early versions.
- The product should feel sharper and more premium, not overly soft.

Header page title mapping:
- `TÄNÄÄN`
- `TREENI`
- `HISTORIA`
- `KEHITYS`
- `OHJELMA`
- `ASETUKSET`

## 5. Core Architecture Decisions

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

## 6. Workout Logging Model

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
- Draft supports workout-level duration, feeling, warmups, targeted warmups, exercise logs, exercise-level duration, quality stars and exercise comments.
- Completing a workout stores a completed session in the sessions list and clears the draft only after successful save.

Workout-level duration:
- Stored on the draft/session root as `durationMinutes`.
- Represents the whole workout duration.
- Default for new workout drafts: 45 minutes.
- Presets: 30 / 45 / 60 / 75 / 90 / 105 / 120.
- Shown in the lower `Treenin tiedot` section.

Exercise-level duration:
- Stored on the active draft exercise log item:
  - `activeDraft.exercises[].durationMinutes`
- Represents the selected exercise duration, not the whole workout.
- Exercise detail label: `LIIKKEEN KESTO`.
- Default display for missing/old data: 10 minutes.
- New non-targeted exercise log items default to 10 minutes.
- Presets: 5 / 10 / 15 / 20 / 25 / 30.
- Plus/minus step: 1 minute (DUR-1B; see OP-000 duration decision below).
- Min: 5 minutes.
- Max: 30 minutes.
- Completed sessions preserve this value because completed exercise log items are copied from the draft.
- Old data must keep working when `durationMinutes` is missing.

## 7. Current App Views

Main views:
- Home / Tänään
- Workout / Treeni
- History / Historia
- Progress / Kehitys
- Program / Ohjelma
- Settings / Asetukset

## 8. Current Completed Feature Areas

### Foundation

Implemented:
- Mobile-first app shell.
- Bottom navigation.
- Main views.
- Demo program.
- Exercise bank structure.
- Demo sessions.
- localStorage hooks.
- Utility structure.
- i18n-ready structure.
- PWA manifest.
- Reps-first parser.
- Generic workoutDays model.
- Multiple sessions per day supported by data model.

### Header and Navigation Polish

Implemented:
- Branded header.
- GymFlow™ Dashboard.
- Made by Toni V.
- Demo status pill.
- Compact three-column header.
- Centered uppercase active page title.
- Bottom nav safe-area spacing.
- Fixed bottom navigation.
- Active bottom nav visual polish.

### Workout Logging Core

Implemented:
- Active workout draft.
- Reps-first set input.
- Parsed structured sets.
- Top kg calculation.
- Top reps calculation.
- Estimated 1RM calculation using Epley-style logic.
- Workout-level feeling input.
- Workout-level duration input in `Treenin tiedot`.
- Exercise-level duration input in Workout detail.
- Autosave.
- Completion confirmation modal.
- Completed session save to History.
- History reads both demo sessions and saved completed sessions.
- Progress reads saved sessions for basic personal record data.

### Warmup Model

Implemented:
- General warmup.
- Targeted warmup.
- Warmup type handling.
- Custom warmup name support.
- Warmup note support.
- Warmup completed state.
- Warmup duration logic.
- Targeted warmup popup confirmation.
- Inline targeted warmup cards.
- Multi-targeted warmup support.
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

### Workout Exercise List / Detail Flow

Implemented:
- Workout shows a day-level exercise list first.
- Selecting an exercise opens a detail view.
- Detail view uses `ExerciseLogCard`.
- Detail view preserves reps-first input and set-by-set controls.
- Back to exercise list supported.
- `Liike valmis` closes detail view and returns to list.
- `Liike valmis` scrolls toward the next unfinished exercise if available.
- Exercise list cards show:
  - exercise thumbnail or fallback
  - exercise name
  - type
  - current logging state
  - latest result if available
- Workout list is grouped into sections:
  - Warmup
  - Daily exercises
  - Custom exercise placeholder
- Workout detail meta area shows:
  - exercise-level duration
  - workout feeling
  - compact exercise image preview

### Set-by-set Editor

Implemented:
- Weight +/- control.
- Reps +/- control.
- Quality stars.
- Add set.
- Remove set.
- Parsed set chips / summary.
- Compact set row polish.
- Visible `Poista` action.
- Remove button has accessible label.
- Mobile wrapping avoids horizontal overflow.

### Duration and Feeling

Implemented:
- Workout-level duration:
  - `TREENIN KESTO`
  - stored on the draft/session root
  - default 45 minutes
  - presets 30 / 45 / 60 / 75 / 90 / 105 / 120
  - used in the lower `Treenin tiedot` section
- Exercise-level duration:
  - `LIIKKEEN KESTO`
  - stored in `activeDraft.exercises[].durationMinutes`
  - default 10 minutes
  - presets 5 / 10 / 15 / 20 / 25 / 30
  - plus/minus step 1 minute (DUR-1B superseded the earlier 5-minute setting)
  - min 5 minutes, max 30 minutes (DUR-1B superseded the earlier 60-minute maximum)
  - shown in Workout detail meta area
- Feeling select remains in the Workout detail meta area and in the workout details section.

### Exercise Images

Implemented:
- Exercise image assets are connected to Workout UI.
- `src/data/exerciseImages.js` exists as centralized image mapping.
- `imageKey` is used in `src/data/defaultExercises.js`.
- Workout exercise list shows thumbnails.
- Workout exercise detail shows a compact image preview in the meta area.
- Missing image handling/fallback exists.
- Existing localStorage exercise banks get missing default imageKeys through derived data by matching exercise id; localStorage keys and saved session data are not changed.
- `bench-press.png` is the current repo file for `Penkki tangolla`, so the imageKey is `bench-press`.

### Image Audit

Implemented:
- `scripts/auditExerciseImages.mjs` exists.
- `npm run audit:images` is available.
- Audit checks:
  - default exercise imageKeys
  - actual PNG files in `src/assets/exercises`
  - centralized imports/exports in `src/data/exerciseImages.js`
  - expected exercise names and possible Finnish name typos
- Latest result after IMG-2D: 0 critical errors.
- Warnings are expected because the image bank is broader than the current default exercise bank.

### History

Implemented:
- Completed sessions visible in History.
- History cards show session summary.
- History shows:
  - completed exercise count
  - total sets
  - best set-based performance when available
  - completed and missing exercises
- History exercise chips are clickable and open light detail inside the same session.
- History better answers “What did I do last time?”

Still missing:
- Full completed workout reopening / editing flow.
- Exercise comments shown in History detail.
- Exercise-level duration shown in History detail.
- Calendar view.
- Achievements.
- Progress charts.

### Program

Implemented:
- Program page shows demo program structure.
- Placeholder actions explain that editing is coming later.

Still missing:
- Program editing.
- Exercise bank editing.
- Add/remove/reorder workout days.

## 9. Current Stable State

Latest known stable state:
- Build passed after IMG-2D.
- Lint passed after IMG-2D.
- Image audit passed with 0 critical errors.
- Workout exercise images are connected in list and detail views.
- Current default exercises have imageKeys where applicable.
- Some extra image assets are intentionally unused because they are reserved for future exercise-bank expansion.
- Exercise-level duration is implemented separately from workout-level duration.
- Browser/mobile manual QA has not been claimed as completed in the latest steps.

Recommended verification before future code steps:

```powershell
npm run build
npm run lint
npm run audit:images
```

## 10. Exercise Image Bank

Image style standard:
- One image per exercise.
- PNG format.
- Saved in `src/assets/exercises/`.
- Grayscale anatomical muscle-map body.
- Target muscles highlighted in red/orange.
- Light neutral background.
- Realistic gym equipment / bench / dumbbells / cable machine.
- No text.
- No logos.
- Filename in English.
- Lowercase kebab-case.
- Filename, future `id` and future `imageKey` should align where possible.

Current implementation:
- Assets live in `src/assets/exercises/`.
- Central image mapping lives in `src/data/exerciseImages.js`.
- Exercise data references images by `imageKey`.
- UI uses `getExerciseImage(imageKey)` instead of hardcoding image imports in components.
- Missing images use fallback initials/neutral blocks.
- `npm run audit:images` validates mappings and reports expected gaps.

Current notes:
- The image bank contains more assets than the current default exercise bank.
- `low-cable-ez-bar-curl.png` is mapped centrally for future `Hauiskääntö alataljassa`, but that exercise is not yet present in `defaultExercises.js`.
- Extra assets should be connected through future exercise-bank expansion, not by silently mapping wrong exercise variations.

Image generation workflow rule:
- When creating a new GymFlow exercise image, also provide:
  - Finnish exercise name
  - English exercise name
  - kebab-case slug / filename
- Example:
  - FI: Sivuolkapää vinopenkissä rintatuettu käsipainoilla
  - EN: Chest-Supported Incline Dumbbell Lateral Raise
  - slug: `chest-supported-incline-dumbbell-lateral-raise`

## 11. Important Files

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
- `src/hooks/useLocalStorage.js`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/History.jsx`
- `src/pages/Progress.jsx`
- `src/pages/Program.jsx`
- `src/pages/Settings.jsx`
- `src/data/defaultExercises.js`
- `src/data/exerciseImages.js`
- `src/data/defaultWorkoutDays.js`
- `src/data/demoSessions.js`
- `src/utils/parseSets.js`
- `src/utils/progressLogic.js`
- `src/utils/workoutLogUtils.js`
- `src/utils/exerciseTracking.js`
- `src/utils/durationUtils.js`
- `src/App.css`
- `src/assets/exercises/`
- `scripts/auditExerciseImages.mjs`
- `docs/GYMFLOW_CONTEXT.md`

## 12. What Not To Break

Future steps must not accidentally break:
- Active draft restore.
- localStorage keys.
- Autosave.
- Completed-session save.
- Reps-first parser.
- Set-by-set editor.
- Targeted warmup multi-card logic.
- Workout-level duration.
- Exercise-level duration.
- `imageKey` / `exerciseImages` mapping.
- Image audit script.
- History completed session reading.
- Generic `workoutDays` model.
- Multiple sessions per calendar day support.
- Mobile-first layout.
- Bottom nav safe-area behavior.
- Current visual token system.

## 13. Earlier Recommended Next Steps (backlog; OP-000 roadmap takes precedence)

### EXB-1 — Expand Exercise Bank From Master Spreadsheet

Reason:
- Image bank is broader than current default exercise bank.
- Excel master list exists at `docs/assets/gymflow_liikepankki_kuvat_en.xlsx`.
- Several mapped image assets are ready but not yet present as default exercises.
- Exercise bank expansion should be data-only / low-risk and should not change logging logic.

### HIST-1 — Show Exercise Comments and Duration in History Detail

Reason:
- Exercise comments are already saved but not fully visible in History.
- Exercise-level `durationMinutes` is now saved with completed exercise logs.
- History can better answer “What did I do last time?” by showing notes and exercise duration.

### QA-IMG-3 — Browser/Mobile Smoke Test

Reason:
- Manual mobile QA should verify image sizing, duration controls, no horizontal scroll and completed-session save.

## 14. Current Product Direction Summary

GymFlow should become a premium mobile workout dashboard that feels fast during real gym use.

The most important UX principle:
- During training, the user should not fight forms.
- The user should see the day, pick an exercise, log sets quickly, mark the exercise done, and move on.
- History and progress should answer what happened last time and whether performance is improving.
- Program and exercise bank editing can come later, but the architecture must keep supporting them.

## 15. Recent Implemented Steps

### Step IMG-2 — Connect Exercise Image Assets to Exercise Bank

Date: 2026-06-07

Summary:
- Connected committed exercise image assets to the exercise bank and Workout UI.
- Added centralized image mapping in `src/data/exerciseImages.js`.
- Added imageKey fields to matching default exercises.
- Added thumbnails to Workout exercise list.
- Added exercise image display to Workout detail.
- Added fallback handling for missing images.

Files changed:
- `src/data/exerciseImages.js`
- `src/data/defaultExercises.js`
- `src/hooks/useGymFlowData.js`
- `src/pages/Workout.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

Key decisions:
- Images are referenced by `imageKey`, not hardcoded directly in UI.
- Missing images use a fallback.
- This step was display-only and did not change workout logging persistence.
- Existing localStorage exercise banks get missing default imageKeys through derived data by matching exercise id.

Tests run:
- `npm run build` passed.
- `npm run lint` passed.

### Step IMG-2C — Exercise Image Mapping Audit

Date: 2026-06-07

Summary:
- Added `scripts/auditExerciseImages.mjs`.
- Added `npm run audit:images`.
- Checked default exercise imageKeys against actual image assets and centralized imports.
- Reported missing/unused/mismatched image mappings.
- Applied safe exact fixes only.

Files changed:
- `scripts/auditExerciseImages.mjs`
- `package.json`
- `src/data/defaultExercises.js`
- `src/data/exerciseImages.js`
- `docs/GYMFLOW_CONTEXT.md`

Key decisions:
- Audit exits with code 1 only for critical missing files/exports.
- Unused image assets and missing future exercises are warnings.
- Warnings are expected until the exercise bank expands.

Tests run:
- `npm run build` passed.
- `npm run lint` passed.
- `npm run audit:images` passed.

### Step IMG-2C Fix — Kulmasoutu ImageKey

Date: 2026-06-07

Summary:
- Added imageKey for `Kulmasoutu` / `bent-over-row`.
- Image: `bench-supported-one-arm-dumbbell-row`.

Result:
- Build passed.
- Lint passed.
- Image audit passed with 0 critical errors and 53 warnings.

### Step IMG-2C Fix — Low Cable EZ Bar Curl Image Mapping

Date: 2026-06-07

Summary:
- Added Low Cable EZ Bar Curl image mapping.
- FI: Hauiskääntö alataljassa
- EN: Low Cable EZ Bar Curl
- imageKey: `low-cable-ez-bar-curl`
- file: `low-cable-ez-bar-curl.png`

Result:
- Build passed.
- Lint passed.
- Image audit passed with 0 critical errors and 55 warnings.
- `Hauiskääntö alataljassa` is not yet present in `defaultExercises.js`, so no default exercise imageKey was added in this step.

### Step IMG-2D — Mobile QA Polish for Exercise Images

Date: 2026-06-07

Summary:
- Moved/compacted Workout detail exercise image near the workout meta controls.
- Reduced excessive empty space around detail images.
- Kept thumbnails compact.
- Corrected dumbbell lateral raise Finnish display name to `Sivuolkapäät käsipainoilla, seisten`.
- No workout logging logic changed.

Result:
- Build passed.
- Lint passed.
- Image audit passed with 0 critical errors and 55 warnings.

### Step IMG-2D — Exercise Duration Split and Image Meta Polish

Date: 2026-06-07

Summary:
- Split workout-level duration and exercise-level duration in Workout detail.
- Exercise detail now uses `Liikkeen kesto` with default 10 min.
- Exercise duration presets are 5/10/15/20/25/30 minutes.
- Workout-level `Treenin kesto` remains in the workout summary/details section with 30-120 min presets.
- Exercise image preview remains compact in the detail meta area.
- Autosave compatibility preserved.
- No parser logic changed.

Files changed:
- `src/pages/Workout.jsx`
- `src/hooks/useGymFlowData.js`
- `docs/GYMFLOW_CONTEXT.md`

Tests run:
- `npm run build` passed.
- `npm run lint` passed.
- `npm run audit:images` passed with 0 critical errors and 55 warnings.

## Step QA-IMG-3A — Fix Workout List Thumbnails and Detail Image Crop

Date: 2026-07-28

Summary:
- Fixed Workout list thumbnail rendering so valid exercise images display instead of fallback/alt-like text when image loading succeeds.
- Added defensive image load failure handling so broken image alt text is not shown as the thumbnail.
- Improved Workout detail image preview sizing/cropping with a more square-like contained preview.
- Preserved imageKey / exerciseImages mapping.
- No workout logging, parser, autosave or duration logic changed.

Files changed:
- `src/pages/Workout.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

Tests run:
- `npm run build`
- `npm run lint`
- `npm run audit:images`

Result:
- Build passed.
- Lint passed.
- Image audit passed with 0 critical errors and 55 warnings.
- Browser/manual mobile QA was not completed in this step because the Browser plugin control tool was unavailable in this session.

Next recommended step:
- Continue QA-IMG-3 browser/mobile smoke test.
- Then consider HIST-1 or NAV-1 depending on QA priorities.

## Step DUR-1B — Exercise Duration Fine Tune Step

Date: 2026-07-28

Goal:
- Fine tune `LIIKKEEN KESTO` so exercise-level duration uses one-minute +/- adjustments while preserving existing presets.

What changed:
- Changed exercise-level plus/minus step from 5 minutes to 1 minute.
- Set exercise-level duration clamp to min 5 minutes and max 30 minutes.
- Kept exercise-level presets unchanged: 5 / 10 / 15 / 20 / 25 / 30.
- Kept missing/old `durationMinutes` default display at 10 minutes.
- No changes were made to workout-level `TREENIN KESTO` logic.

Files changed:
- `src/pages/Workout.jsx`
- `docs/GYMFLOW_CONTEXT.md`

Key decisions:
- Reused the existing `DurationControls` and draft update path.
- Kept the change local by changing only exercise-specific constants and normalization.
- Did not migrate old draft/session data; the next UI change clamps edited exercise duration to 5-30 minutes.

Tests run:
- `npm run build`
- `npm run lint`

Result:
- Build passed.
- Lint passed.

Notes:
- Browser/mobile manual QA was not performed in this step.

Next recommended step:
- Continue QA-IMG-3 browser/mobile smoke test, including exercise duration +/- behavior and `TREENIN KESTO` regression check.

## 16. OP-000 — Thesis Baseline Consolidation

Date: 2026-11-15. Status: documentation baseline; no application changes.

### Evidence and document responsibilities

Repository baseline inspected at commit a3850da (2026-07-30). Sources: this existing context, README, package.json, vite.config.js, public/manifest.json, Workout.jsx, useGymFlowData.js, useLocalStorage.js, parseSets.js and git history. Earlier step results below are historical reports, not tests rerun by OP-000. The supplied request ends mid-section at “OP-000 step”; missing instructions have not been reconstructed as quotations.

- GYMFLOW_CONTEXT.md: technical master context, current behavior, constraints, architecture decisions and roadmap.
- GYMFLOW_DEVELOPMENT_LOG.md: chronological steps, scope, evidence, checks, outcomes and handoffs.
- GYMFLOW_THESIS_NOTES.md: thesis outline, research questions, observations and evidence collection; not a finished thesis.

For every future step, update all relevant documents. Record step ID/date, objective, approved scope, changed files, decisions and reasons, actual test results, manual QA status, deviations, limitations and next step. Separate observed facts, historical reports and future plans. Preserve important history.

### Verified technical baseline and regression boundaries

React + Vite, JavaScript and CSS; localStorage persistence; PWA-ready manifest; GitHub Pages deployment via gh-pages and Vite base /gymflow-dashboard/. A manifest alone does not establish full offline PWA capability. No backend, login or cloud sync in the current MVP.

Saved workout sessions are the source of truth for History and Progress. A workoutSession is one training event, not a calendar date; multiple sessions per day must remain possible. Workout days remain generic: the four-day default is demo content. Future user-defined days must support any count, add/delete/rename/reorder. The future exercise bank must support add/edit/delete.

Preserve reps-first inputs (15/40 + 10/60 + 6/75 and 15x40 / 10x60 / 6x75), internal { reps, weight }, set-by-set editing, autosave, draft restore, completed-session save, History reads, general warmups, targeted multi-card warmups, generic workoutDays, multiple sessions per date, bottom navigation safe-area and mobile-first layout.

Existing localStorage keys (useGymFlowData.js) must not change inadvertently:
- gymflow_user_profile
- gymflow_program
- gymflow_exercises
- gymflow_sessions
- gymflow_settings
- gymflow_active_draft

Persistence limitation observed during source review: completeWorkout schedules the session update and then clears the draft; useLocalStorage catches storage write errors. The earlier “only after successful save” statement is an intended safeguard, not evidence of a verified transactional persistence guarantee. OP-000 makes no code fix; storage-failure behavior requires later QA and a separately approved step if needed.

### Duration decision: implemented behavior versus requested target

Workout-level TREENIN KESTO remains the session root durationMinutes, default 45 min, presets 30/45/60/75/90/105/120. Exercise-level LIIKKEEN KESTO remains activeDraft.exercises[].durationMinutes, default/fallback 10 min, presets 5/10/15/20/25/30. Missing exercise duration in old data must remain supported. Never merge workout and exercise duration into one field.

Current code and DUR-1B (2026-07-28) use exercise +/- 1 minute, min 5, max 30.
The OP-000 request specifies +/- 5 minutes, min 5, max 60. This is a documented target conflicting with the implemented baseline, not an implemented change. Resolve explicitly in a later approved functional step; TypeScript migration must preserve current behavior. Earlier IMG-2D settings remain historical evidence.

### Verification policy

Most code changes require npm run build and npm run lint. Exercise image, bank or mapping changes additionally require npm run audit:images. Record exit/result and meaningful warnings. Never claim manual browser/mobile QA without performing it. OP-000 changes only these three Markdown documents; build/lint/image audit and browser/mobile QA were not run. Historical passes do not prove the present checkout passes.

## 17. OP-000 Approved Future Direction (historical plan; OP-001 update in section 19)

Order: OP-001 → TS-0 → TS-1 → TS-2 → TS-3 → TS-4 → OP-002. ARCH-1 is a later architecture decision before implementing production authentication and Garmin integration. Earlier EXB-1, HIST-1 and QA-IMG-3 remain backlog items.

### OP-001 — Agent-assisted development baseline

Plan role-based responsibilities:
- Planner: define objective, scope, dependencies and acceptance criteria.
- Implementer: implement the approved bounded change.
- QA: run relevant checks and document evidence and regressions.
- Reviewer: review correctness, maintainability and domain rules.
- Controller: supervise the whole process; compare implementation with scope; inspect changed files and test results; check locked domain rules; detect scope creep and missing documentation; report to Toni/ChatGPT guidance. Production coding is not its primary role.
- Documentation: maintain context, development chronology and thesis evidence.

Controller verdicts may be APPROVE, FIX REQUIRED or REJECT, with reasons and evidence. Final approval and publication remain with the user. These roles are a future process design, not agents configured by OP-000.

Phone-directed development should eventually allow starting, guiding, monitoring, reviewing and approving/rejecting development from a phone. Maintain human-in-the-loop decision making. Feasibility, usability and control are thesis topics, not verified capabilities.

### TypeScript migration

Run after OP-001 and before actual authentication or GymFlow Garmin integration.
- TS-0: TypeScript infrastructure, tsconfig, Vite compatibility and lint/build baseline; no functional change.
- TS-1: core domain types: WorkoutSession, WorkoutDay, Exercise, WorkoutSet, ExerciseLog and duration fields.
- TS-2: utilities/data: parsers, localStorage helpers, exercise data and image mapping.
- TS-3: React components incrementally from .jsx to .tsx; props, state and event typing.
- TS-4: strictness, reduce temporary any types, final build/lint regression check.

Migration preserves current application behavior and persisted data compatibility. Do not combine it with feature work or the duration target change.

### OP-002 — Garmin / Python POC

After migration, investigate a Garmin Personal API proof of concept separately from GymFlow UI; Python may be used. This is the first planned agent-guided external integration experiment, a technical feasibility test and a thesis integration case. Availability, access conditions and suitability require verification at that step. No Garmin functionality is implemented here.

Personal use/POC direction: Garmin Personal API. Potential multi-user production direction: Garmin official business/developer integration, subject to later evaluation. Isolate dependencies behind an integration layer; React UI must not depend directly on one Garmin API implementation. Never put API keys, tokens or other secrets in the repository.

### ARCH-1 — Future production architecture decision

Evaluate and decide user authentication, per-user data, test accounts, likely Supabase/PostgreSQL, Row Level Security, offline-first behavior, local persistence, cloud sync and Garmin integration abstraction. Supabase is a candidate, not a final selection.

An original practical motivation for login is user testing: testers have individual accounts and individual data, and cannot see each other's data. A later production version may reuse that isolation model. Architecture, access controls, sync conflicts and integration contracts must be reviewed before implementation.

## 18. OP-000 Outcome and Handoff

Only GYMFLOW_CONTEXT.md, GYMFLOW_DEVELOPMENT_LOG.md and GYMFLOW_THESIS_NOTES.md are in scope. Preserve all earlier implementation history above. No production code, configuration, dependencies, data, commits, pushes or PRs are part of this step.

Next recommended step: plan OP-001 with explicit acceptance criteria, role handoffs and Controller evidence requirements. Carry forward the duration discrepancy and storage-failure QA observation as open items.

## 19. OP-001 — Agent-assisted Development Baseline

Date: 2026-11-15. Baseline: `fbf4dfa`, OP-000 completed on remote `main`.
Status: dokumentaatio toteutettu ja tarkistettu; käyttäjän hyväksyntä odottaa. Puhelinohjattua työnkulkua ei ole validoitu kokonaisuutena.

### Summary and changed files

Luotu juuren `AGENTS.md` ja [GYMFLOW_AGENT_WORKFLOW.md](GYMFLOW_AGENT_WORKFLOW.md). Päivitetty tämä master-konteksti, [kehitysloki](GYMFLOW_DEVELOPMENT_LOG.md) ja [opinnäytetyömuistiinpanot](GYMFLOW_THESIS_NOTES.md). Vain nämä viisi dokumenttia kuuluvat OP-001:een. Sovelluskoodia, riippuvuuksia, konfiguraatiota tai GitHub Actions -työnkulkuja ei muutettu.

Paikallinen lähtöhaara `work` oli puhdas mutta vanhassa commitissa `a3850da`. Remote `main` varmistettiin commitiksi `fbf4dfa`; tehtävähaara `docs/op-001-agent-baseline` luotiin tästä jo paikallisesti saatavilla olevasta commitista. OP-000:aa ei toteutettu uudelleen.

### Key decisions and current workflow

OP-000:n kuuden roolin suunnitelma luvussa 17 säilyy historiana. OP-001 täsmentää nykyisiksi vastuualueiksi Product / UX Agent, Architecture Agent, Implementation Agent, QA / Test Agent, Documentation Agent ja Controller Agent. Nämä ovat loogisia rooleja, eivät kuusi itsenäistä agenttia. Ei automaattista orkestrointia, uusia työkaluja tai ohjelmakoodia.

Käyttäjä ja ChatGPT sopivat tehtävän, scopen ja hyväksymiskriteerit; käyttäjä hyväksyy toteutuksen. Codex toteuttaa eristetyssä työympäristössä ja suorittaa soveltuvat testit. Controller-roolin tarkistus arvioi scopen, diffin, testit, riskit ja dokumentaation ennen käyttäjän tarkistusta. Yhdistäminen edellyttää käyttäjän hyväksyntää. Controllerin APPROVE ei ole käyttäjän hyväksyntä. Testivirhe, scopen ylitys tai yhteensopivuusriski palauttaa työn korjattavaksi; uusi rajaus vaatii käyttäjän päätöksen.

### Tests and Controller review

`git diff --check`: hyväksytty. Uudet untracked-dokumentit tarkistettiin lisäksi `git diff --no-index --check /dev/null <tiedosto>` -komennoilla. Tarkistettu viiden tiedoston scope, kaikkien kuuden roolin kuvaus, Controllerin rajat, käyttäjän hyväksyntäportti ja kolmen olemassa olevan dokumentin historian säilyminen.

Build/lint/image audit: ei ajettu, documentation-only-vaihe ei vaadi niitä. Selain-/mobiili-QA: ei tehty. MOBILE-0 ja MOBILE-1: ei suoritettu. Controller-roolin itsearvio: APPROVE käyttäjälle luovutettavaksi; ei riippumatonta agenttitarkastusta eikä käyttäjän hyväksyntää. Tarkempi evidenssi kehityslokissa.

### Roadmap and next recommended step

OP-000 (valmis) → OP-001 (dokumentaatio toteutettu, hyväksyntä odottaa) → TS-0…TS-4 → OP-002 (Garmin/Python POC) → ARCH-1 → AUTH-x → GARMIN-x.

Seuraavaksi käyttäjän OP-001-tarkistus ja hyväksyntä; tämän jälkeen MOBILE-0 ja erikseen rajattu MOBILE-1 validoivat työnkulkua. Ne eivät muuta tuotearkkitehtuurin hyväksyttyä etenemisjärjestystä. Seuraava tuotearkkitehtuurin vaihe on TS-0. Mitään seuraavaa vaihetta ei aloitettu.

Avoimet asiat säilyvät: tallennuksen virhepolun QA ja dokumentoitu duration-tavoitteen ristiriita (luku 16). Niitä ei korjattu tässä vaiheessa. Dokumentoitu prosessi ei osoita puhelinohjauksen toimivuutta tai agenttityön tehokkuutta.
