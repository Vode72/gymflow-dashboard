# GymFlow — Opinnäytetyömuistiinpanot

Päivitetty 2026-11-15 / OP-000. Tämä on aineistonkeruun baseline, ei valmis opinnäytetyö eikä raportti suoritetusta käyttäjätutkimuksesta.

Viitteet: [tekninen master-konteksti](GYMFLOW_CONTEXT.md), [kronologinen kehitysloki](GYMFLOW_DEVELOPMENT_LOG.md).

## Alkuperäinen aihe ja case

GymFlow Dashboard toimii opinnäytetyön case-projektina.

Alkuperäinen työotsikko / aihe:
**Mobile-first Progressive Web Application -harjoittelusovelluksen suunnittelu, toteutus ja arviointi – Case GymFlow Dashboard**

Käytännön lähtökohta on nopea puhelinkäyttö salilla: mitä treenataan tänään, mitä tehtiin viimeksi ja tapahtuuko kehitystä. Premium minimal -dashboardin ja reps-first-kirjauksen tulee tukea treeniä ilman raskasta lomaketyöskentelyä.

## Alkuperäinen runko ja kerättävä aineisto

| Luku | Kerättävä aineisto |
| --- | --- |
| 1. Johdanto | Tausta, ongelma, tavoite, rajaus ja case-projektin lähtötilanne. |
| 2. Mobile-first | Salikäytön tarpeet, kosketuskohteet, navigaatio, safe-area ja layout-päätökset. |
| 3. Progressive Web Application | Manifest ja paikallinen tallennus; toteutettu PWA-valmius erotetaan myöhemmin todennettavista offline-/asennusominaisuuksista. |
| 4. Käyttäjävaatimukset | Nopea kirjaus, aiemmat tulokset, kehityksen seuranta ja tulevan käyttäjätestauksen vaatimukset. |
| 5. Sovelluksen suunnittelu | Näkymät, visuaalinen järjestelmä, WorkoutSession ja geneerinen workoutDays-malli. |
| 6. Toteutus | React/Vite/JavaScript/CSS/localStorage-baseline ja tulevat erikseen dokumentoidut muutokset. |
| 7. Testaus ja käytettävyyden arviointi | Todelliset build/lint/audit-tulokset, selain/mobile-QA ja myöhemmin suunniteltava käyttäjätestaus. |
| 8. Tulokset | Vain havaintoihin ja kerättyyn evidenssiin perustuvat tulokset; ei vielä päätelmiä tulevista vaiheista. |
| 9. Johtopäätökset | Vasta aineiston jälkeen: tavoitteiden saavuttaminen ja menetelmien rajoitteet. |
| 10. Jatkokehitys | Agenttimalli, TypeScript, Garmin, auth, cloud sync ja tuotantoarkkitehtuurin päätökset. |

Runkoa voi myöhemmin tarkentaa oppilaitoksen ohjeiden ja ohjaajan kanssa. OP-000 ei lukitse tutkimusmenetelmää tai muuta aihetta lopullisesti.

## Uusi kehityssuunta tutkimuksellisena aineistona

OP-001 suunnittelee Planner-, Implementer-, QA-, Reviewer-, Controller- ja Documentation-roolit. Controller tarkistaa scopea, tiedostomuutoksia, testituloksia, domain-sääntöjä ja dokumentointia sekä raportoi Toni/ChatGPT-ohjaukselle. Sen arviot APPROVE / FIX REQUIRED / REJECT eivät korvaa ihmisen lopullista hyväksyntää ja julkaisupäätöstä.

Puhelimella tapahtuva käynnistys, ohjaus, seuranta, tarkistus ja hyväksyntä/hylkäys on tavoite. Human-in-the-loop säilyy. OP-000 ei todista agenttimallin tai puhelinohjauksen toimivuutta.

Mahdollisia myöhemmin täsmennettäviä tutkimuskysymyksiä:
- Miten mobile-first-ratkaisut tukevat nopeaa harjoittelun kirjaamista?
- Miten roolipohjainen agenttityö ja Controller vaikuttavat scopen hallintaan, regressioiden havaitsemiseen ja dokumentoinnin kattavuuteen?
- Mitkä kehityksen ohjaus- ja hyväksyntätehtävät onnistuvat puhelimella, ja missä tarvitaan muita työvälineitä?
- Miten asteittainen TypeScript-migraatio säilyttää nykyisen käyttäytymisen ja auttaa kuvaamaan domain-mallia?
- Mitä erillinen Garmin-POC kertoo integraation teknisestä toteutettavuudesta?

## Tulevien vaiheiden aineistosuunnitelma

| Vaihe | Suunniteltu evidenssi |
| --- | --- |
| OP-001 | Hyväksytty scope, roolivastuut, handoffit, Controllerin löydökset ja ihmisen päätökset. |
| TS-0–TS-4 | Infrastruktuuri, domain-tyypit, utility/data-kerros, komponentit ja strictness; vaihekohtaiset diff- ja regressiotulokset ilman ominaisuusmuutoksia. |
| OP-002 | UI:sta erillisen Garmin Personal API / Python -POC:n kysymykset, ympäristö, toistetut kokeet, tulokset ja rajoitteet; ei salaisuuksia. |
| ARCH-1 | Auth, testikäyttäjät, käyttäjäkohtainen data, Supabase/PostgreSQL-ehdokas, RLS, offline-first, paikallinen tallennus, cloud sync ja integraatiorajapinta perusteluineen. |
| Käyttäjätestaus | Erillinen suunnitelma, testitehtävät, laite/selain ja anonymisoidut havainnot; omat tunnukset ja toisilta eristetty data tavoitevaatimuksina. |

Garminin henkilökohtainen POC ja mahdollinen virallinen monikäyttäjäinen business/developer-integraatio ovat eri suunnittelutilanteita. Saatavuus ja käyttöehdot selvitetään toteutusvaiheessa. React UI:n ja Garmin-toteutuksen välinen integraatiokerros on tuleva arkkitehtuuriperiaate.

## Systemaattinen keruutapa

Jokaisesta stepistä kirjataan päivämäärä, tunniste, lähtötilanne, tavoite, hyväksytty scope, muuttuneet tiedostot, päätösten perustelut, todelliset testitulokset, poikkeamat ja seuraava vaihe kehityslokiin. Master-konteksti päivitetään vastaamaan toteutunutta tilaa. Tänne kerätään stepin merkitys tutkimuskysymyksille sekä linkit lokimerkintään ja myöhemmin syntyviin artefakteihin.

Tallenna agenttityön arviointia varten esimerkiksi havaitut scope-poikkeamat, regressiot, korjauskierrokset, puuttuva dokumentointi, ihmisen interventiot sekä puhelimella onnistuneet ja epäonnistuneet tehtävät. Aika- tai tehokkuusväitteet edellyttävät sovittua mittaustapaa ja todellisia mittauksia. Mahdollinen vertailu aiempaan kehitykseen ei itsessään osoita syy-seuraussuhdetta.

Käyttäjätestaus suunnitellaan erikseen: suostumus, tarvittavan tiedon minimointi, anonymisointi ja säilytyskäytäntö. Repositoryyn ei tallenneta API-avaimia, tokeneita, tunnuksia tai tunnistettavia testaajien harjoittelutietoja.

## OP-000-havainnot ja luotettavuusrajat

- Nykyinen sovellus on JavaScript-pohjainen paikallinen MVP; auth, backend ja cloud sync puuttuvat.
- Historiallinen konteksti raportoi build/lint/audit-läpäisyjä; OP-000 ei ajanut niitä uudelleen.
- Browser/mobile-QA:ta tai käyttäjätestausta ei tehty tässä vaiheessa. Screenshotit eivät todista käytettävyystutkimusta.
- DUR-1B:n nykyinen liikekesto 1 min / 5–30 min eroaa uuden tehtävänannon tavoitteesta 5 min / 5–60 min. Ero kirjattiin, toimintaa ei muutettu.
- localStorage-kirjoitusvirheiden ja draftin tyhjentämisen suhde vaatii myöhemmän tarkistuksen; pysyvän tallennuksen takuuta ei ole osoitettu.
- Dokumentaatio ja git-historia ovat osin jälkikäteistä aineistoa. Alkuvaiheiden tarkkoja päivämääriä ja mittauksia ei keksitä.
- Liitetty tehtävänanto päättyy kesken dokumenttivastuiden kuvauksen. Puuttuvaa loppuosaa ei esitetä tunnettuna vaatimuksena.

Seuraava aineistonkeruun vaihe on OP-001:n prosessin suunnittelu ja arviointikriteerien sopiminen ennen agenttimallin toteuttamista.
