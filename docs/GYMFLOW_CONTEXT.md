# GymFlow Dashboard - projektikonteksti

## 1. Projektin nimi

GymFlow Dashboard

## 2. Projektin tavoite

React + Vite + PWA-ready mobile-first workout diary / training dashboard.

Sovelluksen tulee olla:

- nopea käyttää
- mobile-first
- visuaalisesti viimeistelty
- SAP Light Beige / FleetFlow Light -henkinen
- premium minimal
- dashboard-tyylinen
- offline-first
- tuotemainen
- mahdollisesti portfolio-kelpoinen, viraali ja myöhemmin tuotteistettava

Tämä ei ole:

- sosiaalinen fitness-sovellus
- kaloriseurannan ekosysteemi
- AI coach
- MyFitnessPal-klooni
- Excel-klooni

## 3. Työnkulku

- Toni ja ChatGPT suunnittelevat arkkitehtuurin, UX:n, datamallin ja toteutusaskeleet.
- ChatGPT antaa copy-paste-valmiit Codex-promptit.
- Codex tekee koodimuutokset.
- Askeleiden pitää olla pieniä ja turvallisia.
- Jokaisen koodausaskeleen jälkeen Codex päivittää tämän kontekstitiedoston.

## 4. Tuotteen ydinkysymykset

- Mitä teen tänään?
- Mitä tein viimeksi?
- Kehitynkö?

## 5. Nykyinen teknologiapino

- React
- Vite
- JavaScript
- CSS
- localStorage
- PWA-ready manifest
- ei backendia MVP:ssä
- ei kirjautumista MVP:ssä
- ei cloud synciä MVP:ssä

## 6. Visuaalinen suunta

- GymFlow™ Dashboard
- Made by Toni V
- SAP Light Beige / FleetFlow Light -tyyli
- rauhallinen premium minimal UI
- korttipohjainen layout
- isot mobiilikosketusalueet
- ei neon-fitness-ilmettä
- ei pieniä Excel-mäisiä ruudukon soluja

## 7. Keskeiset arkkitehtuuripäätökset

- Treenipäiviä ei saa kovakoodata kiinteäksi Day 1-4 -logiikaksi.
- Sovelluksen pitää tukea mitä tahansa määrää käyttäjän määrittelemiä treenipäiviä.
- Nykyinen 4 päivän ohjelma on vain demo-/oletussisältöä.
- Käyttäjä voi myöhemmin lisätä, poistaa, nimetä uudelleen ja järjestää treenipäiviä.
- Liikepankki on myöhemmin muokattava.
- Käyttäjä voi myöhemmin lisätä, muokata ja poistaa liikkeitä.
- Samalle kalenteripäivälle pitää tukea useita treenisessioita.
- `workoutSession` tarkoittaa yhtä treenitapahtumaa, ei päivää.
- Seuraavan treenin ehdotus perustuu viimeisimpään valmistuneeseen sessioon ja aktiiviseen `workoutDays`-järjestykseen.
- Nopea sarjakirjaus on reps first, weight second.
- Esimerkit:
  - `15/40 + 10/60 + 6/75`
  - `15x40 / 10x60 / 6x75`
- Sisäinen sarjaformaatti:
  - `{ reps, weight }`
- Valmiit treenit pitää voida myöhemmin muokata.
- Ennätykset ja kehitys lasketaan tallennetuista sessioista, ei erillisenä hauraana totuutena.

## 8. Nykyiset näkymät

- Tänään / Home
- Treeni / Workout
- Historia
- Kehitys / Progress
- Ohjelma / Program
- Asetukset / Settings

## 9. Valmistuneet askeleet

### Step 1.1 - Foundation

Yhteenveto:

- mobile-first app shell
- bottom navigation
- päänäkymät
- demo-ohjelma
- liikepankki
- demo-sessiot
- localStorage-hookit
- utility-rakenne
- i18n-rakenne
- PWA manifest
- reps-first parser
- geneerinen `workoutDays`-malli
- useat sessiot samalle päivälle tuettu datamallissa

### Step 1.1A - README + polish

Yhteenveto:

- product-grade README
- onboarding-copy parannettu
- Program-sivulle lisätty demo-ohjelman selite
- header tiivistetty
- bottom nav -välitys parannettu

### Step 1.1B - Header brand + bottom nav safe area

Yhteenveto:

- branded header lisätty:
  - GymFlow™ Dashboard
  - `{page title} · Made by Toni V`
  - Demo-statuspill
- bottom nav safe-area -välitys korjattu
- viimeiset kortit voivat skrollata navin yläpuolelle

## 10. Nykyinen status

- Step 1.1 foundation on hyväksytty
- Step 1.1A on hyväksytty
- Step 1.1B on hyväksytty
- Seuraava suunniteltu askel: Step 1.2 Workout Logging Core

## 11. Seuraava suunniteltu askel

### Step 1.2 - Workout Logging Core

Suunniteltu scope:

- aktiivinen draft workout
- reps-first set input Workout-näkymässä
- sarjojen parsiminen rakenteiseksi dataksi
- top kg -laskenta
- top reps -laskenta
- estimated 1RM -laskenta
- feeling input
- duration input
- draftin autosave
- completion confirmation dialog
- valmiin session tallennus Historiaan
- salli valmiin treenin avaaminen myöhemmin tulevassa stepissä tai valmistele rakenne sitä varten

## 12. Kontekstin päivityssääntö tuleville Codex-prompteille

"After implementing any future step, update docs/GYMFLOW_CONTEXT.md by appending a new section with the step number, summary, files changed, key decisions, tests run, build/lint result and next recommended step. Do not delete previous context."

## Step 1.2 — Workout Logging Core

Päivä: 2026-05-15

### Files changed

- `src/hooks/useGymFlowData.js`
- `src/pages/Workout.jsx`
- `src/pages/History.jsx`
- `src/pages/Progress.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/components/SetInputRow.jsx`
- `src/components/CompletionSummary.jsx`
- `src/utils/parseSets.js`
- `src/utils/progressLogic.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### Implemented features

- Aktiivinen treeniluonnos tallennetaan avaimella `gymflow_active_draft`.
- Workout-näkymä alustaa luonnoksen valitun `workoutDays`-päivän perusteella.
- Liikekohtaiset sarjat kirjataan reps-first-muodossa.
- Tuetut muodot:
  - `15/40 + 10/60 + 6/75`
  - `15x40 / 10x60 / 6x75`
- Sarjat parsitaan sisäiseen formaattiin `{ reps, weight }`.
- UI näyttää sarjojen määrän, top kg:n, top repsin ja Epley-kaavan mukaisen arvioidun 1RM:n.
- Luonnokselle voi kirjata keston ja tuntemuksen.
- Luonnos autosave-tallentuu localStorageen jokaisella muutoksella.
- `Merkitse valmiiksi` avaa vahvistuskortin.
- Vahvistus tallentaa session `completed`-tilassa `gymflow_sessions`-listaan.
- History näyttää sekä demo-sessiot että uudet tallennetut treenit.
- Progress lukee tallennetuista sessioista henkilökohtaisia ennätyksiä kevyesti.

### Data model notes

- `workoutSession` tarkoittaa yhtä treenitapahtumaa, ei kalenteripäivää.
- Samalle päivälle voi tallentua useita completed-sessioita.
- Treenipäivien logiikka käyttää edelleen geneeristä `workoutDays`-taulukkoa.
- Nykyinen 4 päivän ohjelma on vain demo-/oletussisältöä.
- Valmiita treenejä ei lukita datamallissa pysyvästi, vaikka täysi uudelleenavaus jätettiin myöhemmäksi.
- Ennätykset ja progress lasketaan sessioista, ei erillisestä totuuslähteestä.

### UX decisions

- Workout pysyy korttipohjaisena ja rauhallisena.
- Validointi on kevyt: virheellinen sarjamuoto näyttää vain pienen huomautuksen.
- Kesto ja tuntemus ovat yksinkertaiset inputit.
- Historia pysyy korttinäkymänä eikä muutu taulukoksi.
- Historyssä on placeholder-painike `Muokkaa myöhemmin`, mutta muokkausflowta ei vielä toteutettu.

### What was intentionally left out

- Ei full Program editing -toimintoja.
- Ei add/remove/reorder-treenipäiviä.
- Ei cloud synciä, loginia tai backendia.
- Ei chart-kirjastoja.
- Ei täyttä completed workout reopening -workflowta.
- Ei AI coachia, kaloriseurantaa tai sosiaalista jakamista.

### Tests run

- Parser smoke check:
  - `15/40 + 10/60 + 6/75`
  - `15x40 / 10x60 / 6x75`
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2A — Workout Logging QA + UI polish
