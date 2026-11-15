# GymFlow — Agent-assisted Development Workflow

Päivä: 2026-11-15 / OP-001. Lähtöbaseline: OP-000, `fbf4dfa`.

## Tarkoitus ja tila

Käyttäjä ja ChatGPT suunnittelevat, Codex toteuttaa ja Controller-roolin mukainen tarkistus arvioi työn ennen käyttäjän hyväksyntää. Tämä dokumentti ja juuren [AGENTS.md](../AGENTS.md) määrittävät kehitystyönkulun. Tekninen master on [GYMFLOW_CONTEXT.md](GYMFLOW_CONTEXT.md); evidenssi kirjataan [kehityslokiin](GYMFLOW_DEVELOPMENT_LOG.md) ja menetelmän arviointi [opinnäytetyömuistiinpanoihin](GYMFLOW_THESIS_NOTES.md).

Kuusi roolia ovat aluksi **loogisia vastuualueita**, eivät kuusi itsenäisesti toimivaa agenttia. Sama toimija voi hoitaa niitä peräkkäin; raportoi todellinen toteutustapa. OP-001 ei rakenna automaattista orkestrointia, uusia työkaluja tai ohjelmakoodia. Controller-arvio samalta toteuttajalta on itsearviointia, ei riippumaton tarkastus.

## Kuusi roolia ja luovutukset

| Rooli | Vastuu | Luovutettava aineisto |
| --- | --- | --- |
| Product / UX Agent | Vaatimukset, käyttäjäpolut ja mobiilikäytettävyys. | Tavoite, rajatut käyttäjätilanteet, hyväksymiskriteerit ja avoimet UX-kysymykset. |
| Architecture Agent | Tietomalli, yhteensopivuus, tekniset rajaukset ja riskit. | Domain- ja datarajat, regressioriskit sekä erillistä hyväksyntää edellyttävät päätökset. |
| Implementation Agent | Hyväksytyn scopen mukaiset koodimuutokset; dokumentaatiovaiheessa vain sallitut dokumentit. | Rajattu diff, muuttuneet tiedostot, päätökset ja poikkeamat QA:lle. |
| QA / Test Agent | Soveltuvien testien suoritus, regressioriskit ja testiraportointi. | Todelliset komennot ja tulokset, varoitukset, tekemättä jääneet testit syineen ja manuaalisen QA:n tila. |
| Documentation Agent | Master-konteksti, kehitysloki ja opinnäytetyön dokumentaatio. | Päivitetty nykytila, historia, päätösperustelut ja evidenssin rajat. |
| Controller Agent | Scopen, raporttien, testitulosten, domain-sääntöjen ja dokumentaation tarkistus; hyväksyntää vaativien poikkeamien tunnistus. | Perusteltu arvio, löydökset, korjaustarpeet, riskit ja käyttäjän päätettävät asiat. |

OP-000:n Planner/Implementer/QA/Reviewer/Controller/Documentation-suunnitelma säilyy historiana. OP-001 täsmentää sen yllä olevaksi jaoksi: suunnittelu jakautuu Product / UX- ja Architecture-vastuisiin, ja review sisältyy Architecture-, QA- ja Controller-tarkistuksiin.

## Työnkulku ja hyväksyntäportit

1. Käyttäjä ja ChatGPT määrittelevät tehtävän Product / UX- ja Architecture-näkökulmista.
2. Scope, sallitut tiedostot, rajaukset ja hyväksymiskriteerit sovitaan. Kirjataan tietomalli- ja yhteensopivuusriskit.
3. Käyttäjä hyväksyy toteutuksen. Jo annettu tehtäväkohtainen toteutuslupa riittää sovittuun scopeen.
4. Codex tarkistaa repositoryn, haaran, työpuun ja ohjeet sekä tekee muutokset eristetyssä työympäristössä / tehtävähaarassa. Olemassa olevat muutokset säilytetään.
5. Codex suorittaa soveltuvat testit AGENTS.md:n mukaan ja Documentation-vastuu päivittää dokumentit todellisten tulosten perusteella.
6. Controller-roolin mukainen tarkistus arvioi diffin, scopen, testit, riskit ja dokumentaation ennen käyttäjälle luovutusta.
7. Käyttäjä tarkistaa tuloksen ja päättää hyväksynnästä tai korjaustarpeesta.
8. Muutokset yhdistetään vasta käyttäjän hyväksynnän jälkeen. Hyväksyntä tai julkaisu ei synny automaattisesti Controllerin arviosta.

Jos testi epäonnistuu, muutos ylittää scopen tai tietojen yhteensopivuus vaarantuu, työ palautetaan korjattavaksi. Scopen, arkkitehtuurin tai datamallin laajennus vaatii käyttäjän päätöksen ennen toteutusta. Tunnettua epäonnistumista ei ohiteta merkitsemällä vaihe valmiiksi.

## Controllerin tarkistus ja rajat

Tarkista hyväksytty tehtävä vastaan todellinen diff ja kaikki uudet tiedostot; varmista sallitut tiedostot, säilynyt historia, domain-säännöt ja vanhan datan yhteensopivuus. Tarkista testien todelliset tulokset, tekemättä jääneiden testien perustelut, dokumenttien ajantasaisuus sekä suunnitellun ja toteutetun ero. Kirjaa löydökset ja jäljelle jäävät riskit.

- `APPROVE`: tarkistettu tulos täyttää tehtävän kriteerit ja voidaan luovuttaa käyttäjälle.
- `FIX REQUIRED`: korjattavia puutteita; uusi tarkistus korjausten jälkeen.
- `REJECT`: tulos ei vastaa hyväksyttyä tehtävää tai vaatii uuden rajauksen.

Controller ei saa ohittaa käyttäjän päätösvaltaa, hyväksyä itse laajennettua scopea, muuttaa arkkitehtuuria/datamallia ilman lupaa tai yhdistää/julkaista muutoksia oman arvionsa perusteella. `APPROVE` tarkoittaa tarkistussuositusta, ei käyttäjän hyväksyntää. Arvio ei itsessään todista testien suoritusta.

Luovutusraportti sisältää stepin ja lähtörevision, toteutustilan, muuttuneet tiedostot, päätökset, ajetut testit tuloksineen, ajamatta jätetyt tarkistukset, Controllerin perustelut, riskit, avoimet kysymykset, käyttäjän päätöksen tilan ja seuraavan suosituksen. Älä kirjaa odottavaa käyttäjän päätöstä hyväksytyksi.

## Puhelinohjattu kehitys — suunniteltu, ei kokonaisuutena validoitu

Tavoite: ChatGPT mobiilissa → Codex Cloud → GitHub-muutokset / PR → tarkistus → käyttäjän hyväksyntä. Puhelimella ohjaamisen toimivuutta, käytettävyyttä tai koko ketjun onnistumista ei ole vielä osoitettu.

| Testi | Tavoite ja myöhemmin kerättävä evidenssi | Tila |
| --- | --- | --- |
| MOBILE-0 | Cloud-yhteyden ja ohjeiden lukemisen smoke test: varmista oikea repo/haara, AGENTS.md ja master-kontekstin lukeminen; kirjaa laite, toteutuneet toimet, havaittu tulos ja mahdolliset esteet. | Ei suoritettu. |
| MOBILE-1 | Ensimmäinen puhelimella ohjattu pieni kehitystehtävä: erikseen hyväksytty scope, diff / PR, soveltuvat testit, Controller-tarkistus ja käyttäjän päätös; kirjaa koko ketjun havainnot. | Ei suoritettu; erillinen hyväksyttävä tehtävä MOBILE-0:n jälkeen. |

OP-001:n dokumenttien laatiminen Cloudissa ei yksin ole MOBILE-0:n tai MOBILE-1:n läpäisy. Näitä testejä ei aloiteta tässä vaiheessa.

## Roadmap

1. OP-000 — Thesis baseline consolidation — valmis, `main`-commit `fbf4dfa`.
2. OP-001 — Agent-assisted development baseline — tämän dokumentaatiovaiheen toteutus; käyttäjän hyväksyntä erikseen.
3. TS-0…TS-4 — hallittu TypeScript-migraatio.
4. OP-002 — Garmin/Python POC.
5. ARCH-1 — tuotantoarkkitehtuuri.
6. AUTH-x — kirjautuminen ja käyttäjäkohtainen data.
7. GARMIN-x — varsinainen GymFlow Garmin -integraatio.

MOBILE-0 ja MOBILE-1 ovat OP-001:n jälkeisiä työnkulun validointitestejä. Ne eivät muuta varsinaisen tuotearkkitehtuurin hyväksyttyä etenemisjärjestystä. OP-001 ei aloita migraatiota, Garmin-integraatiota, autentikointia tai backend-kehitystä.

## Opinnäytetyön menetelmä ja evidenssi

Agenttiavusteinen kehitys kuvataan case-projektin kehitysmenetelmänä: tehtävän rajaus, loogiset vastuut, toteutus, testaus, Controller-tarkistus ja ihmisen päätös muodostavat dokumentoitavan ketjun.

Erota suunniteltu toimintamalli, toteutettu tekninen ratkaisu, käytännössä testattu toiminta ja havaitut tulokset. OP-001:n toteutettu ratkaisu on dokumentoitu prosessi ja pysyvät ohjeet; agenttien orkestrointia ei toteuteta. Käytännössä tarkistetaan dokumenttidiff ja hyväksymiskriteerit. Tämä ei osoita puhelinohjauksen toimivuutta, tuottavuushyötyä tai regressioiden vähenemistä.

Kerää myöhemmistä kokeista tehtäväkohtainen scope, diff / PR, testiraportti, Controllerin löydökset, korjauskierrokset, ihmisen interventiot ja päätös. Mittarit edellyttävät ennalta sovittua mittaustapaa ja todellista aineistoa. Älä keksi testituloksia, mittareita tai tutkimushavaintoja.
