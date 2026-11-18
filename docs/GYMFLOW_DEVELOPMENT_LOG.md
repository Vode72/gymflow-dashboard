# GymFlow — Kehitysloki

Päivitetty 2026-11-15. Tekninen master: [GYMFLOW_CONTEXT.md](GYMFLOW_CONTEXT.md). Opinnäytetyön aineisto: [GYMFLOW_THESIS_NOTES.md](GYMFLOW_THESIS_NOTES.md).

## Dokumentointiperiaate

Kirjaa jokainen uusi kehitysstep kronologisesti. Erota toteutunut muutos, aiemmin raportoitu tulos ja tuleva suunnitelma. Testin ajamatta jättäminen ei tarkoita läpäisyä. Merkitse manuaalinen QA erikseen. Älä lisää salaisuuksia tai testaajien henkilötietoja.

## Aiemman kehityksen kooste

Lähde: alkuperäisen GYMFLOW_CONTEXT.md:n kehityshistoria ja repositoryn git-loki. Kyseessä on jälkikäteen koottu historia; OP-000 ei toistanut vanhoja testejä. Alkuperäiset yksityiskohtaiset tiedosto- ja päätöslistat säilyvät master-kontekstissa.

| Päivä | Vaihe | Toteutus / aiemmin raportoitu tulos |
| --- | --- | --- |
| Ei varmistettua päivää | Foundation ja workout logging | Mobile-first React/Vite-runko, näkymät, localStorage, reps-first-parseri, draft, tallennus, warmupit ja set-by-set-editori. Tarkkaa ajoitusta ei päätellä. |
| 2026-06-07 | IMG-2 | Keskitetty image mapping, imageKey, listan thumbnailit ja detail-preview, fallback. Build/lint raportoitu hyväksytyiksi. |
| 2026-06-07 | IMG-2C ja korjaukset | Kuva-auditointi, Kulmasoutu-imageKey ja Low Cable EZ Bar Curl -mapping. Viimeisessä tämän sarjan raportissa 0 kriittistä virhettä ja 55 varoitusta. |
| 2026-06-07 | IMG-2D | Kuvien ja metatietojen tiivistys, liikkeen keston erottaminen treenin kestosta. Build/lint/audit raportoitu hyväksytyiksi, auditissa 55 varoitusta. |
| 2026-07-28 | QA-IMG-3A (e071d32) | Thumbnailien renderöinti ja detail-kuvan rajaus. Build/lint/audit raportoitu hyväksytyiksi; selain/mobile-QA jäi tekemättä työkalun puuttuessa. |
| 2026-07-28 | DUR-1B (8002e27) | Liikekeston askel 1 minuuttiin, rajat 5–30 min; presetit ennallaan. Build/lint raportoitu hyväksytyiksi; ei manuaalista QA:ta. |
| 2026-07-30 | README (b175ccd, a3850da) | Portfolioesittely ja screenshot-tiedostonimien korjaus git-lokin perusteella. Testituloksia ei varmistettu. |
| 2026-11-15 | OP-000 | Dokumentaatiobaseline, opinnäytetyöaineiston keruutapa ja tulevan kehityksen suunnitelma. |

## OP-000 — Thesis Baseline Consolidation

Päivä: 2026-11-15. Lähtörevision tunniste: a3850da.

### Tavoite ja hyväksytty scope

Yhdistää nykyinen tekninen baseline, säilytettävä kehityshistoria, opinnäytetyön alkuperäinen runko ja hyväksytty tuleva suunta. Vain kolme dokumenttia saa muuttua:
- docs/GYMFLOW_CONTEXT.md
- docs/GYMFLOW_DEVELOPMENT_LOG.md
- docs/GYMFLOW_THESIS_NOTES.md

### Muutokset ja päätökset

Master-konteksti säilyttää vanhan historian ja kuvaa erikseen nykytilan, tulevat suunnitelmat ja regressiorajat. Tämä loki muodostaa kronologisen evidenssirungon. Thesis notes kuvaa työotsikon, rungon, tutkimusaihiot ja aineistonkeruun.

OP-001:n roolit ja valvova Controller ovat suunnitelma. TypeScript tehdään vaiheittain ennen auth-/Garmin-toteutusta ja ilman toiminnallisia muutoksia. OP-002 on ensin UI:sta erillinen Garmin/Python-POC. ARCH-1 arvioi tuotantoarkkitehtuurin; Supabase/PostgreSQL ei ole vielä lukittu valinta. Ihminen hyväksyy lopputuloksen ja julkaisun.

### Havainnot ja avoimet asiat

- DUR-1B ja nykykoodi: liikkeen keston askel 1 min, rajat 5–30. Tehtävänannon tavoite: askel 5 min, rajat 5–60. Molemmat kirjattu; OP-000 ei muuta toimintaa.
- Tallennuksen virhepolku tarvitsee erillisen QA:n: completeWorkout päivittää sessionit ja tyhjentää draftin, mutta localStorage-hook käsittelee kirjoitusvirheen sisäisesti. Onnistuneen pysyvän tallennuksen takuuta ei osoitettu.
- Nykyinen työtilakansio oli tyhjä; repository löytyi polusta C:/Users/Toniv/OneDrive/Ohjelmointi_projektit/gymflow-dashboard.
- Tehtävänantoliite katkeaa dokumenttivastuiden kohdassa. Näkyvä sallittujen tiedostojen rajaus ja sisältövaatimukset ohjaavat työtä.

### Tarkistukset ja rajat

Lähdevertailu: aiempi konteksti, git-historia, README, package.json, Vite/manifest sekä parserin, draftin, keston ja localStorage-avainten lähdekoodi. Dokumenttilinkit ovat suhteellisia saman docs-kansion sisällä.

Build, lint ja kuva-auditointi: ei ajettu dokumenttimuutokselle. Browser/mobile-QA: ei tehty. Aiemmat hyväksytyt testitulokset ovat historiallisia raportteja. Ei tuotantokoodin tai konfiguraation muutoksia, dependency-asennuksia, commitia, pushia tai PR:ää.

Seuraavaksi: OP-001:n rajaus, roolien vastuut, luovutusevidenssi ja Controllerin hyväksyntäkriteerit. QA-IMG-3, HIST-1 ja EXB-1 säilyvät backlogissa.

## Uuden stepin kirjauspohja

Kopioi seuraava rakenne jokaiselle tulevalle stepille; täytä tulokset vasta toteutuneiden tarkistusten perusteella.

- Stepin tunniste, nimi, päivämäärä ja lähtörevision tunniste.
- Tavoite, hyväksytty scope ja hyväksymiskriteerit.
- Muuttuneet tiedostot ja toteutunut käyttäytyminen.
- Päätökset, vaihtoehdot ja perustelut.
- Agenttiroolit, handoffit, Controllerin arvio ja ihmisen päätös.
- Ajetut komennot, tulokset, varoitukset; ajamatta jätettyjen tarkistusten syyt.
- Manuaalisen QA:n laite/selain, skenaariot ja todelliset havainnot tai “ei tehty”.
- Regressiorajojen tarkistus, poikkeamat, riskit ja avoimet asiat.
- Opinnäytetyöhön kerättävä evidenssi ja viittaus muistiinpanoihin.
- Seuraava suositeltu vaihe.

## OP-001 — Agent-assisted Development Baseline

Päivä: 2026-11-15. Lähtörevision tunniste: `fbf4dfa` (OP-000, remote `main`).

### Tavoite, scope ja lähtötilanne

Dokumentoida turvallinen Codex Cloud -työnkulku ja pysyvät Codex-ohjeet opinnäytetyön case-projektille. Käyttäjän antama OP-001-tehtävä hyväksyi tämän dokumentaatiototeutuksen. Sallitut tiedostot ovat alla luetellut viisi dokumenttia; sovelluskoodi, riippuvuudet, konfiguraatio ja Actions on rajattu pois.

Repository on `Vode72/gymflow-dashboard`. Alkuperäinen paikallinen haara `work` / `a3850da` oli puhdas mutta OP-000:aa vanhempi; poikkeama raportoitiin ennen muutoksia. `git ls-remote origin refs/heads/main` varmisti `fbf4dfabf7e7ebc64d5712348fe97e291b842564`. Commit oli paikallisesti saatavilla. Siitä luotiin erillinen `docs/op-001-agent-baseline`-haara; vanhaa haaraa ei siirretty. OP-000:aa ei toteutettu uudelleen. Lähtöbaselinessa ei ollut AGENTS.md:tä eikä agenttityönkulkudokumenttia.

Luettu README, package.json, master-konteksti, kehitysloki ja thesis notes sekä tarkistettu olemassa olevat agenttiohjeet. Hyväksymiskriteerit: juuren ohjeet, työnkulku ja kuusi roolia, Controllerin rajat, käyttäjän pakollinen hyväksyntä, kolmen dokumentin päivitys, säilynyt historia ja vain sallittujen dokumenttien muutokset.

### Muutetut ja luodut tiedostot

- `AGENTS.md` (uusi): projektiperiaatteet, arkkitehtuurirajat, suojattavat toiminnallisuudet, scope, testaus ja dokumentointi.
- `docs/GYMFLOW_AGENT_WORKFLOW.md` (uusi): kuusi loogista vastuuta, luovutukset, hyväksyntäportit, Controller, puhelinohjauksen validointisuunnitelma ja menetelmän evidenssirajat.
- `docs/GYMFLOW_CONTEXT.md`: OP-001:n nykytila, päätökset, testit ja roadmap; vanha roolisuunnitelma merkitty historialliseksi.
- `docs/GYMFLOW_DEVELOPMENT_LOG.md`: tämä toteutus- ja tarkistusraportti.
- `docs/GYMFLOW_THESIS_NOTES.md`: menetelmän dokumentointi ja toteutetun, suunnitellun, testatun sekä havaittujen tulosten erottelu.

### Päätökset, roolit ja handoffit

Kuusi nykyistä roolia: Product / UX, Architecture, Implementation, QA / Test, Documentation ja Controller. OP-000:n alustava roolijako säilyy historiallisena suunnitelmana; nykyinen jako täsmentää sitä. Automaattista orkestrointia, uusia työkaluja tai koodia ei toteutettu.

Tässä työssä yksi Codex-toimija hoiti toteutuksen, dokumentoinnin, QA:n ja Controller-roolin tarkistuksen peräkkäin. Erillisiä agentteja ei käynnistetty; kyseessä ei ole riippumaton review. Controllerin APPROVE tarkoittaa käyttäjälle luovutussuositusta. Käyttäjän lopullinen hyväksyntä odottaa; yhdistämistä tai julkaisua ei tehty.

### Tarkistukset ja tulokset

- `git diff --check`: exit 0, ei whitespace-virheitä.
- `git diff --no-index --check /dev/null AGENTS.md`: exit 1 (uusi tiedosto eroaa /dev/nullista), ei tulostetta eikä whitespace-virheitä.
- `git diff --no-index --check /dev/null docs/GYMFLOW_AGENT_WORKFLOW.md`: exit 1 (uusi tiedosto eroaa /dev/nullista), ei tulostetta eikä whitespace-virheitä.
- Git-diffin ja untracked-listan tarkistus: vain viisi sallittua dokumenttia muuttunut / luotu; juuren AGENTS.md ja työnkulku olemassa.
- Sisältötarkistus: kuusi roolia, Controllerin vastuut ja rajat, käyttäjän pakollinen hyväksyntä, roadmap sekä MOBILE-0/MOBILE-1:n suorittamaton tila dokumentoitu.
- Historian tarkistus suhteessa `fbf4dfa`: lokin ja thesis notesin alkuperäinen sisältö säilyy kokonaisena; master-kontekstissa vain päivitysotsikon ja historiallisen roadmap-otsikon täsmennys sekä uusi OP-001-osuus. Vanhoja kehitysmerkintöjä ei poistettu.
- Tarkistusskriptin ensimmäinen ajo pysähtyi odotusarvovirheeseen: no-index-diff palauttaa uusille tiedostoille 1 myös ilman whitespace-virheitä. Odotusarvo korjattiin ja tarkistukset ajettiin uudelleen. Dokumenttivirhettä ei löytynyt.
- Build/lint/image audit: ei ajettu, documentation-only-scope.
- Manuaalinen selain-/mobiili-QA ja käyttäjätestaus: ei tehty. MOBILE-0/MOBILE-1: ei suoritettu.

Controller-roolin itsearvio: APPROVE käyttäjän tarkistukseen. Dokumentaation hyväksymiskriteerit täyttyvät; sovelluksen toiminnasta tai mobiilityönkulun päästä päähän toimivuudesta ei anneta uutta testiväitettä.

### Riskit, avoimet asiat ja seuraava vaihe

Puhelinohjattu ketju on vielä validoimatta. Aiemmat duration-ristiriita ja localStorage-tallennusvirheen QA-tarve säilyvät avoimina. Ei sovelluskoodin, datamallin tai arkkitehtuurin muutoksia. Ei commitia, pushia, PR:ää tai mergeä tässä vaiheessa.

Seuraavaksi käyttäjän OP-001-tarkistus ja hyväksyntä, sitten MOBILE-0 ja erikseen hyväksyttävä MOBILE-1. Tuotearkkitehtuurin järjestys säilyy: OP-000 → OP-001 → TS-0…TS-4 → OP-002 → ARCH-1 → AUTH-x → GARMIN-x. Seuraavaa vaihetta ei aloitettu.

## MOBILE-1A — MOBILE-0-dokumentointi ja Cloud-työnkulun tarkistus

Päivä 2026-11-18. Tavoitteena oli tarkistaa aiempi MOBILE-0-näyttö ja kokeilla rajatun dokumentaatiomuutoksen viemistä Cloudista GitHub-katselmointiin.

### Varmennettu lähtötila

`Vode72/gymflow-dashboard` kloonattiin omaan hakemistoon, koska Cloud-työtilassa oli valmiina toinen repo. Uuden kloonin työpuu oli puhdas. `origin` osoitti osoitteeseen `https://github.com/Vode72/gymflow-dashboard.git`. GitHubin oletushaara `main` osoitti annettuun SHA:han `a044f7930e6b579f21eaed02917dba1d4274ac95`. Ero annettuun lähtötilaan oli haarassa: `work` puuttui etäreposta, ja SHA vastasi `main`-haaraa. Revisio ei ollut edennyt. Tehtävähaara `docs/mobile-1a` perustettiin tästä commitista.

### MOBILE-0-tulokset ja evidenssi

Haussa käytiin läpi repositoryn tiedostot, saatavilla olevien Git-viitteiden historia sekä GitHubin PR- ja issue-haut. OP-001:n agenttityönkulku, kehitysloki ja [PR #1](https://github.com/Vode72/gymflow-dashboard/pull/1) kirjaavat MOBILE-0:n suorittamattomaksi OP-001:n aikaan. Myöhempää testilokia, laite- tai selaintietoja, puhelintoimien havaintoja tai MOBILE-0-kohtaista PR:ää ei löytynyt. Varsinainen MOBILE-0-tulos jää varmentamatta.

| Tila | Toteutunut havainto |
| --- | --- |
| PASS | MOBILE-1A:n Cloud-osuudessa varmennettiin oikea repo, haara ja revisio sekä luettiin `AGENTS.md`, agenttityönkulku ja master-konteksti. |
| FAIL | Ei kirjattuja MOBILE-0-testivirheitä. |
| BLOCKED | Aiemman MOBILE-0-tuloksen varmentamiseen puuttuu suoritusnäyttö. MOBILE-1A:n ensimmäinen Git-yhteys pysähtyi sandboxin välityspalvelinyhteyteen. Hyväksytty uusintayritys onnistui. |
| NOT RUN | OP-001 kirjasi MOBILE-0:n suorittamattomaksi. MOBILE-1A:ssa ei suoritettu erillistä MOBILE-0-puhelintestiä eikä sovelluksen manuaalista mobiili-QA:ta. |

### Muutokset, tarkistukset ja luovutus

Päivitettiin `docs/GYMFLOW_CONTEXT.md` nykytilalla, tämä loki tarkistusevidenssillä ja `docs/GYMFLOW_THESIS_NOTES.md` menetelmän havainnoilla ja rajoilla.

- PASS — `git diff --check`, `git status --short`, `git diff --stat` ja `git diff --name-only`. Diff ja työpuun tiedostolista osoittivat vain kolme sallittua Markdown-muutosta.
- PASS — Lisäykset säilyttävät aiemmat tekstit. Dokumenttidiffin tarkistuksessa ei havaittu salaisuuksia tai tunnuksia. Sovelluskoodiin ja konfiguraatioon ei tullut muutoksia.
- NOT RUN — Build, lint ja kuva-auditointi eivät kuulu tähän dokumentaatiomuutokseen.

Controller-roolin itsearvio on APPROVE käyttäjän tarkistukseen. Sama Codex-toimija teki toteutuksen ja tarkistuksen. Yhdistäminen ja julkaisu edellyttävät käyttäjän hyväksyntää. Puhelintoimien näyttö puuttuu, ja tallennuksen virhepolun QA sekä liikkeen keston tavoiteristiriita ovat avoinna. Seuraava rajattava vaihe on MOBILE-1B.


## SAFE-1 — Active Draft Protection

Päivä: 2026-11-18. Lähtörevision SHA: `fee6c777f5dece6cbd3d4220ccbd02d2eb7dde68`, varmennettu remote main (MOBILE-1A PR #2). Tehtävähaara: `safe-1-active-draft`, erillinen puhdas worktree. Alkuperäinen `work`-haara säilytettiin muuttumattomana.

### Toteutus ja päätökset

Korjattu vain MOBILE-1B F01: treenipäivän valinta ei enää korvaa aktiivista luonnosta ilman nimenomaista hylkäysvahvistusta. Sama päivä säilyttää luonnoksen; ilman luonnosta uusi päivä käynnistyy normaalisti. Päivänvaihto avaa paikallisen natiivin `dialog`-elementin olemassa olevilla modal-card/button-row/btn-tyyleillä. Peruuta on neutraali oletustoiminto ja saa fokuksen; Escape peruuttaa. Hylkäys käyttää nykyistä puna/ruskeaa danger-väriä. Selain rajoittaa fokuksen ja taustainteraktiot modal-dialogiin; uutta modal-kehystä tai CSS:ää ei lisätty.

Vahvistus tallentaa kohdepäivän ja tarkan draft-olioviitteen. Ref-lukko torjuu nopeat toistuvat pyynnöt ja vahvistuksen kaksoisaktivoinnin. Muuttunut luonnos mitätöi vanhan vahvistuksen. Hook tarkistaa saman version myös funktionaalisessa tilapäivityksessä, joten jonossa aiemmin muuttunut luonnos säilyy. Aktiivinen luonnos määrää näkyvän päivän ennen aiempaa päivävalintaa. Vanhentunut vahvistus suljetaan tekemättä vaihtoa; käyttäjä voi pyytää vaihtoa uudelleen.

Muuttuneet tiedostot:
- `src/pages/Workout.jsx`
- `src/hooks/useGymFlowData.js` (vain startDraft-suojaus)
- `tests/activeDraftProtection.test.mjs`
- `docs/GYMFLOW_CONTEXT.md`
- `docs/GYMFLOW_DEVELOPMENT_LOG.md`

### Todellinen testievidenssi

- `npm ci --cache /tmp/gymflow-safe-1-npm-cache`: PASS, 181 pakettia; manifestia tai lockfilea ei muutettu. Ensimmäinen npm ci epäonnistui oletusvälimuistin hakemistoon; uusinta kirjoitettavalla cache-polulla onnistui.
- `node tests/activeDraftProtection.test.mjs`: PASS, 8 testiä / 0 virhettä. A–H: uusi luonnos, sama päivä, vahvistuspyyntö, peruutus, vahvistettu vaihto, nopeat valinnat/kaksoisvahvistus, vanhentunut ja jonossa muuttunut luonnos sekä vanhan palautetun luonnoksen säilyminen. Riippuvuudeton harness suorittaa lähteestä poimitut todelliset handlerit ja hookin startDraft-funktion mockatuilla state-settereillä; ei koko React-mountin testi.
- `node --test tests/activeDraftProtection.test.mjs`: exit 0 (ympäristön runner raportoi tiedostotason läpäisyn); suora ajo yllä raportoi kaikki kahdeksan tapausta.
- `npm run build`: PASS, exit 0, Vite 8.0.13.
- `npm run lint`: PASS, exit 0.
- Headless Chromium / Chrome 156.0.8078.79, paikallinen Vite ja kertakäyttöinen selainprofiili: PASS. 390 × 844 CSS px: luonnoksen luonti, sama päivä, liikekeston muokkauksen säilyminen peruutuksessa, nopeat päivävalinnat, Peruuta-oletusfokus, Escape, hylkäys/kaksoisaktivointi ja refresh restore.
- Dialogin selainmittaus 320/360/390/430 × 844 CSS px: dialogi pysyi viewportin sisällä, molempien toimintopainikkeiden korkeus 48 px. Ei fyysistä Android- tai kosketuslaitetestiä. Stale-state-kilpailut testattiin Node-harnessissa, ei selaimen React-tilan injektoinnilla.

### Rajat, tarkistus ja seuraava vaihe

Ei parserin, sarjaeditorin, autosave-hookin, storage-avainten/skeeman, completed-session-tallennuksen, Historyn, Progressin, warmupien, kestojen, kuvamappingin, riippuvuusmääritysten tai navigaatioarkkitehtuurin muutoksia. F02–F04 ja duration-tavoiteristiriita jäävät avoimiksi. Koko sovelluksen regressiota tai fyysistä mobiili-QA:ta ei väitetä suoritetuksi. Kuva-auditointia ei ajettu, koska kuvia/pankkia/mappingia ei muutettu.

Yksi toimija teki toteutuksen, testit ja Controller-itsearvion; ei riippumatonta review'ta. Diffin scope/historian säilyminen sekä `git diff --check` tarkistetaan ennen toimitusta. Merge ja julkaisu odottavat käyttäjän hyväksyntää; automaattista mergeä tai deploymentia ei tehdä.

Seuraava suositeltu vaihe: **SAFE-2**. Käyttäjän päivitetty järjestys: SAFE-1 → SAFE-2 → SAFE-3 → SAFE-4 → MOBILE-1C → QA-1 → TS-0 → TS-1…TS-4. Tämä tarkentaa aiempia historiallisia etenemissuunnitelmia; myöhempiä vaiheita ei toteutettu.

## SAFE-2 — Reliable Workout Session Save

Päivä 2026-11-18. Lähtörevisiona `9f0adf02ef2dfbb9138155574d842f6ad628400c` (`origin/main`, SAFE-1 PR #3). Työhaara `safe-2-reliable-session-save`.

### F02 ja toteutus

Workoutin vahvistus kutsui `completeWorkout`-funktiota, joka ajasti session lisäyksen ja luonnoksen tyhjennyksen. Historiaan siirryttiin, vaikka `useLocalStorage` kirjoitti vasta React-efektissä ja ohitti kirjoituspoikkeukset. Historia käyttää hookin sessiotilaa ja näyttää valmiit sessiot, joten käyttöliittymä saattoi näyttää pelkästään muistissa olevan session.

Vahvistus lukee ja tarkistaa `gymflow_sessions`-listan ennen synkronista kirjoitusta. Listan automaattinen efektikirjoitus poistettiin, jotta latauksen varadata tai vanhentunut React-tila ei ylikirjoita tallennettua historiaa. Eksplisiittinen demon nollaus tallentaa edelleen demolistan. Workout näyttää suomenkielisen virheen ja tarjoaa uusintaa, jos luku tai tallennus epäonnistuu. Luonnos tyhjennetään vasta session tallennuksen jälkeen. Jos tyhjennys epäonnistuu, tallennettu sessio säilyy ja Treeni tarjoaa tyhjennyksen uusinnan myös sivun päivityksen jälkeen. Uuden session tunniste perustuu luonnokseen, joten uusinta ei lisää toista sessiota.

Tallennusavaimet, session kentät ja aiempien sessioiden sisältö säilyvät. Samalle päivälle voi tallentua useita sessioita. Valmiin session aikaleimat sekä liikelokien sallinta ja kohdennettujen lämmittelyjen suodatus toimivat aiemmin käytetyillä säännöillä. SAFE-1:n päivävalinta, parseri, sarjaeditori, geneerinen ohjelmamalli, kestomallit, lämmittelyt, kuvamapping, Historia- ja Kehitys-tietomallit sekä navigaatioarkkitehtuuri säilyvät. F03–F06 kuuluvat muihin vaiheisiin.

### Tiedostot ja verifiointi

- Sovellus: `src/hooks/useGymFlowData.js`, `src/hooks/useLocalStorage.js`, `src/pages/Workout.jsx`.
- Testit: `tests/sessionSave.test.mjs`.
- Dokumentaatio: `docs/GYMFLOW_CONTEXT.md`, `docs/GYMFLOW_DEVELOPMENT_LOG.md`.
- `npm ci --cache /tmp/gymflow-safe2-npm-cache`, `npm run build` (Vite 8.0.13), `npm run lint` ja `git diff --check`: läpäisivät.
- `node tests/activeDraftProtection.test.mjs`: 8/8 läpäisi. `node --test tests/activeDraftProtection.test.mjs`: exit 0.
- `node --test tests/sessionSave.test.mjs`: 5/5 selainregressiota läpäisi. Paikallinen Vite, headless Chromium 156.0.8078.79 ja 390 × 844 CSS-pikselin mobiilinäkymä. Kertakäyttöisellä profiililla tarkistettiin onnistunut tallennus, kirjoitusjärjestys, tallennuskiintiö- ja käyttöestepoikkeukset, virheilmoitus ja uusinta, nopea kaksoisvahvistus, saman päivän sessiot, vanha data, virheellisen tallennuslistan säilyminen, osittainen tallennus, sivun päivitys ja Historia.
- Fyysinen Android- tai kosketuslaitetestaus jäi ajamatta. Toteutus ja Controller-itsetarkistus tehtiin samalla toimijalla.

### Rajat ja seuraava vaihe

Paikallinen tallennus voi estyä tai selain voi poistaa sen. Jos luonnoksen automaattitallennuskin epäonnistuu, edeltävät pysyvästi tallennetut tiedot jäävät selaimeen ja uusimmat muutokset voivat säilyä vain avoimen sivun muistissa. Samanaikaisten välilehtien kirjoituksia ei lukita. Seuraava vaihe on **SAFE-3**. SAFE-2:n yhdistäminen odottaa käyttäjän hyväksyntää.

## QA-BASE-1 — Verified baseline

Käyttäjän raportoima varmennettu `main`-revisio `bbf1c2d4ab0549f4a27a8de4a2315562dabbcde4`. `npm ci`, `npm run build`, `npm run lint` ja `npm run audit:images` läpäisivät. Kuva-auditoinnissa oli 0 kriittistä virhettä. SAFE-1 läpäisi 8/8, SAFE-2 5/5 ja koko regressiosarja 13/13.

## SAFE-3 — Reliable Active Draft Persistence

Päivä 2026-11-18. GitHubin `origin/main` vastasi QA-BASE-1:n SHA:ta `bbf1c2d4ab0549f4a27a8de4a2315562dabbcde4`. SAFE-1 (PR #3) ja SAFE-2 (PR #4) olivat mukana. Puhdas tehtävähaara `safe-3-reliable-active-draft` luotiin tästä revisiosta.

### Ongelma, toteutus ja tiedostot

AUDIT-001:n P1-virhe syntyi, kun käyttöliittymä näytti tallennuskuittausta React-tilan aikaleimasta ja storage-hook ohitti kirjoituspoikkeukset. Myös käsin tallennus päivitti vain aikaleiman.

- `src/hooks/useGymFlowData.js` käyttää olemassa olevaa `writeLocalStorage`-funktiota ja kuittaa onnistuneen kirjoituksen täsmälleen kirjoitetulle luonnosversiolle. Automaattitallennus käsittelee Reactin vahvistamia versioita ja peruu jonossa olevan kirjoituksen, jos versio vaihtuu tai luonnos suljetaan. Käsin tallennus yrittää kirjoittaa heti. Epäonnistuminen säilyttää muistissa olevan version ja viimeksi onnistuneen kuittauksen. Näytettävä virhe poistuu onnistuneella käsin tallennuksella tai seuraavan muokkauksen onnistuneella automaattitallennuksella. Demon nollaus yrittää edelleen tyhjentää tallennetun luonnoksen.
- `src/pages/Workout.jsx` näyttää tallentamattoman, tallennetun tai epäonnistuneen luonnoksen tilan. Tallennusvirheen voi uusia myös liikkeen tiedoista. SAFE-1:n vahvistus varoittaa tallentamattomista muutoksista. Peruutus säilyttää muistissa olevat muokkaukset ja vahvistettu vaihto hylkää ne nimenomaisesti.
- `tests/activeDraftSave.test.mjs` lisää kymmenen Chromium-regressiota, joissa tarkistetaan käyttöliittymän tila ja selaimeen tallennettu data. Kirjoitusvirheet ja jonossa olevat automaattitallennukset ohjataan deterministisesti.
- `docs/GYMFLOW_CONTEXT.md` ja `docs/GYMFLOW_DEVELOPMENT_LOG.md` kirjaavat lähtötilan, tallennussopimuksen, testitulokset ja rajat.

SAFE-2 kirjoittaa edelleen session synkronisesti ennen luonnoksen tyhjennystä. Luonnoksen jonossa oleva kirjoitus perutaan session tallentamisen jälkeen ennen tyhjennysyritystä. Tyhjennyksen uusinta, deterministinen sessiotunniste ja kaksoistallennuksen esto säilyvät. Tallennusavaimet ja datamallit säilyvät, myös vanhat luonnokset ilman valinnaisia kenttiä.

### Tarkistukset ja tulokset

| Komento | Tulos | Havainto |
| --- | --- | --- |
| `npm ci --cache /tmp/gymflow-safe3-npm-cache` | PASS | 181 pakettia lukitustiedostosta. |
| `npm run build` | PASS | Vite 8.0.13. |
| `npm run lint` | PASS | 0 virhettä, 0 varoitusta. |
| `npm run audit:images` | PASS | 0 kriittistä virhettä, 55 varoitusta. |
| `node tests/activeDraftProtection.test.mjs` | PASS | SAFE-1, 8/8. |
| `node tests/sessionSave.test.mjs` | PASS | SAFE-2, 5/5. |
| `node tests/activeDraftSave.test.mjs` | PASS | SAFE-3, 10/10. |
| `node --test tests/*.test.mjs` | PASS | 23/23 tapausta. Node raportoi 25/25, kun kaksi testien ryhmätason merkintää lasketaan mukaan. |
| `git diff --check` | PASS | Sallittujen tiedostojen diffissä ei whitespace-virheitä. |

Selainajot käyttivät headless Chromiumia 156.0.8078.79, paikallista Vite-palvelinta, 390 × 844 CSS-pikselin näkymää ja kertakäyttöisiä profiileja. Sandbox esti paikallisen kuunteluportin ensimmäisellä ajolla. Ajo onnistui hyväksytyllä localhost-käytöllä. Fyysistä Android- tai PWA-offline-testausta ei tehty.

### Rajat ja seuraava vaihe

Pysyvä kirjoitusesto jättää uusimmat muokkaukset avoimen sivun muistiin. Uudelleenlataus palauttaa viimeksi tallennetun version. Eri välilehtien kirjoituksia ei synkronoida ja selain voi poistaa paikallisen datan. Toteuttaja teki myös Controller-tarkistuksen. Käyttäjän hyväksyntä odottaa. Seuraava suositeltu vaihe on **SAFE-4A — Reset and Corrupted Data Protection**.
