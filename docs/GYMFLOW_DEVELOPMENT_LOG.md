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
