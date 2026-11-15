# GymFlow — Codexin pysyvät toimintaohjeet

## Ennen toteutusta

Lue `docs/GYMFLOW_CONTEXT.md` (tekninen master), `README.md`, `package.json`, `docs/GYMFLOW_DEVELOPMENT_LOG.md`, `docs/GYMFLOW_THESIS_NOTES.md` ja [agenttityönkulku](docs/GYMFLOW_AGENT_WORKFLOW.md). Tarkista repository, haara, lähtörevision tunniste ja `git status`. Säilytä olemassa olevat muutokset. Raportoi odottamaton lähtötilanne ennen jatkamista.

## Projektin periaatteet

GymFlow on mobile-first, offline-first workout diary / training dashboard. Visuaalinen suunta on premium minimal, SAP Light Beige / FleetFlow Light -henkinen. Offline-first on suunnitteluperiaate; PWA-valmius ei yksin todista testattua offline-toimintaa.

GymFlow ei ole sosiaalinen fitness-sovellus, kalorilaskuri, AI-valmentaja, Excel-klooni eikä geneerinen harjoituslomake.

## Pakolliset arkkitehtuurisäännöt

- Älä rakenna sovellusta kiinteän Day 1–4 -logiikan ympärille. Käytä geneeristä `workoutDays`-mallia; nelipäiväinen demo ei rajoita mallia.
- `workoutSession` tarkoittaa yhtä treenitapahtumaa, ei kalenteripäivää. Tue useita sessioita samana kalenteripäivänä.
- Saved sessions ovat Historyn ja Progressin source of truth.
- Säilytä vanhan tallennetun datan yhteensopivuus, myös puuttuvien kenttien käsittely.
- Workout-level duration ja exercise-level duration ovat erillisiä käsitteitä. Älä yhdistä session juuren `durationMinutes`-kenttää ja `activeDraft.exercises[].durationMinutes`-kenttää.

## Suojattavat toiminnallisuudet

Älä riko reps-first parseria, `{ reps, weight }` -settirakennetta, set-by-set editoria, autosavea, active draft restorea, completed-session savea tai Historyn lukua. Säilytä warmup-logiikka, targeted warmup multi-card -logiikka, duration-mallit, `imageKey`-mapping, mobile-first layout ja bottom navigation safe-area -toiminta.

Älä muuta localStorage key -nimiä:

- `gymflow_user_profile`
- `gymflow_program`
- `gymflow_exercises`
- `gymflow_sessions`
- `gymflow_settings`
- `gymflow_active_draft`

Master-kontekstin tallennusvirhehavainto ja duration-tavoitteen ristiriita ovat avoimia asioita. Niitä ei saa esittää korjattuina eikä korjata muun tehtävän sivussa.

## Työskentelysäännöt

- Noudata käyttäjän hyväksymää tehtäväkohtaista scopea ja hyväksymiskriteerejä.
- Tee pieniä, turvallisia ja testattavia muutoksia. Älä laajenna tehtävää oma-aloitteisesti.
- Älä tee arkkitehtuurimuutoksia ilman hyväksyntää tai muuta datamallia ilman erillistä hyväksyntää.
- Älä käsittele dokumentoituja tulevia ominaisuuksia jo toteutettuina.
- Älä lisää salaisuuksia tai tunnuksia repositoryyn.
- Älä väitä testejä suoritetuiksi ilman todellista ajoa. Älä väitä manuaalista selain- tai mobiilitestausta tehdyksi, ellei sitä ole tehty.
- Controller-tarkistus ei korvaa käyttäjän päätöstä. Yhdistä muutokset vasta käyttäjän hyväksynnän jälkeen; älä tee automaattista mergeä tai pushia `main`-haaraan.

## Testaus

Tavallisissa koodimuutoksissa suorita `npm run build` ja `npm run lint`.
Exercise image / exercise bank / image mapping -muutoksissa suorita lisäksi `npm run audit:images`.
Dokumentaatiomuutoksissa suorita `git diff --check` ja tarkista myös uusien, vielä untracked-tiedostojen sisältö ja whitespace.

Raportoi todelliset tulokset ja merkitykselliset varoitukset. Merkitse ajamatta jätetyt tarkistukset ja syy; historiallinen läpäisy ei ole nykyisen muutoksen testitulos.

## Dokumentointi ja luovutus

Päivitä jokaisen toteutusvaiheen jälkeen `docs/GYMFLOW_CONTEXT.md`: step number/name, summary, changed files, key decisions, tests, build/lint/audit results ja next recommended step. Päivitä kehityslokia ja opinnäytetyön muistiinpanoja, kun muutos liittyy niiden sisältöön. Älä poista aiempaa kehityshistoriaa.

Luovuta muutokset, testievidenssi, riskit ja avoimet asiat Controller-roolin tarkistukseen ja sen jälkeen käyttäjälle. Jos testi epäonnistuu, scope ylittyy tai tietojen yhteensopivuus vaarantuu, palauta työ korjattavaksi hyväksytyn scopen sisällä tai käyttäjän päätettäväksi, jos tarvitaan uusi rajaus.
