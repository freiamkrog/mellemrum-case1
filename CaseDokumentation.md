# Case 1 – Teknisk audit og optimering

## 1. Projekt

**Mellemrum** er en React-prototype for en lokal kultur- og eventplatform i Aarhus.

Den primære målgruppe er personer, der ønsker en enkel vej til at opdage og tilmelde sig lokale kulturoplevelser i Aarhus. Arrangører er en sekundær målgruppe, som bruger platformen til at dele events og få overblik over tilmeldinger.

Projektet blev gennemgået med fokus på teknisk kvalitet, brugeroplevelse, accessibility, datahåndtering, performance, deployment og mulighed for videreudvikling.

---

## 2. Links

- **GitHub repository:** https://github.com/freiamkrog/mellemrum-case1
- **Deployet løsning:** https://freiamkrog.github.io/mellemrum-case1/

---

## 3. Teknisk audit og prioritering

Der blev gennemført en teknisk audit af projektet, hvor problemer og forbedringsmuligheder blev vurderet ud fra konsekvens og prioritet.

De vigtigste områder var:

- datahåndtering og Supabase
- robust fejlhåndtering og UI-states
- React-arkitektur og kodekvalitet
- UI-konsistens og accessibility
- performance
- deployment og projektstruktur

Auditten blev løbende opdateret under arbejdet. Et tidligere punkt om client-side filtrering blev vurderet som passende til den nuværende datamængde og blev derfor erstattet af et mere relevant accessibility-problem om kontrast.

---

## 4. Gennemførte forbedringer

### 4.1 Datamodel og Supabase-relationer

**Problem**

Den oprindelige datahåndtering havde behov for tydeligere relationer mellem venues, events og registrations.

**Konsekvens**

Data kunne blive sværere at vedligeholde og mere sårbar over for inkonsistente oplysninger.

**Løsning**

Datamodellen blev struktureret med separate tabeller for:

- `venues`
- `events`
- `registrations`

Relationerne blev etableret med foreign keys:

- `events.venue_id` peger på `venues.id`
- `registrations.event_id` peger på `events.id`

Events henter venue-information via relationen, og registrations henter det tilhørende event.

Der blev desuden tilføjet `capacity` til events, så antal pladser kan håndteres som en del af eventdata.

**Verifikation**

Events blev hentet korrekt med venue-information, og eventdetaljer viste de tilhørende venue-oplysninger. Tilmeldinger blev ligeledes koblet korrekt til deres events.

**Værdi**

En normaliseret datamodel gør løsningen lettere at vedligeholde og videreudvikle. Ændringer i venue-information behøver ikke gentages på hvert event.

---

### 4.2 Genbrugelige React-komponenter og service-lag

**Problem**

API-kald og gentagen UI-logik var tidligere placeret direkte i siderne, og flere UI-elementer kunne genbruges på tværs af projektet.

**Konsekvens**

Det gjorde koden sværere at vedligeholde og øgede risikoen for forskellig implementering af samme funktion.

**Løsning**

Der blev oprettet genbrugelige komponenter som blandt andet:

- `Navbar`
- `Footer`
- `EventCard`
- `LoadingState`
- `ErrorState`
- `EmptyState`

Supabase-kald blev samlet i `src/services/supabaseClient.js`.

**Verifikation**

Komponenterne bruges på tværs af relevante sider, og datahentning sker gennem service-funktionerne.

**Værdi**

En mere komponentbaseret struktur gør projektet lettere at videreudvikle og reducerer gentagelse i koden.

---

### 4.3 Loading-, error- og empty-states

**Problem**

Brugeren havde ikke altid tydelig feedback om, hvad der skete under datahentning eller ved fejl.

**Konsekvens**

Det kunne være uklart, om siden arbejdede, om der var en fejl, eller om der bare ikke fandtes data.

**Løsning**

Der blev implementeret genbrugelige states for:

- loading
- fejl
- tomme resultater

De bruges blandt andet på eventoversigten, eventdetaljen og tilmeldingsoversigten.

**Verifikation**

States blev testet ved datahentning og i relevante fejl-/tomdata-scenarier.

**Værdi**

Tydelig feedback gør løsningen mere forståelig og mindsker usikkerhed for brugeren.

---

### 4.4 Formularfeedback og accessibility

**Problem**

Tilmeldingsformularen havde behov for tydeligere feedback ved fejl og bedre information til hjælpemidler.

**Konsekvens**

En bruger kunne have svært ved at forstå, hvad der var galt med en tilmelding.

**Løsning**

Der blev blandt andet tilføjet:

- tydelige fejlbeskeder
- `role="alert"` til fejl
- `aria-invalid` på det relevante felt
- `aria-describedby` til fejlbeskeden
- nulstilling af fejlstatus, når brugeren retter feltet
- eksisterende browser-validering via `required` blev bevaret

**Verifikation**

En allerede registreret e-mail blev testet. Det relevante input fik `aria-invalid="true"` og `aria-describedby="email-error"`. Da en ny e-mail blev indtastet, blev fejltilstanden fjernet.

**Værdi**

Brugeren får hurtigere forståelse af problemet, og formularen bliver mere tilgængelig.

---

### 4.5 Keyboard navigation og focus

**Problem**

Interaktive elementer havde ikke et ensartet og tydeligt focus-feedback.

**Konsekvens**

Keyboard-brugere kunne have svært ved at se, hvilket element der var aktivt.

**Løsning**

Der blev indført en fælles focus-farve og tydelig `:focus-visible` styling for links, inputs, selects og submit-knappen.

**Verifikation**

Siderne blev gennemgået med Tab-navigation. Interaktive elementer fik synligt focus-feedback. Tilmeldingssiden har ingen interaktive elementer i selve hovedindholdet ud over navigation/footer, hvilket derfor ikke kræver ekstra focus-stops.

**Værdi**

Forbedrer keyboard-navigation og gør løsningen lettere at bruge for flere brugere.

---

### 4.6 Kontrast

**Problem**

Auditten viste lav kontrast på blandt andet teksten "Målgrupper" og statuslabels som "Få pladser" og "Udsolgt".

**Konsekvens**

Teksten kunne være sværere at læse, især for brugere med nedsat syn.

**Løsning**

Farverne blev justeret, så teksten har bedre kontrast mod de respektive baggrunde.

**Verifikation**

Kontrasten blev kontrolleret med browserens accessibility-værktøjer. De tidligere målinger var blandt andet 1.66 for "Målgrupper" og "Få pladser" samt 1.88 for "Udsolgt". Farverne blev efterfølgende ændret til mere kontraststærke værdier.

Lighthouse accessibility-score blev målt til 100 på de gennemførte tests.

**Værdi**

Bedre kontrast gør informationen lettere at aflæse og understøtter en bredere brugergruppe.

---

### 4.7 Dansk HTML-sprog

**Problem**

HTML-dokumentet havde `lang="en"` selvom indholdet er dansk.

**Konsekvens**

Browsere og hjælpemidler kunne fortolke sproget forkert.

**Løsning**

`index.html` blev ændret til:

```html
<html lang="da">
```

**Verifikation**

HTML-attributten blev kontrolleret i DevTools, og Lighthouse accessibility-testen viste 100.

**Værdi**

Forbedrer semantisk korrekthed og understøtter hjælpemidler som skærmlæsere.

---

### 4.8 Eventkapacitet og tilmeldingsstatus

**Problem**

Eventoversigten viste ikke, hvor mange der allerede var tilmeldt, eller hvor mange pladser der var tilbage.

**Konsekvens**

Brugeren manglede information om eventets tilgængelighed og popularitet.

**Løsning**

Der blev tilføjet `capacity` til events. Løsningen viser nu antal tilmeldte i forhold til kapacitet, fx:

`2 / 15 tilmeldte`

Derudover vises status:

- `God plads`
- `Få pladser`
- `Udsolgt`

Status ændres automatisk ud fra antallet af resterende pladser.

**Verifikation**

Et event med 15 pladser blev testet med 14 tilmeldte. Efter en ny tilmelding ændrede visningen sig fra:

`14 / 15`

til:

`15 / 15`

og status ændrede sig til:

`Udsolgt`

uden reload.

**Værdi**

Brugeren får et bedre grundlag for at beslutte, om et event stadig er relevant at tilmelde sig til. Det kan understøtte flere gennemførte tilmeldinger og give et mere informativt event-overblik.

---

### 4.9 Billedoptimering

**Problem**

Billeder kan fylde meget og påvirke loading og performance.

**Konsekvens**

Store billeder kan give længere loadtid og større dataforbrug.

**Løsning**

Eventbilleder blev optimeret med passende billedstørrelser og kvalitet. Hero-billeder blev ændret fra CSS-backgrounds til almindelige `<img>`-elementer, så browseren kan prioritere dem bedre.

Hero-billederne bruger blandt andet:

```jsx
fetchPriority="high"
loading="eager"
```

Eventkortenes billeder bruger:

```jsx
loading="lazy"
```

**Verifikation**

Attributterne blev kontrolleret i DevTools. Lighthouse på den deployede About-side målte en performance-score på 99 i den gennemførte test.

**Værdi**

Mindre unødvendig billeddata og bedre prioritering af vigtige billeder kan give hurtigere oplevet loading.

---

### 4.10 Favicon og projektspecifik metadata

**Problem**

Projektet brugte en template-favicon.

**Konsekvens**

Løsningen fremstod mindre færdig og mindre tydeligt som Mellemrum.

**Løsning**

Template-faviconet blev erstattet med Mellemrum-logoets mark:

```html
<link rel="icon" type="image/svg+xml" href="/mellemrum-mark.svg" />
```

**Verifikation**

Faviconet blev kontrolleret visuelt efter deployment.

**Værdi**

Giver en mere sammenhængende og færdig produktoplevelse.

---

### 4.11 Tilmeldinger grupperet efter event-ID

**Problem**

Tilmeldinger blev tidligere grupperet efter eventets titel.

**Konsekvens**

Hvis to events havde samme titel, kunne de blive behandlet som den samme gruppe.

**Løsning**

Tilmeldinger grupperes nu efter eventets unikke ID, mens titlen kun bruges til visning.

**Verifikation**

Tilmeldingssiden blev testet efter ændringen, og grupperingen samt eventtitlerne blev vist korrekt.

**Værdi**

Gør koden mere robust, fordi grupperingen bygger på en stabil og entydig identifikator.

---

### 4.12 Mere målrettet datahentning

**Problem**

`getRegistrations()` hentede tidligere alle felter fra registrations og events samt en ekstra registration count.

**Konsekvens**

API-requesten indeholdt data, som siden ikke havde brug for.

**Løsning**

Requesten blev gjort mere specifik, så den kun henter de felter, som `RegistrationsPage` bruger:

- registration ID
- navn
- e-mail
- status
- oprettelsesdato
- event ID
- eventtitel
- eventdato
- eventkapacitet

Den ekstra `registrations(count)` blev fjernet fra denne request, fordi antallet allerede beregnes ud fra de hentede registrations.

**Verifikation**

`/tilmeldinger` blev testet efter ændringen og fungerer fortsat korrekt.

**Værdi**

Giver en mere præcis API-request og en renere datahåndtering, samtidig med at løsningen bliver lettere at forstå.

---

### 4.13 README og projektstruktur

**Problem**

Projektet havde template-præget dokumentation og elementer, der ikke længere var nødvendige.

**Konsekvens**

Det kunne være sværere for en anden udvikler at forstå projektet og komme i gang.

**Løsning**

README'en blev skrevet om med:

- projektbeskrivelse
- målgruppe
- funktioner
- teknologier
- opsætning
- ruter
- deployment

Der blev også ryddet op i tydeligt overflødige projektfiler.

**Verifikation**

README'en beskriver den aktuelle løsning og dens centrale funktioner.

**Værdi**

Gør projektet lettere at overtage, forstå og videreudvikle.

---

## 5. Datamodel

Den endelige datamodel kan beskrives sådan:

```text
venues
   │
   │ 1:N
   ▼
events
   │
   │ 1:N
   ▼
registrations
```

### `venues`

Indeholder oplysninger om stedet, eksempelvis:

- navn
- adresse
- postnummer
- by
- website

### `events`

Indeholder oplysninger om det enkelte event, eksempelvis:

- titel
- beskrivelse
- kategori
- dato
- billede
- venue reference
- kapacitet

`venue_id` fungerer som foreign key til `venues.id`.

### `registrations`

Indeholder oplysninger om en tilmelding, eksempelvis:

- ID
- navn
- e-mail
- status
- event reference
- oprettelsesdato

`event_id` fungerer som foreign key til `events.id`.

Denne struktur betyder, at venue-information og event-information ikke behøver at blive duplikeret på tværs af tabeller.

---

## 6. Før- og efterevidens

Udvalgte forbedringer blev verificeret gennem både funktionelle tests, DevTools og Lighthouse.

### Accessibility

**Før**

- Lav kontrast blev identificeret i auditten.
- Interaktive elementer havde ikke ensartet focus-feedback.
- HTML-sproget var sat til `en`.

**Efter**

- Kontrastfarver blev justeret.
- Keyboard focus blev gjort tydeligt.
- HTML bruger `lang="da"`.
- Lighthouse accessibility-score blev målt til **100**.

### Eventkapacitet

**Før**

Eventet viste ikke antal tilmeldte i forhold til kapacitet.

**Efter**

Eksempel:

```text
14 / 15 tilmeldte · Få pladser
```

Efter en ny tilmelding:

```text
15 / 15 tilmeldte · Udsolgt
```

Ændringen sker uden reload.

### Performance

**Før**

Billeder og hero-sektioner blev gennemgået med fokus på loading og billeddata.

**Efter**

- lazy loading på eventbilleder
- eager/high priority på hero-billeder
- optimerede Unsplash-parametre
- hero-billeder som `<img>`

Den deployede About-side opnåede **99 Performance** i den gennemførte Lighthouse-test.

### Formular

**Efter**

Fejl ved eksisterende e-mail blev koblet direkte til email-feltet med `aria-invalid` og `aria-describedby`.

---

## 7. Git branches og historik

Arbejdet blev opdelt i branches, så ændringerne kunne holdes adskilt og testes løbende.

Eksempler på branches:

| Branch | Formål |
|---|---|
| `fix/ui-consistency` | UI-konsistens |
| `fix/registration-feedback` | Feedback ved tilmelding |
| `fix/accessibility` | Accessibility-forbedringer |
| `chore/project-cleanup` | Oprydning |
| `fix/navigation` | Navigation |
| `feat/event-capacity` | Eventkapacitet |
| `feature/react-code-quality` | React-kodekvalitet |
| `fix/html-language` | Dansk HTML-sprog |
| `fix/favicon` | Favicon |
| `fix/image-performance` | Billedoptimering |
| `fix/image-performance2` | Optimering af About-hero |
| `fix/contrast-colors` | Kontrast |
| `fix/keyboard-focus` | Keyboard focus |
| `fix/form-accessibility` | Formular-accessibility |
| `docs/update-readme` | README |
| `fix/general-corrections` | Samlede mindre kodeforbedringer |

Branches blev brugt til at holde ændringerne isolerede og gøre commit- og merge-historikken mere forståelig.

Eksempel på et forståeligt commit:

`style: enhance focus styles for inputs and buttons`

---

## 8. Valg og fravalg

Et vigtigt princip i arbejdet var, at der ikke skulle ændres kode uden en konkret begrundelse.

### Client-side filtrering

Søgning og filtrering blev vurderet i forhold til datamængden. Projektet arbejder aktuelt med et begrænset antal events, så filtrering i React blev vurderet som en passende løsning.

Derfor blev filtreringen ikke flyttet til Supabase.

### Billedkvalitet

Billeder blev optimeret, men kvaliteten blev ikke reduceret unødigt. Et forsøg med en mindre billedbredde gav et visuelt dårligere resultat, så billederne blev beholdt i en størrelse, der gav en bedre balance mellem kvalitet og performance.

### Flere Lighthouse-optimeringer

Der blev ikke lavet ændringer alene for at få en højere Lighthouse-score. Fokus var på konkrete tekniske eller brugerrelaterede problemer, hvor en ændring havde en reel begrundelse.

---

## 9. Resterende udfordringer

Projektet er fortsat en prototype og har derfor nogle naturlige begrænsninger.

- Tilmeldingskapacitet håndteres i UI'et, men der er ikke implementeret server-side kapacitetskontrol mod samtidige tilmeldinger.
- GitHub Pages er en statisk hostingløsning, og SPA-routing kræver den særlige fallback-håndtering i deployment-workflowet.
- Supabase-tabellerne har i den nuværende løsning ikke et fuldt produktionsniveau af adgangskontrol/RLS.
- Der er ikke implementeret et egentligt administrationssystem til at håndtere events og tilmeldinger.
- Mellemrum er stadig en prototype og mangler funktioner, som ville være relevante i en fuld produktløsning.

---

## 10. Forretningspotentiale

De tekniske forbedringer kan også skabe produktmæssig værdi for Mellemrum.

### Flere gennemførte tilmeldinger

Tydelig information om kapacitet og status gør det lettere for brugeren at vurdere, om der stadig er plads på et event.

### Færre fejl

Tydelig formularfeedback gør det lettere at rette fejl og forstå, hvorfor en tilmelding ikke kan gennemføres.

### Bredere brugergruppe

Forbedret keyboard-navigation, kontrast og semantisk HTML gør løsningen mere tilgængelig for brugere med forskellige behov.

### Bedre brugeroplevelse

Loading-, error- og empty-states reducerer usikkerhed og gør systemets tilstand tydelig.

### Lettere videreudvikling

En mere struktureret React-arkitektur og en normaliseret datamodel gør det lettere at tilføje nye funktioner senere.

### Hurtigere oplevelse

Billedoptimering og prioritering af hero-billeder kan reducere unødvendig data og forbedre den oplevede loading.

Samlet set handler forbedringerne derfor ikke kun om kodekvalitet. De skal gøre Mellemrum **mere brugervenlig, mere robust og lettere at videreudvikle**.

---

## 11. Samlet refleksion

Case 1 startede som en teknisk gennemgang af et eksisterende React-projekt. Arbejdet udviklede sig til en kombination af teknisk oprydning, accessibility, datahåndtering, performance og forbedringer af brugerfeedback.

En vigtig erfaring var, at ikke alle potentielle forbedringer nødvendigvis skal implementeres. Nogle løsninger giver mening i den nuværende kontekst, mens andre først bliver relevante, hvis datamængden eller produktets kompleksitet vokser.

Målet har derfor ikke været at optimere alt, men at identificere de steder, hvor en ændring kunne skabe en konkret teknisk eller produktmæssig værdi.

