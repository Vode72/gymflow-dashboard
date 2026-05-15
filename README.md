# GymFlow Dashboard

GymFlow Dashboard is a lightweight workout tracking dashboard for planning training days, logging sets, and reviewing progress without spreadsheet friction.

The app is inspired by practical workout tracking workflows: fast entry, clear history, and a calm dashboard that answers the next useful question.

## Product Philosophy

GymFlow is designed around three core questions:

- What should I train today?
- What did I do last time?
- Am I progressing?

The interface prioritizes speed, readability, and continuity. Workout data should be easy to enter during training and easy to understand later.

## Current MVP Features

- Mobile-first dashboard shell
- Today view with next workout guidance
- Demo workout program
- Program page with editable-model structure prepared
- Workout page with reps-first set entry format
- Training history view
- Progress summary view
- Settings view
- Local persistence with `localStorage`
- PWA-ready manifest

## Workout Logging Format

GymFlow uses reps first, weight second.

Supported examples:

```text
15/40 + 10/60 + 6/75
15x40 / 10x60 / 6x75
```

These mean:

- 15 reps at 40 kg
- 10 reps at 60 kg
- 6 reps at 75 kg

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- localStorage
- PWA-ready manifest

## Project Structure

```text
src/
  components/    Shared UI components
  data/          Demo program, exercises, and sessions
  hooks/         Local storage and app data hooks
  i18n/          UI label dictionaries
  pages/         Main app views
  utils/         Workout parsing, progress, dates, and logic
public/
  manifest.json  PWA-ready app manifest
```

## Roadmap

- Step 1.2: Workout Logging Core
- Workout session save flow
- Program editing
- Exercise bank management
- History filters
- Progress charts and personal records
- Settings for profile, theme, and units

## How To Run

```bash
npm install
npm run dev
npm run build
```

## Status

Step 1.1 Foundation completed.
