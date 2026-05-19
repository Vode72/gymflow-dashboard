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

## Step 1.2A — Workout Logging QA + UX Fixes

Päivä: 2026-05-15

### Files changed

- `src/data/defaultExercises.js`
- `src/hooks/useGymFlowData.js`
- `src/pages/Workout.jsx`
- `src/pages/History.jsx`
- `src/pages/Home.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/components/CompletionSummary.jsx`
- `src/components/WorkoutDayPicker.jsx`
- `src/utils/durationUtils.js`
- `src/utils/exerciseTracking.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Lisättiin kevyt `trackingType`-malli: `sets`, `duration`, `note`.
- `Kävelymatto` käyttää nyt duration-kirjausta eikä sarjaparseria.
- `Olkapäiden lämmittely` käyttää nyt note-kirjausta eikä sarjaparseria.
- Voimaliikkeet säilyvät reps-first `sets`-kirjauksessa.
- Vanhalle localStorage-liikepankille lisättiin fallback-logiikka `treadmill`- ja `shoulder-warmup`-liikkeille.
- Treenin kokonaiskesto kirjataan nyt tunteina ja minuutteina.
- Kesto näytetään muodossa `54 min`, `1 h 15 min` tai `2 h 5 min`.
- `Merkitse valmiiksi` avaa nyt selkeän modal/popup-vahvistuksen.
- Workout day picker näyttää treenipäivän nimen ja kuvauksen eri riveillä.
- Historyn muokkausplaceholder kertoo selkeämmin, että valmiin treenin uudelleenavaus tulee myöhemmin.
- Completion summary laskee merkinnät tracking-tyypin mukaan ja laskee sarjat vain set-pohjaisista liikkeistä.

### Key decisions

- Ei toteutettu full Program editing -toimintoja.
- Ei toteutettu completed workout reopening -flowta.
- `workoutDays` säilyy geneerisenä taulukkona, eikä 4 päivän demo-ohjelmaa kovakoodattu logiikaksi.
- Reps-first-formaatti säilyy oletuksena set-pohjaisille liikkeille.
- Duration- ja note-liikkeille ei lasketa top kg:ta tai 1RM-arviota.
- Modal toteutettiin CSS:llä ilman ulkoisia riippuvuuksia.

### Tests run

- Parser smoke check: `15/20 + 10/30`
- Duration smoke check: `10 min` -> `10`
- Duration display smoke check: `75` -> `1 h 15 min`
- Demo tracking type smoke check:
  - `treadmill` -> `duration`
  - `shoulder-warmup` -> `note`
  - `barbell-bench` -> `sets`
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2E — Workout Exercise List View

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Workout-näkymään lisättiin sisäinen liikelista/detail-rakenne.
- Treenipäivä näyttää ensin päivän summaryn ja liikkeet korttilistana.
- Liikekortti näyttää:
  - liikkeen nimen
  - tyypin (`Sarjat`, `Lämmittely`, `Merkintä`)
  - nykyisen treenin tilan (`Ei kirjattu` / `Kirjattu`)
  - viimeisimmän tuloksen, jos sellainen löytyy completed-sessioista.
- Yksittäisen liikkeen valinta avaa detail-näkymän, jossa käytetään edelleen nykyistä `ExerciseLogCard`-kirjausta.
- Detail-näkymään lisättiin `Takaisin liikelistaan` -toiminto.
- Treenin tiedot, autosave, luonnoksen tallennus ja completion confirmation säilytettiin nykyisessä Workout-näkymässä.

### Key decisions

- Workout käyttää nyt sisäistä liikelista/detail-näkymää.
- `selectedExerciseId` ohjaa, näytetäänkö päivän liikelista vai yksittäisen liikkeen kirjaus.
- Nykyinen reps-first-kirjaus säilytettiin.
- Nykyinen autosave ja completion confirmation säilytettiin.
- Viimeisin tulos näytetään liikkeen kortilla, jos tallennetuista completed-sessioista löytyy sama `exerciseId`.
- Uutta plus/miinus-sarjaeditoria, quality-kenttää, liikepankkia, kalenteria tai achievements-toimintoja ei vielä toteutettu.

### What was intentionally left out

- Ei muutettu `workoutSession`-datamallia raskaasti.
- Ei muutettu reps-first parserin toimintaa.
- Ei toteutettu uutta sarja kerrallaan -editoria.
- Ei toteutettu completed workout reopening -flowta.
- Ei toteutettu kalenteria, achievements-toimintoja tai liikepankkia.

### Tests run

- Smoke check:
  - `getLastExerciseResult(demoSessions, 'lat-pulldown')`
  - tuntematon liike palauttaa `Ei aiempaa tulosta`
  - pelkkä default warmup type ei counttaa kirjaukseksi
  - reps-first parser säilyy muodolle `15/40 + 10/60 + 6/75`
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D.3B — Header Gradient Revert + Brand Title Selector Fix

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Header-gradientti palautettiin aiempaan parempaan suuntaan:
  - `linear-gradient(135deg, #34312d 0%, #4a3429 48%, #6f4228 100%)`
- Korjattiin pääotsikon CSS-selector käyttämään oikeaa olemassa olevaa rakennetta:
  - `.app-header .app-brand__name`
- `GymFlow™ Dashboard` käyttää nyt `--header-title`-tokenia.
- Headerin yleinen tekstiväri palautettiin `--header-text`-tokeniin, jotta vain pääotsikko on amber.

### Key decisions

- Header-gradientti palautettiin suuntaan tumma vasen / lämmin oikea.
- Pääotsikon CSS-selector korjattiin, jotta GymFlow™ Dashboard käyttää `--header-title`-tokenia.
- Vain pääotsikko käyttää amber/oranssi-keltaista väriä.
- Alaotsikko jätettiin vaaleaksi/beigeksi.
- Header pidettiin kompaktina eikä muutettu hero-banneriksi.
- Kortteja, painikkeita, bottom navia ja toiminnallista logiikkaa ei muutettu.

### What was intentionally left out

- Ei muutettu treenilogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu parseria.
- Ei muutettu painikkeiden semanttisia rooleja.
- Ei muutettu kortteja tai bottom navia.
- Ei lisätty theme selectoria tai uusia featureita.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D.3A — Header Gradient Direction + Brand Title Accent Polish

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Headerin gradientin suuntaa hienosäädettiin.
- Käyttöön jäi hillitympi gradientti:
  - `linear-gradient(135deg, #5f3a27 0%, #463229 48%, #2f3030 100%)`
- Lisättiin brand title -tokenit:
  - `--header-title`
  - `--header-title-soft`
- `GymFlow™ Dashboard` käyttää nyt amber/oranssi-keltaista `--header-title`-sävyä.
- Alaotsikko säilyy rauhallisena vaaleana/beigenä.

### Key decisions

- Headerin gradientin suuntaa hienosäädettiin tasapainoisemmaksi.
- Pääotsikko GymFlow™ Dashboard muutettiin amber/oranssi-keltaiseksi.
- Alaotsikko jätettiin vaaleaksi/beigeksi rauhallisen kontrastin vuoksi.
- Header pidettiin kompaktina eikä muutettu hero-banneriksi.
- Kortteja, painikkeita, bottom navia ja toiminnallista logiikkaa ei muutettu.

### What was intentionally left out

- Ei muutettu treenilogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu parseria.
- Ei muutettu painikkeiden semanttisia rooleja.
- Ei muutettu kortteja tai bottom navia.
- Ei lisätty theme selectoria tai uusia featureita.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D.3 — Compact Gradient Header Brand Polish

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Lisättiin headerille oma tumma lämmin gradient-token:
  - `--header-bg-soft`
- Lisättiin headerin teksti-, korostus-, border- ja shadow-tokenit:
  - `--header-text`
  - `--header-text-muted`
  - `--header-accent`
  - `--header-border`
  - `--header-shadow`
- Pääheader käyttää nyt kompaktia gradient-brändipalkkia.
- GymFlow™ Dashboard -teksti käyttää vaaleaa header-tekstiä.
- Sivunimi ja `Made by Toni V` käyttävät vaaleaa beigeä.
- GF-logo ja Demo-pill sovitettiin tummaan headeriin hillityillä amber/beige-korostuksilla.

### Key decisions

- Header muutettiin kompaktiksi tummaksi gradient-brändipalkiksi.
- Header ei ole hero-banneri eikä vie mobiilissa liikaa korkeutta.
- Pääteksti käyttää vaaleaa tekstiä, alaotsikko vaaleaa beigeä.
- GF-logo ja Demo-pill sovitettiin tummaan headeriin hillityillä amber/beige-korostuksilla.
- Kortteja, painikkeita, bottom navia ja toiminnallista logiikkaa ei muutettu.

### What was intentionally left out

- Ei muutettu treenilogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu parseria.
- Ei muutettu painikkeiden semanttisia rooleja.
- Ei muutettu kortteja tai bottom navia.
- Ei lisätty theme selectoria tai uusia featureita.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D.2 — SAP Beige Contrast Polish

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Päivitettiin oletus-/SAP Beige -teeman kontrastihierarkiaa.
- Sivun taustaa tummennettiin lämpimämpään beigeen.
- Korttien tausta pidettiin selvästi vaaleampana kuin appin tausta.
- Lisättiin `--panel-header-bg`-token ja käytettiin sitä header-kerroksen sävyttämiseen.
- Korttien borderia ja varjoa vahvistettiin hillitysti.

### Key decisions

- Oletusteeman sivutaustaa tummennettiin hieman, jotta kortit erottuvat paremmin.
- Korttien tausta pidettiin vaaleampana kuin appin tausta.
- Header/panel-header sävyä tummennettiin hieman, jotta se erottuu paremmin.
- Borderia ja varjoa vahvistettiin hillitysti.
- Painikeroolien värejä ei muutettu tässä stepissä.
- Toiminnallista logiikkaa ei muutettu.

### What was intentionally left out

- Ei muutettu treenilogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu parseria.
- Ei muutettu painikkeiden semanttisia rooleja.
- Ei muutettu Charcoal Beige- tai Clean Light -teemojen värejä.
- Ei lisätty theme selectoria tai uusia featureita.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D.1 — Success Button Green Tone Polish

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Päivitettiin success-painikkeen vihreä sävy hillitymmäksi.
- Lisättiin success-hover-token.
- Lisättiin `.btn--success`-luokalle kevyt premium-henkinen varjo.
- Lisättiin rauhallinen hover- ja active-tila vain success-painikkeelle.

### Key decisions

- Success-vihreä muutettiin hillitymmäksi sävyyn `#2f7d4f`.
- Hover-sävyksi asetettiin `#276a43`.
- Success-rooli säilyy vain tallennus-, valmis- ja hyväksyntätoiminnoille.
- Muita painikeroolien värejä ei muutettu.

### What was intentionally left out

- Ei muutettu treenilogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu parseria.
- Ei muutettu painikkeiden semanttisia rooleja.
- Ei lisätty uusia featureita.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2D — Visual Direction Lock

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/Program.jsx`
- `src/pages/History.jsx`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Lisättiin design token -pohja GymFlowin visuaaliselle suunnalle.
- Nykyinen oletustyyli lukittiin SAP Beige -henkiseksi premium minimal -dashboardiksi.
- Lisättiin tulevien teemojen token-pohjat ilman UI-kytkentää:
  - `data-theme='charcoal-beige'`
  - `data-theme='clean-light'`
- Yhtenäistettiin painikeroolit:
  - `.btn`
  - `.btn--primary`
  - `.btn--secondary`
  - `.btn--success`
  - `.btn--accent`
  - `.btn--warning`
  - `.btn--danger`
  - `.btn--ghost`
- Päivitettiin tärkeimmät nykyiset painikkeet käyttämään uusia rooleja.
- Korttien perusmuuttujia yhtenäistettiin:
  - `--card-bg`
  - `--card-bg-strong`
  - `--card-radius`
  - `--card-padding`
  - `--border-soft`
  - `--shadow-soft`
- CSS:ään lisättiin selkeät kommenttirakenteet:
  - Theme tokens
  - Button roles
  - Card base styles

### Key decisions

- Painike-/värisemantiikka lukittiin:
  - Vihreä = tallenna / valmis / hyväksy
  - Amber = valittu / PR / saavutus / ehdotus / ehdotettu päivä
  - Tumma = normaali päätoiminto vaalealla pohjalla
  - Oranssi = säästeliäs lisäys- tai huomioaction
  - Punaruskea = poisto / vaarallinen toiminto
- Kolmen tulevan teeman pohja huomioidaan:
  - SAP Beige
  - Charcoal Beige
  - Clean Light
- Tässä stepissä ei vielä toteutettu theme selectoria.
- Tässä stepissä ei vielä toteutettu uutta sarjaeditoria.
- Tässä stepissä ei vielä toteutettu kalenteria.
- Tässä stepissä ei vielä toteutettu achievements-toimintoja.

### What was intentionally left out

- Ei muutettu treenin tallennuslogiikkaa.
- Ei muutettu `workoutSession`-datamallia.
- Ei muutettu reps-first parserin toimintaa.
- Ei lisätty uusia UI-kirjastoja, ikoneita tai kuvia.
- Ei rakennettu Settingsiin teemanvaihtoa.
- Ei toteutettu liikepankkia, kalenteria, achievements-näkymää tai uutta setti-editoria.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2C — Change Day Flow + Warmup Polish + Program Placeholder Actions

Päivä: 2026-05-15

### Files changed

- `src/App.jsx`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/Program.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Home-näkymän `Vaihda päivä` avaa nyt treenipäivän valintamodaalin.
- Valittu treenipäivä tallennetaan app-tason UI-tilaan ja välitetään Workout-näkymään.
- `Aloita treeni` avaa Workout-näkymän valitulla treenipäivällä.
- Program-sivun placeholder-painikkeet näyttävät näkyvän ilmoituksen, eivätkä tunnu kuolleilta.
- Kohdennettu lämmittely ei ole enää oletuksena näkyvissä Day 1:llä, vaikka demo-ohjelmassa on targeted warmup item.
- Kohdennettu lämmittely aktivoituu vain käyttäjän toggle-valinnalla.
- Warmup-kortteja tiivistettiin ja kevennettiin visuaalisesti.
- `Tehty`-painikkeen aktiivinen tila erottuu selkeämmin.
- Warmup-yhteenveto käyttää `Muu`-valinnassa custom-tekstiä, jos se on annettu.

### Home change-day UX decision

- `Vaihda päivä` ei enää navigoi Ohjelma-sivulle.
- Käyttäjä valitsee treenipäivän kevyessä modal-valitsimessa.
- Valinta ohittaa automaattisen seuraavan treenin ehdotuksen nykyisessä UI-tilassa.
- Automaattinen `getNextWorkoutDay`-logiikka säilyy pohjaehdotuksena.

### Program placeholder action decision

- Full Program editing jäi tarkoituksella toteuttamatta.
- Painikkeet näyttävät nyt inline-ilmoituksen:
  - ohjelman muokkaus myöhemmin
  - liikepankin muokkaus myöhemmin
  - treenipäivän muokkaus myöhemmin
- Program-näkymä kertoo staattisesti, että nykyinen sivu näyttää demo-ohjelman rakenteen.

### Warmup polish changes

- Warmup-korttien paddingia, gap-arvoja ja label-kokoa pienennettiin.
- Warmup-korteista poistettiin raskas edellinen tulos -placeholder.
- `Tehty` näyttää aktiivisena muodossa `✓ Tehty`.
- Custom warmup -summary toimii:
  - `Keppijumppa + liikkuvuus · 8 min · Tehty`
  - `Rintaranka + lapatuet · 2 kierrosta · Tehty`
- Strength-korttien reps-first-kirjaus pidettiin ennallaan.

### Known limitations

- Valittu treenipäivä on vain nykyisen app-session UI-tila, ei pysyvä asetus.
- Program editing, Exercise Bank editing ja day-specific targeted warmup defaults ovat edelleen myöhempiä vaiheita.
- Completed workout reopening ei ole vielä toteutettu.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2B — Targeted Warmup Toggle + Compact Warmup Cards

Päivä: 2026-05-15

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Lisättiin Workout-näkymään toggle `Lisää kohdennettu lämmittely`.
- Day 1 voi näyttää kohdennetun lämmittelyn oletuksena, koska demo-ohjelmassa se on mukana.
- Muut treenipäivät voivat ottaa kohdennetun lämmittelyn käyttöön per treeniluonnos ilman Program-datan muuttamista.
- Toggle pois päältä piilottaa kohdennetun lämmittelyn ja jättää sen pois yhteenvedosta.
- Toggle takaisin päälle säilyttää draft-arvot saman luonnoksen aikana.
- Disabled targeted warmup suodatetaan pois completed-session tallennuksesta.

### Targeted warmup UX decision

- Kohdennettu lämmittely ei ole pakollinen app-logiikka.
- Se on per-workout/draft-valinta tässä vaiheessa.
- Program editing voi myöhemmin lisätä pysyvät päiväkohtaiset oletukset.
- UI käyttää edelleen lopullisia kenttiä:
  - `Tyyppi`
  - `Kirjoita oma kohdennettu lämmittely`
  - `Merkintä`
  - `Tehty`

### Compact warmup card decisions

- Warmup-korteille lisättiin `exercise-card--warmup`.
- Warmup-korteissa on pienempi padding, kevyempi varjo ja tiiviimpi kenttäväli.
- Warmup-kortit eivät näytä raskasta edellinen tulos -placeholderia.
- Strength-korttien reps-first-kirjaus, parseri, top kg, top reps ja 1RM-yhteenveto säilyivät ennallaan.

### Data model notes

- Lisättiin `enabled`-kentän käyttö kohdennetulle warmup-logille.
- Lisättiin `targeted-warmup` draft-only -malli, jota ei lisätä pysyvästi `workoutDays.exerciseIds`-listoihin.
- `hasLoggedExercise` keskittää summary- ja tallennuslogiikan:
  - warmupit lasketaan merkinnöiksi
  - vain set-pohjaiset liikkeet kasvattavat sarjamäärää
  - disabled targeted warmup ei counttaa

### Tests run

- Day 1 smoke check: demo-ohjelmassa on targeted warmup.
- Day 2 smoke check: demo-ohjelmassa ei ole targeted warmupia.
- Disabled targeted warmup smoke check: ei counttaa logged entryksi.
- Parser smoke check:
  - `15/20 + 10/30 + 8/40`
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results

## Step 1.2A — Workout Logging QA + Warmup UX Fixes

Päivä: 2026-05-15

### Files changed

- `src/data/defaultExercises.js`
- `src/hooks/useGymFlowData.js`
- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/utils/exerciseTracking.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Warmup-liikkeet eivät enää käytä sarjamuotoista reps/weight-kirjausta.
- `Kävelymatto`-demoalku on mallinnettu yleisenä `Yleislämmittely`-merkintänä.
- `Olkapäiden lämmittely`-demoalku on mallinnettu `Kohdennettu lämmittely`-merkintänä.
- Tracking type -nimet päivitettiin muotoon `warmupDuration` ja `warmupNote`.
- Säilytettiin yhteensopivuus aiemmin käytettyihin `duration`- ja `note`-arvoihin.
- Vanhalle localStorage-liikepankille lisättiin fallback-nimet ja default warmup -tyypit.
- Warmupit eivät laske top kg-, top reps- tai 1RM-arvoja.

### Warmup UX decisions

- `Yleislämmittely` käyttää kenttää `Tapa` ja vaihtoehtoja:
  - Kävelymatto
  - Kuntopyörä
  - Soutulaite
  - Crosstrainer
  - Liikkuvuus
  - Muu
- Jos yleislämmittelyssä valitaan `Muu`, näytetään kenttä `Kirjoita oma lämmittely`.
- `Yleislämmittely` voi tallentaa keston, `Tehty`-tilan, oman nimen tai näiden yhdistelmän.
- `Kohdennettu lämmittely` käyttää kenttää `Tyyppi` ja vaihtoehtoja:
  - Olkapäiden lämmittely
  - Kuminauhalämmittely
  - Lonkka / pakara
  - Polvi
  - Selkä / rintaranka
  - Lämmittelysarjat
  - Muu
- Jos kohdennetussa lämmittelyssä valitaan `Muu`, näytetään kenttä `Kirjoita oma kohdennettu lämmittely`.
- `Kohdennettu lämmittely` voi tallentaa merkinnän, `Tehty`-tilan, oman nimen tai näiden yhdistelmän.

### Data model notes

- Warmupit ovat tavallisia demo-ohjelman exercise/program itemeitä, eivät pakollista app-logiikkaa.
- Käyttäjä voi myöhemmin poistaa, korvata tai muokata warmupeja Program / Exercise Bank -editorissa.
- Luonnoksen warmup-logi tukee kenttiä:
  - `warmupType`
  - `customWarmupName`
  - `durationMinutes`
  - `note`
  - `completed`
- Set-pohjaiset liikkeet säilyttävät reps-first-formaatin ja `{ reps, weight }`-sarjamallin.

### Tests run

- Tracking type smoke check:
  - `Yleislämmittely` -> `warmupDuration`
  - `Kohdennettu lämmittely` -> `warmupNote`
  - `Penkki tangolla` -> `sets`
- Default warmup smoke check:
  - `Yleislämmittely` -> `Kävelymatto`
  - `Kohdennettu lämmittely` -> `Olkapäiden lämmittely`
- Parser smoke check:
  - `15/20 + 10/30` -> reps-first sets
- Duration display smoke check:
  - `75` -> `1 h 15 min`
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.3 — History + Last Results
## Step 1.2F — Workout History & Exercise Detail View

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/utils/workoutLogUtils.js`
- `src/hooks/useGymFlowData.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Workout-näkymä käyttää päivän liikelistaa ja yksittäisen liikkeen detail-näkymää.
- Liikekortit näyttävät thumbnail-tyylisen tunnisteen, liikkeen nimen, tyypin, tämän treenin tilan ja viimeisimmän tuloksen.
- Kirjatut liikkeet erottuvat vihreällä success-henkisellä korostuksella.
- Liikkeen detailissä säilytettiin nykyinen `ExerciseLogCard` ja reps-first-syöttö.
- Strength-liikkeille lisättiin kevyt sarjakohtainen editori:
  - painon +/- säätö
  - toistojen +/- säätö
  - laatu tähtinä
  - sarjan lisäys ja poisto
- Treenin kesto muutettiin kompaktiksi +/- stepperiksi, oletuksena 8 min.
- Viimeisin tulos näyttää setit muodossa `12x55 / 10x60` ja lisää session tuntemuksen/laadun, jos se löytyy.

### Key decisions

- `selectedExerciseId`-logiikka säilytettiin Workout-näkymän sisäisenä lista/detail-tilana.
- Uutta routea ei lisätty.
- Nykyinen reps-first parseri säilytettiin ennallaan.
- Autosave, draft ja completed-session tallennuslogiikka säilytettiin.
- Sarjakohtainen editori päivittää samaa exercise-logia ja pitää `setsText`-tekstimuodon yhteensopivana.
- Kesto tallentuu edelleen `durationMinutes`-kenttään.
- Done/not done -korttien värit käyttävät nykyisiä semanttisia rooleja.

### What was intentionally left out

- Ei toteutettu täyttä uutta sarjaeditoriflowta tai quality-analytiikkaa.
- Ei toteutettu liikepankkia, kalenteria, achievements-toimintoja tai completed workout reopening -flowta.
- Ei muutettu workoutSession-datamallia raskaasti.
- Ei muutettu ohjelman editointia tai backend/cloud/login-rakennetta.

### Tests run

- `getLastExerciseResult` smoke check demo-sessioilla.
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2F.1 — Workout Exercise Detail QA + Mobile Polish
## Step 1.2F.1 — History Details + Workout Section Cards QA Polish

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/pages/History.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- History-kortit näyttävät nyt session yhteenvedon:
  - tehtyjen liikkeiden määrä suhteessa ohjelmapäivän liikkeisiin
  - kokonaissarjat
  - paras set-pohjainen suoritus, jos saatavilla
- Historyn liikechipit ovat klikattavia ja avaavat saman session sisällä kevyen detailin.
- History näyttää ohjelmapäivän tehdyt ja tekemättömät liikkeet eri tiloilla.
- Workout-lista ryhmiteltiin section-kortteihin:
  - Lämmittely
  - Päivän liikkeet
  - Mukautettu liike
- Kohdennettu lämmittely näkyy Lämmittely-sectionissa joko rivinä tai kevyenä lisää-toimintona.
- Mukautettu liike lisättiin placeholder/action cardina.

### QA fixes

- Varmistettiin buildilla, että Step 1.2F:n lista/detail-JSX toimii section-rakenteessa.
- `selectedExerciseId` säilyy `{ dayId, exerciseId }`-mallissa ja päivän vaihto resetoi detailin listaan.
- Duration stepper, set-by-set controls, autosave, completion confirmation ja completed-session save -polku säilytettiin.

### Key decisions

- History vastaa nyt paremmin kysymykseen “Mitä tein viimeksi?”
- History näyttää tehdyt ja tekemättömät liikkeet eri tiloilla.
- Historyn liikechipit ovat klikattavia ja avaavat kevyen detailin.
- Workout-lista ryhmiteltiin Lämmittely-, Päivän liikkeet- ja Mukautettu liike -sectioneihin.
- Mukautettu liike on tässä vaiheessa placeholder/action card, ei vielä oikea dynaaminen custom exercise -toiminto.
- Step 1.2F:n set-by-set controls, duration stepper, selectedExerciseId, autosave ja completion confirmation säilytettiin.

### What was intentionally left out

- Ei vielä oikeaa custom exercise -lisäystä.
- Ei vielä completed workout reopening -flowta.
- Ei vielä kalenteria.
- Ei vielä achievements-näkymää.
- Ei vielä isoa datamallirefaktorointia.

### Tests run

- `getLastExerciseResult` smoke check demo-sessioilla.
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item

## Step 1.2F.6 — Targeted Warmup State + Duration Stepper Bugfix

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/hooks/useGymFlowData.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Treenin kokonaiskeston stepper korjattiin käyttämään loogista 5 minuutin askelta.
- Uusien treeniluonnosten kokonaiskeston oletus muutettiin 0 minuuttiin.
- Vanhojen väliarvojen, kuten 8 min, stepper-käytös pyöristyy järkeviin 5 minuutin askeliin.
- Kohdennettu lämmittely ei jää enää kirjattu/success-tilaan pelkän `enabled`-tilan takia.
- Disabled tai tyhjä kohdennettu lämmittely ei tallennu completed-session suoritukseksi.

### Bug details

- Aiempi 8 min oletus ja 5 minuutin askel aiheuttivat epäloogisen 8 min → 3 min -tilanteen.
- Kohdennetun lämmittelyn `enabled`-tila saattoi pitää rivin aktiivisena, vaikka käyttäjä poisti `Tehty`-valinnan eikä ollut lisännyt muuta sisältöä.

### UI decisions

- Kohdennetulle lämmittelylle lisättiin aktiivisessa tilassa selkeä checkbox/poisto-rivi.
- Käyttäjä voi poistaa vahingossa lisätyn kohdennetun lämmittelyn käytöstä ilman draft-arvojen pakotettua tyhjennystä.
- Treenin kokonaiskesto näyttää edelleen `0 min`, `5 min`, `10 min` ja tuntimuodot `formatDuration`-helperin kautta.

### Data/logic decisions

- Treenin kokonaiskeston oletus uusissa luonnoksissa on 0 min, ei 8 min.
- 8–12 min säilyy vain warmupin tavoiteohjeena, jos sitä näytetään.
- Kohdennettu lämmittely ei ole kirjattu pelkän enabled-tilan perusteella.
- Kohdennettu lämmittely on kirjattu vain, jos käyttäjä on merkinnyt sen tehdyksi tai lisännyt sisältöä.
- Completed-session suodatus käyttää kohdennetulle lämmittelylle `hasLoggedExercise`-päätöstä.

### What was intentionally left out

- Ei muutettu SARJAT-inputia.
- Ei muutettu Kirjatut sarjat -chippejä.
- Ei muutettu Sarjakohtainen kirjaus -aluetta.
- Ei lisätty custom exercise -toimintoa.
- Ei lisätty kalenteria.
- Ei lisätty achievements-näkymää.
- Ei tehty completed workout reopeningia.

### Tests run

- Targeted warmup `hasLoggedExercise` smoke check:
  - enabled + empty → false
  - completed → true
  - note → true
  - disabled → false
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item

## Step 1.2F.5 — Workout Detail Meta Alignment Polish

Päivä: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Exercise detail -kortin `Tuntemus`-kenttä siirrettiin visuaalisesti lähemmäs `Treenin kesto` -stepperiä.
- Meta-alue ei enää leviä koko kortin leveydelle desktop/tablet-näkymässä.
- Kapeimmilla mobiilileveyksillä meta-alue pinoutuu hallitusti rikkomatta layoutia.

### UI decisions

- Tuntemus siirrettiin visuaalisesti lähemmäs Treenin kestoa.
- Exercise detailin meta-alueesta tehtiin compact-ryhmä.
- Meta-alueen leveys rajoitettiin, jotta kentät eivät leviä koko kortin leveydelle.
- Desktop/tablet käyttää `fit-content`-ryhmää ja rajattua select-leveyttä.
- Mobiilissa kentät pysyvät tiiviinä ja pinoutuvat vasta kapeimmilla näytöillä.
- Ei tehty datamallin tai treenilogiikan muutoksia.

### What was intentionally left out

- Ei muutoksia SARJAT-inputiin.
- Ei muutoksia Kirjatut sarjat -chippeihin.
- Ei muutoksia Sarjakohtainen kirjaus -logiikkaan.
- Ei uusia ominaisuuksia.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item

## Step 1.2F.4 — Exercise Detail Layout + Parsed Set Chips + Bottom Nav Polish

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Exercise detail -kortin treenin kesto ja tuntemus asetettiin samaan compact-layout-riviin.
- Nopea reps-first `Sarjat`-input säilytettiin.
- Parsitut sarjat lisättiin `Kirjatut sarjat` -chippeinä nopean inputin alle.
- Sarjakohtainen kirjaus säilyi edelleen muokkausalueena.
- Laatustars pidettiin amber/accent-semanttisessa värissä.
- Bottom navin aktiivista tilaa vahvistettiin hillityllä varjolla.

### UI decisions

- Tuntemus palautettiin treenin keston viereen compact-layoutiin.
- Parsitut sarjat näytetään pieninä vaakasuuntaisina chippeinä, jotka wrapataan mobiilissa.
- Sarjakohtainen editori pysyy ensisijaisena muokkausalueena chip-listan alla.
- Amber = quality/highlight, green = valmis/hyväksy, red/brown = poisto/vaarallinen toiminto.
- Bottom nav säilytettiin kompaktina eikä navigaation toiminnallista logiikkaa muutettu.

### What was intentionally left out

- Ei vielä custom exercise -lisäystä.
- Ei completed workout reopeningia.
- Ei kalenteria.
- Ei achievements-näkymää.
- Ei uutta backend/cloud/login-toimintoa.
- Ei datamallimuutoksia.

### Tests run

- Mojibake smoke check `Workout.jsx` ja `ExerciseLogCard.jsx`.
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item

## Step 1.2F.3 — Merge Workout Info + Selected Exercise Card

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Valitun liikkeen detail-näkymässä treenin tiedot ja liikkeen kirjauskortti yhdistettiin yhdeksi kompaktiksi kortiksi.
- Yhdistetyn kortin header näyttää:
  - treenipäivän ja kuvauksen
  - luonnoksen tallennusajan
  - treenin keston +/- stepperillä
  - tuntemus-valinnan
- Kortin body näyttää edellisen tuloksen ja nykyisen `ExerciseLogCard`-kirjauksen.
- Kortin footerissa on `Liike valmis` -success-painike, joka sulkee detailin ja palauttaa päivän liikelistaan.
- `ExerciseLogCard` sai kevyen `embedded`-tilan, jotta se voidaan näyttää yhdistetyn kortin sisällä ilman ylimääräistä nested-card-fiilistä.
- Quality star -värit viimeisteltiin GymFlowin amber/accent-semantikkaan.

### Key decisions

- `selectedExerciseId`-logiikka säilytettiin ennallaan.
- Reps-first input, set-by-set controls, duration stepper, autosave draft ja completion modal säilytettiin.
- Treenin tiedot näytetään erillisenä korttina vain listanäkymässä; detailissä ne ovat yhdistetyn kortin headerissa.
- Vihreä säilyy save/completed/accepted-toiminnoille.
- Quality stars käyttää amber/accent-tyyliä, ei punaista tai success-vihreää.

### What was intentionally left out

- Ei vielä custom exercise -lisäystä.
- Ei datamallin muutoksia.
- Ei reps-first parserin muutoksia.
- Ei completed workout reopeningia.
- Ei kalenteria tai achievements-näkymää.

### Tests run

- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item

## Step 1.2F.2 — Workout Section Cards Compact QA Polish + Bottom Nav Active Shadow

Päivä: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Korjattiin Step 1.2F.1:n Workout-näkymään jääneet mojibake-/kirjoitusvirheet.
- Korjattiin näkyvät tekstit:
  - `Lämmittely`
  - `Päivän liikkeet`
  - `voimaliikettä`
  - `Lisäliike`
  - mukautetun liikkeen placeholder- ja palauteteksti
- Päivän liikkeet -listasta poistettiin normaalia käyttöä haittaava sisäinen scroll-raja.

### UI decisions

- Lämmittelyn lisäys muutettiin selkeämmäksi checkbox/toggle-riviksi.
- Lämmittely-, Päivän liikkeet- ja Mukautettu liike -kortteja tiivistettiin.
- Päivän liikkeet -kortin sisäistä scrollia vältetään normaalissa käytössä.
- Bottom navin aktiivista tilaa vahvistettiin hillityllä varjolla ja pienellä nostolla.
- Custom exercise -toiminto jätettiin edelleen placeholderiksi.

### What was intentionally left out

- Ei vielä oikeaa custom exercise -lisäystä.
- Ei vielä completed workout reopeningia.
- Ei kalenteria.
- Ei achievements-näkymää.
- Ei datamallin muutoksia.

### Tests run

- Mojibake smoke check `Workout.jsx` ja `History.jsx`.
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2G — Custom Exercise Placeholder to Draft Item
## Step 1.2F.8 — Targeted Warmup Popup + Inline-Expand

Date: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Kohdennetun lämmittelyn lisäys vahvistetaan popupilla ennen aktivointia.
- Käyttäjä voi perua lisäämisen ilman, että draftiin jää aktiivista targeted warmupia.
- Kohdennettu lämmittely näkyy nyt inline-expand-korttina valinnan jälkeen.
- Disabled / tyhjä kohdennettu warmup ei kirjaudu completed-session merkinnäksi.
- `hasLoggedExercise` ei enää laske enabled-tilaa yksin kirjaukseksi.

### UI decisions

- Popup on hillitty, vaalea ja rounded, primary success-vihreä, secondary neutral.
- Inline-expand on compact card warmup-sectionin sisällä.
- Tuntemus ja treenin kesto pysyvät compact-alueessa.
- Sarjakohtaiset tähdet ovat amber-värisiä, valitsemattomat muted/neutral.

### Data/logic decisions

- `enabled` ei yksin riitä kirjaukseksi.
- Kohdennettu warmup counttaa vain, jos sillä on `completed`, `note`, `customWarmupName` tai muuta käyttäjän syöttämää sisältöä.
- Käyttäjä voi ottaa vahingossa lisätyn kohdennetun lämmittelyn pois käytöstä.
- Draft-arvot säilyvät, jos kohdennettu warmup kytketään pois ja takaisin päälle saman session aikana.

### What was intentionally left out

- Custom exercise -lisäys ei ole vielä toteutettu.
- Completed workout reopening ei ole mukana.
- Kalenteri ei ole mukana.
- Achievements-näkymää ei ole mukana.
- Sarjakohtainen kirjaus ja SARJAT-input säilyvät ennallaan.

### Tests run

- Popup flow smoke check:
  - Peruuta
  - Kyllä, lisään
- Inline-expand entry smoke check
- `hasLoggedExercise` smoke check:
  - enabled + empty -> false
  - completed -> true
  - note -> true
  - disabled -> false
- `npm run build`
- `npm run lint`

### Build/lint result

- Build: passed
- Lint: passed

### Next recommended step

Step 1.2F.9 — Parsed Set Cards vaakatasoon + Liike valmis -painike polish

## Step 1.2F.9 — Bottom Nav + Program Page Button Polish

Date: 2026-05-16

### Files changed

- `src/App.css`
- `src/pages/Program.jsx`
- `src/components/BottomNav.jsx`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Bottom nav aktiivinen tila viimeisteltiin hillityllä varjolla ja pienellä nostolla.
- Hover / active -tilat tehtiin selkeämmiksi ja yhtenäisiksi kaikilla sivuilla.
- Bottom nav -itemeille lisättiin yhtenäinen border, rounded corners ja 6px-8px padding.
- Aktiivisen nav-itemin tekstikontrasti vahvistettiin käyttämään accent-tekstisävyä.
- Program-sivun `Lisää liike` -painike vaihdettiin `btn--accent`-rooliin.
- Accent-painikkeelle lisättiin hillitty hover/active-varjo ja pieni lift-efekti.
- Fontti, padding ja border radius pysyvät samassa button-järjestelmässä muiden sivujen kanssa.

### What was intentionally left out

- Ei muutoksia navin logiikkaan.
- Ei uusia toimintoja ohjelmaan.
- Ei vielä kohdennetun lämmittelyn inline-expand lisäystä.
- Ei muutoksia workoutSession-datamalliin.

### Tests run

- Hover ja selected/active tarkistettu CSS-tasolla kaikille bottom nav -itemeille.
- Program `Lisää liike` -painike tarkistettu käyttämään `btn--accent`-roolia.
- Bottom navin sisältövara säilyy nykyisen page padding -mallin kautta.
- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.10 — Kohdennetun lämmittelyn inline-expand ja multi-warmup support

## Step 1.2F.12 — Targeted Warmup Inline-Card Finalization Status

Date: 2026-05-16

### Files checked

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### Current implemented state

- Kohdennetun lämmittelyn popup -> inline-expand -workflow on toteutettu.
- Cancel sulkee popupin ilman draft-muutoksia.
- OK avaa inline-cardin ja aktivoi kohdennetun lämmittelyn draftissa.
- Inline-cardissa on tyyppivalinta, merkintä/note, duration stepper, tehty-toggle, poisto-toiminto ja edellisen session näyttö, jos sellainen löytyy.
- Duration stepper käyttää 5 minuutin oletusta, 1 minuutin muutoksia ja 0-15 minuutin rajoja.
- Nykyinen autosave, draft, completed session -tallennus, parsed set cards ja `Liike valmis` -workflow säilyvät.

### Important correction

- Multi-targeted warmup support ei ole vielä toteutettu.
- Nykyinen `Workout.jsx` käyttää edelleen yhtä kohdennettua warmupia:
  - `currentDraft?.exercises.find(isTargetedWarmup)`
  - `existingTargeted`
  - yksi `targetedWarmupLog`
- Useampi kohdennettu warmup per päivä vaatii vielä datamalli- ja UI-muutoksen.

### What was intentionally left out

- Custom exercise creation ei ole toteutettu.
- Kalenteri ja achievements eivät ole mukana.
- Multi-warmup-datamalli ei ole mukana.
- Completed workout reopening ei ole mukana.

### Tests / verification

- Code context checked for targeted warmup model.
- Latest known verification:
  - `npm run build`: passed
  - `npm run lint`: passed

### Next recommended step

Step 1.2F.13 — Implement real multi-targeted warmup support or move to Workout final polish / History sarjat ja detail summary

## Step 1.2F.12 — Targeted Warmup Inline-Card Finalization

Date: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/utils/exerciseTracking.js`
- `src/data/defaultExercises.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Kohdennettu warmup popup -> inline-card flow viimeisteltiin nykyisen yhden warmupin malliin.
- Checkbox-henkinen `Lisää kohdennettu lämmittely` -rivi avaa vahvistuspopupin.
- `Peruuta` sulkee popupin ilman draft-muutoksia.
- `Kyllä, lisään` aktivoi warmupin ja näyttää inline-expand-cardin warmup-sectionissa.
- Inline-cardissa on:
  - lyhennetty type dropdown: `Olkapäät`, `Lonkka`, `Polvi`, `Muu`
  - merkintä/note
  - duration stepper
  - `Tehty` toggle
  - `Poista` action
- Duration stepper käyttää 5 minuutin oletusta, 1 minuutin askelia ja 0-15 minuutin rajoja.
- Vanha `Olkapäiden lämmittely` -arvo normalisoidaan UI:ssa arvoon `Olkapäät`.
- Uusien defaultien kohdennettu warmup käyttää nyt `Olkapäät`-oletustyyppiä.
- Inline-card näyttää viimeisimmän kohdennetun warmupin tuloksen, jos historiasta löytyy suoritus.
- Stepper, `Tehty`-toggle ja `Poista`-toiminto asetettiin samaan kompaktiin action-riviin.
- Inline-cardin border, shadow, padding ja spacing viimeisteltiin kompaktimmaksi ja erottuvaksi.
- Existing logic preserved: autosave, draft, completed session, selectedExerciseId, parsed set cards ja `Liike valmis`.

### What was intentionally left out

- Multi-targeted warmup ei ole mukana; edelleen vain yksi kohdennettu warmup per päivä.
- Treenikalenteri ei ole mukana.
- Achievements / Progress-kaaviot eivät ole mukana.
- Program full editing ei ole mukana.
- Completed workout reopening ei ole mukana.

### Tests run

- Popup / inline-expand workflow checked at code level.
- Stepper +1/-1 min checked by implementation.
- `Tehty` / `Poista` toggle path checked by implementation.
- Last session display checked by existing `getLastExerciseResult` flow.
- Sarjakortit ja quality stars säilytetty.
- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.13 — Workout final polish / History sarjat ja detail summary

## Step 1.2F.13 — Multi-Targeted Warmup Inline-Cards

Date: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/hooks/useGymFlowData.js`
- `src/utils/workoutLogUtils.js`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Lisättiin tuki useammalle kohdennetulle warmupille saman treenipäivän draftissa.
- Ensimmäinen kohdennettu warmup säilyttää popup -> inline-card -flow'n.
- Popupin `Peruuta` ei tee draft-muutoksia.
- Popupin `Kyllä, lisään` aktivoi ensimmäisen kohdennetun warmupin.
- Kun vähintään yksi kohdennettu warmup on lisätty, `+ Lisää kohdennettu lämmittely` lisää uuden inline-cardin suoraan listaan.
- Jokainen uusi warmup saa oman uniikin `exerciseId`-arvon ja `order`-kentän.
- Kortit näkyvät lisäysjärjestyksessä.
- Jokaisessa warmup-cardissa on:
  - Type dropdown: `Olkapäät`, `Lonkka`, `Polvi`, `Muu`
  - Merkintä-kenttä
  - Duration stepper 0-15 min, 1 minuutin askelin, oletus 5 min
  - `Tehty` toggle
  - `Poista` action
- `Tehty` ja `Poista` vaikuttavat vain kyseiseen warmupiin.
- Poistettu warmup jätetään draftiin disabled-tilaan eikä tallennu completed-session suoritukseksi.
- Completed-session tallennus tukee useita kohdennettuja warmupeja, koska jokainen on oma `exercise`-loginsa.
- `hasLoggedExercise` huomioi kohdennetun warmupin duration-arvon kirjaukseksi.
- Lisättiin `getLastTargetedWarmupResult`, joka hakee viimeisimmän warmup-tuloksen warmup-tyypin mukaan.
- Inline-cardien compact layout, border, shadow ja spacing säilytettiin nykyisessä GymFlow-tyylissä.
- Existing logic preserved: autosave, draft, completed session, selectedExerciseId, parsed set cards ja `Liike valmis`.

### UI decisions

- Ensimmäinen lisäys vaatii vahvistuspopupin, jotta vahinkolisäys ei muuta draftia.
- Seuraavat lisäykset ovat nopeita ja luovat kortin suoraan, koska käyttäjä on jo warmup-listassa.
- Jokainen warmup-card on oma inline-card listassa, ei erillinen route tai modal.
- Last session -teksti haetaan warmup-tyypin perusteella, jotta useampi kortti voi näyttää oman relevantin historian.

### What was intentionally left out

- Custom exercise creation ei ole toteutettu.
- Treenikalenteri ei ole mukana.
- Achievements / Progress-kaaviot eivät ole mukana.
- Program full editing ei ole mukana.
- Completed workout reopening ei ole mukana.

### Tests run

- Multi-targeted warmup code path checked by implementation.
- Popup -> first inline-card workflow checked by implementation.
- Additional inline-card creation checked by implementation.
- Per-card `Tehty` / `Poista` targeting checked by implementation.
- Stepper 0-15 min and 1 min increment preserved.
- Last session lookup updated for targeted warmup type matching.
- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.14 — Workout final polish / History sarjat ja detail summary

## Step 1.2F.14 — Multi-Targeted Warmup Popup Confirmation

Date: 2026-05-16

### Files changed

- `src/pages/Workout.jsx`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Lisättiin popup-varmistus myös toisen ja seuraavien kohdennettujen warmupien lisäämiseen.
- Ensimmäisen kohdennetun warmupin popup-flow säilyy ennallaan.
- Kun käyttäjä klikkaa `+ Lisää kohdennettu lämmittely`, draftiin ei tehdä muutosta heti.
- Lisäkortin popup näyttää otsikon `Haluatko lisätä toisen kohdennetun lämmittelyn?`.
- Popupin `Peruuta` sulkee dialogin ja palaa olemassa olevaan inline-card-listaan ilman draft-muutoksia.
- Popupin `Kyllä, lisää` luo uuden kohdennetun warmup inline-cardin.
- Koodiin lisättiin kommentit popup-varmistuksen, `Peruuta`-toiminnon ja `Kyllä`-toiminnon vastuista.
- Kaikki Step 1.2F.13:n multi-targeted warmup -toiminnot säilytettiin:
  - type dropdown
  - merkintä
  - duration stepper 0-15 min, 1 min askel
  - Tehty / Poista per card
  - Last session display
  - autosave draft
  - selectedExerciseId
  - Liike valmis

### What was intentionally left out

- Ei muutoksia `ExerciseLogCard`-kortin sisäiseen toiminnallisuuteen.
- Ei muutoksia completed-session tallennuslogiikkaan.
- Ei muutoksia history-, parser- tai program-logiikkaan.

### Tests run

- Popup -> inline-card workflow checked by implementation.
- Additional warmup add now routes through confirmation popup.
- Cancel path leaves existing inline cards unchanged.
- Confirm path creates one new inline card.
- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.15 — Workout final polish / History sarjat ja detail summary

## Step 1.2F.10 — UI Finalization: Button Colors, Bottom Nav, Kohdennettu Warmup

Date: 2026-05-16

### Files changed

- `src/App.css`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/Program.jsx`
- `src/components/BottomNav.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/utils/workoutLogUtils.js`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Primary/accent-painikkeiden värit viimeisteltiin uuteen keltaiseen linjaan:
  - default `#FBBF24`
  - hover `#F59E0B`
  - active `#D97706`
  - text `#FFFFFF`
- Success-painikkeet viimeisteltiin kirkkaan vihreiksi:
  - default `#4CAF50`
  - hover `#45A049`
  - active `#3E8E41`
  - text `#FFFFFF`
- Secondary/neutral-painikkeet säilytettiin vaalean harmaassa mallissa:
  - default `#E5E7EB`
  - hover `#D1D5DB`
  - text `#1F2937`
- Bottom navin selected-tila päivitettiin soft yellow -taustaan, tummempaan accent-tekstiin, borderiin, varjoon ja pieneen lift-efektiin.
- Bottom navin inactive/hover-tilat pidettiin tummanharmaalla tekstillä, tummemmalla hover-borderilla ja hillityllä varjolla.
- Kohdennetun lämmittelyn checkbox-rivi avaa popupin ilman draft-muutoksia.
- Popupin OK avaa inline-cardin ja cancel jättää draftin ennalleen.
- Kohdennetun lämmittelyn duration-stepper käyttää 5 minuutin oletusta, 1 minuutin askelta ja 0-15 minuutin rajoja.
- Kohdennettu warmup näyttää edellisen tallennetun tuloksen, jos historiasta löytyy suoritus.
- Sarjakohtainen kirjaus käyttää vaakasuuntaisia set-kortteja.
- Laatustars käyttää keltaista accent-sävyä.
- Sarjan poistopainike muutettiin tummanharmaaksi.

### UI decisions

- Amber/yellow on lisäys- ja primary-toimintojen pääväri.
- Success-vihreä on varattu hyväksyntään ja valmiiksi merkitsemiseen, kuten `Liike valmis`.
- Secondary-harmaa on käytössä peruutuksissa, muokkauksessa, päivävalinnassa ja poistossa.
- Bottom nav säilyy kompaktina fixed-navigaationa ja sivun bottom padding suojaa sisältöä peittymiseltä.
- Parsed set summary pysyy sarjakorttien yläpuolella nopeaa tarkistusta varten.

### What was intentionally left out

- Ei muutettu data-logiikkaa.
- Ei muutettu autosavea.
- Ei muutettu historyn tallennus- tai näyttölogiikkaa.
- Ei muutettu reps-first parseria.
- Ei toteutettu multi-warmup-datamallia.
- Ei toteutettu completed workout reopening -flowta.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.11 — Visual QA pass on mobile and desktop viewports

## Step 1.2F.11 — Bottom Nav Border Thickening

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Bottom nav -containerin border paksunnettiin 1px -> 2px.
- Bottom nav -itemien border paksunnettiin 1px -> 2px.
- Hover-, active- ja selected-tilat säilyttävät nykyiset värit, soft yellow -taustan, varjot ja lift-efektin.

### UI decisions

- Muutos rajattiin borderin paksuuteen.
- Värit, paddingit, shadowt, transformit ja nav-toiminnallisuus jätettiin ennalleen.

### What was intentionally left out

- Ei muutoksia BottomNav-komponentin logiikkaan.
- Ei muutoksia muihin painikkeisiin.
- Ei muutoksia warmup-, parser-, history- tai autosave-logiikkaan.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.12 — Mobile visual QA and spacing pass

## Step 1.2F.11F — Accent Button Border Match Active Bottom Nav

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Vaaleankeltaisen pohjavärin painikkeiden border paksunnettiin vastaamaan aktiivisen Bottom Nav -napin borderia.
- `.btn--primary`, `.btn--accent` ja `.btn--warning` käyttävät nyt `3px solid rgba(180, 83, 9, 0.34)`.
- Hover-border säilyy samassa tummemmassa sävyssä kuin aktiivisen Bottom Nav -napin hover-border: `rgba(146, 64, 14, 0.46)`.
- Muutos koskee kaikkia sivuja, joilla käytetään samaa `Lisää treeni` -väriperheen painikeroolia.

### UI decisions

- Border paksuus ja sävy on nyt samaa visuaalista järjestelmää aktiivisen Bottom Nav -napin kanssa.
- Painikkeiden pohjaväri, tekstiväri, hover/active-taustat, shadowt ja toiminnallisuus säilytettiin ennallaan.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.11E — Active Bottom Nav Border Alignment

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Aktiivisen Bottom Nav -napin border yhdistettiin samaan ruskeaan border-tyyliin kuin vaaleankeltaiset primary/accent/warning-painikkeet.
- Aktiivisen nav-napin default border käyttää nyt `rgba(180, 83, 9, 0.34)`.
- Aktiivisen nav-napin hover border käyttää nyt `rgba(146, 64, 14, 0.46)`.

### UI decisions

- Muutos koskee aktiivista Bottom Nav -nappia, koska sen pohjaväri vastaa `Lisää treeni` -painikkeen väriyhdistelmää.
- Bottom Navin layout, lift, shadow, selected state ja toiminnallisuus säilytettiin ennallaan.
- Vaaleankeltaiset painikkeet eri sivuilla säilyttävät saman border-tyylin.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.11D — Accent Button Border Polish

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Lisättiin samaan vaaleankeltaiseen väriperheeseen kuuluville painikerooleille hillitty ruskea border:
  - `.btn--primary`
  - `.btn--accent`
  - `.btn--warning`
- Hover-tilassa border tummenee hieman samaan suuntaan kuin hover-tausta.
- Muutos koskee esimerkiksi `Aloita treeni`, `Lisää sarja`, `Lisää liike` ja `Lisää treenipäivä` -painikkeita.

### UI decisions

- Border lisättiin roolitasolle, jotta kaikki saman väriset painikkeet pysyvät yhtenäisinä.
- Buttonien tausta-, hover-, active-, teksti- ja layout-arvot säilytettiin ennallaan.
- Secondary- ja success-painikkeisiin ei tehty muutoksia.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.11C — Button Background Alignment With Active Bottom Nav

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Primary/accent/warning-painikkeet muutettiin käyttämään aktiivisen Bottom Nav -napin väriyhdistelmää:
  - default background `#fef3c7`
  - hover background `#fde68a`
  - active background `#fcd34d`
  - text `#b45309`
- Tämä koskee samoja button-token-rooleja kaikilla sivuilla, esimerkiksi `Aloita treeni`, `Lisää sarja`, `Lisää liike` ja `Lisää treenipäivä`.

### UI decisions

- Painikkeiden väri sidottiin aktiivisen nav-napin pohjan tyyliin, ei nav-napin tekstisävyyn.
- Bottom Navin oma tyyli jätettiin ennalleen.
- Secondary- ja success-painikkeisiin ei tehty muutoksia tässä korjauksessa.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.11B — Button Color Alignment With Active Bottom Nav

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Primary/accent/warning-painikkeiden taustasävy vaihdettiin vastaamaan aktiivisen Bottom Nav -tabin tekstisävyä:
  - default `#b45309`
  - hover `#92400e`
  - active `#78350f`
  - text `#ffffff`
- Secondary-painikkeiden harmaata tummennettiin kaikilla sivuilla:
  - default `#d1d5db`
  - hover `#9ca3af`
  - text `#1f2937`

### UI decisions

- Muutos tehtiin button-tokenien kautta, jotta sama painiketyyli päivittyy kaikille sivuille.
- Bottom Navin oma selected-, hover-, active-, border-, shadow- ja lift-tyyli jätettiin ennalleen.
- Success-painikkeiden vihreää roolia ei muutettu.

### What was intentionally left out

- Ei muutoksia painikelogiikkaan.
- Ei muutoksia BottomNav-komponenttiin.
- Ei muutoksia warmup-, parser-, history- tai autosave-logiikkaan.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.11A — Bottom Nav Border Further Thickening

Date: 2026-05-16

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was fixed

- Bottom nav -containerin border paksunnettiin 2px -> 3px.
- Bottom nav -itemien border paksunnettiin 2px -> 3px.
- Nykyiset värit, hover-, selected-, active-, shadow- ja lift-tilat säilytettiin.

### What was intentionally left out

- Ei muutoksia BottomNav-komponentin logiikkaan.
- Ei muutoksia muihin UI-elementteihin.
- Ei muutoksia data-, parser-, history- tai autosave-logiikkaan.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

## Step 1.2F.9B — Button System + Warmup/Set Cards Polish

Date: 2026-05-16

### Files changed

- `src/App.css`
- `src/pages/Home.jsx`
- `src/pages/Workout.jsx`
- `src/pages/Program.jsx`
- `src/components/ExerciseLogCard.jsx`
- `src/utils/workoutLogUtils.js`
- `docs/GYMFLOW_CONTEXT.md`

### What was implemented

- Primary/accent/lisäystoimintojen väri yhtenäistettiin amber/orange-sävyyn:
  - default `#F59E0B`
  - hover `#D97706`
  - active `#B45309`
  - text `#FFFFFF`
- Secondary-painikkeet yhtenäistettiin neutral gray/beige -malliin:
  - default `#E5E7EB`
  - hover `#D1D5DB`
  - text `#1F2937`
- `Aloita treeni`, `Lisää liike`, `Lisää treenipäivä`, `Lisää sarja` ja custom exercise -placeholder käyttävät nyt amber/accent-roolia.
- `Vaihda päivä`, `Liikepankki`, `Muokkaa`, `Poista` ja peruutustoiminnot käyttävät neutral secondary -roolia.
- Bottom navin `bottom-nav__item`-tiloja vahvistettiin:
  - 14px teksti
  - tummempi hover-border
  - selected accent-soft background
  - hillitty varjo ja `translateY(-1px)` lift
- Kohdennetun lämmittelyn lisääminen käynnistyy checkbox-henkisestä rivistä ja avaa vahvistuspopupin.
- Vahvistuksen jälkeen inline-card avautuu samaan warmup-sectioniin.
- Kohdennetun lämmittelyn inline-card näyttää edellisen tuloksen, jos sellainen löytyy historiasta.
- Kohdennettu lämmittely sai 0-15 minuutin duration-stepperin, oletuksena 5 min ja 1 minuutin askel.
- Parsed set summary säilyy sarjakorttien yläpuolella.
- Sarjakohtainen kirjaus muutettiin vaakasuuntaisiksi set-korteiksi, joissa säilyvät paino +/-, reps +/-, quality stars sekä sarjan poisto.
- Quality stars käyttää nyt samaa amber/accent-sävyä.

### What was intentionally left out

- Ei muutettu autosave-logiikkaa.
- Ei muutettu `selectedExerciseId`-lista/detail-rakennetta.
- Ei muutettu completion modalia.
- Ei lisätty multi-warmup-datamallia.
- Ei toteutettu completed workout reopening -flowta.
- Ei lisätty backendia, cloud synciä tai kirjautumista.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step 1.2F.10 — Kohdennetun lämmittelyn inline-expand ja multi-warmup support

## Step P1 — GymFlow Pro Visual Foundation

Date: 2026-05-17

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was visually changed

- Card radius was reduced from a softer 20px direction to a sharper 14px foundation.
- Smaller card surfaces now use a 10px small radius token where appropriate.
- Button radius was reduced from pill-shaped defaults to a 10px foundation, with an 8px small button token available.
- General cards, exercise cards, workout section cards, inline warmup cards, parsed set cards, modal cards, history detail cards, stat cards and bottom nav items were visually tightened.
- Card and button shadows were reduced to feel more like a premium mobile product and less like a demo form UI.
- Button role borders were made more restrained while preserving the existing role hierarchy.
- Success green was locked to a modern green scale:
  - default `#34c759`
  - hover `#2fb84f`
  - active `#28a745`

### Key decisions

- Chip and badge surfaces intentionally remain pill-shaped via chip/badge tokens.
- Success/vihrea remains reserved for complete, save and approve actions such as `Liike valmis` and `Treeni valmis`.
- Amber/yellow roles remain for add, suggestion, selected, PR and achievement-style actions.
- Secondary/neutral roles remain for back, cancel, switch-day and neutral actions.
- Danger roles remain for destructive actions.
- Button hierarchy was preserved through CSS token and role styling only.

### What was intentionally left out

- No Home Today Hero Card.
- No Completion Result Screen.
- No Backup / Restore.
- No comments, timers, calendar, achievements or progress charts.
- No datalogic changes.
- No parser changes.
- No localStorage key changes.
- No autosave changes.
- No completed-session persistence changes.
- No warmup or targeted warmup logic changes.
- No `workoutDays`, `sessions` or `exercises` data model changes.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Comprehensive Test Session before next feature step, then Step P2 — Home Today Hero Card.

## Step P1A — Radius Tightening Polish

Date: 2026-05-17

### Files changed

- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was changed

- `--card-radius` was tightened to `12px`.
- `--card-radius-sm` was tightened to `8px`.
- `--button-radius` was tightened to `8px`.
- `--button-radius-sm` was tightened to `6px`.
- Main card, exercise card, workout section, inline warmup, parsed set, modal, history and stat surfaces now inherit the tighter token values.
- Day picker cards, workout exercise thumbnails, done toggles and stepper controls were aligned with the tighter small radius tokens.
- Bottom nav was kept slightly softer than regular buttons, but tightened from the previous P1 shape.

### Key decisions

- Chips and badges were kept pill-shaped.
- Success green was not changed and remains `#34c759`, `#2fb84f`, `#28a745`.
- Existing amber/accent, secondary, danger, header, background, card and bottom nav colors were not changed.
- Button role logic and visual hierarchy were preserved.
- Padding and touch target sizing were left intact for mobile usability.

### What was intentionally left out

- No datalogic changes.
- No parser changes.
- No localStorage key changes.
- No autosave changes.
- No completed-session persistence changes.
- No warmup or targeted warmup logic changes.
- No `workoutDays`, `sessions` or `exercises` data model changes.
- No React component logic changes.
- No JSX structure changes.
- No broad shadow or border redesign.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Step P1B — Header Page Title Center Alignment, or Comprehensive Test Session before next feature step.

## Step P1B — Header Page Title Center Alignment

Date: 2026-05-17

### Files changed

- `src/App.jsx`
- `src/components/AppShell.jsx`
- `src/App.css`
- `docs/GYMFLOW_CONTEXT.md`

### What was changed

- Active page title was moved to the center of the app header.
- Header page title is now displayed in uppercase.
- Active view title mapping now displays:
  - `TÄNÄÄN`
  - `TREENI`
  - `HISTORIA`
  - `KEHITYS`
  - `OHJELMA`
  - `ASETUKSET`
- GymFlow brand area was kept on the left.
- Demo pill was moved to a dedicated right-side status area.
- `Made by Toni V` was kept as small brand metadata and hidden on narrow mobile widths.
- Header layout was changed to a compact three-column app-style layout.

### Key decisions

- Navigation behavior and active view state were not changed.
- Only the display mapping for the header title was changed.
- Header gradient and existing visual theme were preserved.
- Radius and color tokens were not changed.
- Success green was not changed.
- Button roles and bottom nav styling were not changed.

### What was intentionally left out

- No datalogic changes.
- No parser changes.
- No localStorage key changes.
- No autosave changes.
- No completed-session persistence changes.
- No warmup or targeted warmup logic changes.
- No `workoutDays`, `sessions` or `exercises` data model changes.
- No new routes or navigation state changes.
- No broad header redesign beyond page title alignment.

### Tests run

- `npm run build`
- `npm run lint`

### Build / Lint

- `npm run build`: passed
- `npm run lint`: passed

### Next recommended step

Comprehensive Test Session, or Step P2 — Home Today Hero Card.

## Exercise Thumbnail Assets — Initial Asset Batch

Aloitettu GymFlowin liike-thumbnail-kuvien rakentaminen.

Päätetty kuvatyyli:
- yksi kuva per liike
- PNG-muoto
- vaalea / beige tai valkoinen tausta
- anatominen fitness-illustration / thumbnail style
- pääkohdelihas korostetaan punaisella
- kuvat tallennetaan kansioon `src/assets/exercises/`
- tiedostonimet englanniksi, pienillä kirjaimilla, ilman ääkkösiä
- tiedostonimi, `id` ja `imageKey` pyritään pitämään samana myöhempää datakytkentää varten

Hyväksyttyjä / tallennettuja kuvia tähän mennessä:
- `bench-press-barbell.png`
- `lat-pulldown.png`
- `seated-cable-row.png`
- `scott-bench-curl.png`
- `smith-close-grip-flat-bench-press.png`
- `smith-incline-bench-press.png`
- `cable-rope-triceps-pushdown.png`
- `cable-straight-bar-triceps-pushdown.png`
- `cable-ez-bar-triceps-pushdown.png`

Tärkeä päätös:
Kuvia ei vielä kytketä appin UI:hin tässä vaiheessa. Varsinainen toteutus tehdään myöhemmin erillisessä stepissä:

### Step IMG1 — Exercise Thumbnails
- lisää `imageKey` liikedataan
- lisää `exerciseImages` mapping
- näytä pieni thumbnail liikkeen edessä
- fallback-kuva, jos liikkeeltä puuttuu kuva
- ei muutoksia parseriin, autosaveen tai completed-session tallennukseen