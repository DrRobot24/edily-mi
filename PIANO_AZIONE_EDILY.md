# 🏗️ EDILY MILANO — Piano d'Azione Completo

> **Documento generato il:** 17 Aprile 2026  
> **Repository:** `DrRobot24/edily-mi`  
> **Deploy:** [www.edilymilano.com](https://www.edilymilano.com)  
> **Stack attuale:** Vanilla JS · Vite 8 · GSAP · Lenis · CSS Custom

---

## 📊 Analisi dello Stato Attuale

### ✅ Punti di Forza (da preservare)
| Elemento | Dettaglio |
|----------|-----------|
| **Hero con video fullscreen** | `cassia.mp4` con overlay gradient — impatto luxury immediato |
| **Animazioni GSAP + ScrollTrigger** | Reveal text, parallax immagini, scroll-triggered animations |
| **Smooth Scroll (Lenis)** | Scroll fluido di livello studio creativo (Awwwards-level) |
| **Design System coerente** | Palette brutalista/luxury: Cinzel + Montserrat + Cormorant Garamond, oro `#A68B61`, nero `#0F0F0F` |
| **Struttura semantica** | Hero → Payoff → About (Mission/Vision) → Progetti → Servizi → Contatti → Footer |
| **Performance** | `content-visibility: auto`, `lazy loading`, `decoding="async"` sulle immagini |
| **Vanilla JS** | Zero overhead framework, caricamento velocissimo, bundle leggero |
| **Responsive** | Media query `@media (max-width: 900px)` con menu hamburger |

### ❌ Problemi Identificati
- 12 interventi necessari distribuiti su 3 livelli di priorità
- Nessun problema strutturale — solo miglioramenti e fix puntuali

---

## 🔴 PRIORITÀ ALTA — Da fare SUBITO

> Questi interventi sono bloccanti o critici per il funzionamento del sito in produzione.

---

### 1. Form Contatti Non Funzionante
**File:** `index.html` (riga 189)  
**Problema:** Il form ha `onsubmit="event.preventDefault();"` — i messaggi dei clienti vanno persi.  
**Impatto:** ⛔ L'azienda non riceve nessuna richiesta di contatto.

**Soluzione consigliata — Formspree (zero backend):**
```html
<form class="luxury-form" action="https://formspree.io/f/TUO_FORM_ID" method="POST">
```

**Alternativa — EmailJS (invio client-side):**
```javascript
import emailjs from '@emailjs/browser';

document.querySelector('.luxury-form').addEventListener('submit', (e) => {
  e.preventDefault();
  emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', e.target, 'PUBLIC_KEY')
    .then(() => {
      // Mostra messaggio di successo
      alert('Richiesta inviata con successo!');
      e.target.reset();
    });
});
```

**Alternativa — Vercel Serverless Function:**
Creare `api/contact.js` per gestione server-side con nodemailer.

**Passi:**
1. Registrarsi su [formspree.io](https://formspree.io) (gratuito fino a 50 invii/mese)
2. Creare un form e copiare l'endpoint
3. Sostituire l'`onsubmit` con `action` e `method="POST"`
4. Aggiungere feedback visivo post-invio (messaggio di conferma)
5. Testare su desktop e mobile

---

### 2. Cartella `dist/` Committata nel Repository
**File:** `dist/` (intera cartella) + `.gitignore`  
**Problema:** La build è dentro il repo. Il `.gitignore` attuale (35 byte) non la esclude. Vercel ribuilida autonomamente ad ogni push, rendendo `dist/` ridondante e pesante (gonfia il repo a 27.6 MB).

**Soluzione:**
```bash
# 1. Aggiungere al .gitignore
echo "dist/" >> .gitignore
echo "node_modules/" >> .gitignore

# 2. Rimuovere dist dal tracking git (senza cancellare i file locali)
git rm -r --cached dist/

# 3. Commit e push
git add .gitignore
git commit -m "🧹 Rimossa dist/ dal repo, aggiornato .gitignore"
git push
```

**`.gitignore` consigliato:**
```
node_modules/
dist/
.DS_Store
*.local
.env
.env.*
```

---

### 3. Link Social Mancanti
**File:** `index.html` (righe 220-226)  
**Problema:** I link Instagram e LinkedIn puntano a `href="#"` — danno impressione di sito incompleto/amatoriale.

**Soluzione:**
```html
<a href="https://www.instagram.com/edilymilano/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
  <!-- SVG Instagram -->
  <span>Instagram</span>
</a>
<a href="https://www.linkedin.com/company/edilymilano/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
  <!-- SVG LinkedIn -->
  <span>LinkedIn</span>
</a>
```

**Note:**
- Inserire i veri URL dei profili social dell'azienda
- Aggiungere `target="_blank"` + `rel="noopener noreferrer"` per sicurezza
- Se i profili non esistono ancora, crearli PRIMA di pubblicare il sito

---

### 4. Meta Tags Open Graph e SEO Mancanti
**File:** `index.html` (dentro `<head>`)  
**Problema:** Mancano completamente i tag Open Graph. Quando qualcuno condivide il sito su WhatsApp, Facebook, LinkedIn — appare un link spoglio senza anteprima.

**Soluzione — Aggiungere dopo il tag `<meta name="description">`:**
```html
<!-- Open Graph / Social -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.edilymilano.com/" />
<meta property="og:title" content="Edily Milano | Luxury Construction & Real Estate" />
<meta property="og:description" content="Sviluppo Immobiliare e Costruzioni d'eccellenza. Design, eleganza e perfezione architettonica a Milano." />
<meta property="og:image" content="https://www.edilymilano.com/images/og-preview.jpg" />
<meta property="og:locale" content="it_IT" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Edily Milano | Luxury Construction & Real Estate" />
<meta name="twitter:description" content="Sviluppo Immobiliare e Costruzioni d'eccellenza a Milano." />
<meta name="twitter:image" content="https://www.edilymilano.com/images/og-preview.jpg" />

<!-- Extra SEO -->
<meta name="robots" content="index, follow" />
<meta name="author" content="Edily srls" />
<link rel="canonical" href="https://www.edilymilano.com/" />
```

**Azione aggiuntiva:**
- Creare un'immagine `og-preview.jpg` (1200×630px) con logo + tagline
- Salvarla in `/public/images/`
- Testare con [opengraph.xyz](https://www.opengraph.xyz/)

---

## 🟡 PRIORITÀ MEDIA — Da fare entro 1-2 settimane

> Miglioramenti tecnici e di UX che alzano la qualità percepita e le performance.

---

### 5. Spostare GSAP e Lenis da CDN a Bundle npm
**File:** `index.html` (righe 234-236) + `package.json`  
**Problema:** GSAP, ScrollTrigger e Lenis vengono caricati da CDN esterni (`unpkg.com`, `cloudflare`). Questo aggiunge 3 richieste HTTP extra, non permette tree-shaking, e dipende dalla disponibilità di server terzi.

**Soluzione:**
```bash
# Installare come dipendenze
npm install gsap @studio-freight/lenis
```

**Aggiornare `main.js`:**
```javascript
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// ... resto del codice invariato
```

**Rimuovere da `index.html`:**
```html
<!-- ELIMINARE queste 3 righe -->
<script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

**Benefici:** Bundle unico ottimizzato da Vite, cache migliore, zero dipendenze esterne a runtime.

---

### 6. Aggiungere Favicon e Apple Touch Icon
**File:** `index.html` (dentro `<head>`) + `/public/`  
**Problema:** Nessun favicon — il browser mostra l'icona generica. Aspetto poco professionale nelle tab e nei preferiti.

**Soluzione:**
1. Generare le favicon dal logo usando [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Inserire i file nella cartella `/public/`
3. Aggiungere nell'`<head>`:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0F0F0F" />
```

---

### 7. Consolidare il Font Cormorant Garamond
**File:** `style.css` + `index.html`  
**Problema:** Il font Cormorant Garamond è caricato nel `<link>` Google Fonts ma usato solo in uno stile inline sull'h1 hero (`style="font-family: 'Cormorant Garamond'..."`). Non è integrato nel design system CSS.

**Soluzione — Aggiungere variabile CSS:**
```css
:root {
  --font-heading: 'Cinzel', serif;
  --font-display: 'Cormorant Garamond', serif;  /* NUOVO */
  --font-body: 'Montserrat', sans-serif;
}
```

**Aggiornare l'h1 hero rimuovendo lo stile inline:**
```css
.hero-content h1 {
  font-size: clamp(4.5rem, 10vw, 9rem);
  font-family: var(--font-display);
  font-weight: 300;
  letter-spacing: 0.04em;
}
```

```html
<!-- Da -->
<h1 class="reveal-text" style="font-size: clamp(4.5rem, 10vw, 9rem); font-family: 'Cormorant Garamond'...">

<!-- A -->
<h1 class="reveal-text">
```

---

### 8. Aggiungere Preloader / Loading Animation
**Problema:** Il sito carica direttamente senza transizione. Un preloader luxury darebbe un "effetto wow" iniziale e nasconderebbe il caricamento del video hero.

**Soluzione — Aggiungere in `index.html` subito dopo `<body>`:**
```html
<div class="preloader" id="preloader">
  <div class="preloader-text">EDILY<span>MILANO</span></div>
</div>
```

**CSS:**
```css
.preloader {
  position: fixed;
  inset: 0;
  background: #0F0F0F;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}
.preloader.hidden {
  opacity: 0;
  visibility: hidden;
}
.preloader-text {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4rem);
  color: #fff;
  letter-spacing: 0.3em;
  animation: pulse 1.5s ease-in-out infinite;
}
.preloader-text span { color: var(--color-accent); }

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

**JS (in `main.js`):**
```javascript
window.addEventListener('load', () => {
  document.getElementById('preloader').classList.add('hidden');
});
```

---

## 🟢 PRIORITÀ BASSA — Da fare entro 1 mese

> Compliance legale e polish finale.

---

### 9. Cookie Banner e Privacy Policy (GDPR)
**Problema:** Un sito italiano commerciale con form contatti DEVE avere informativa privacy e cookie banner. Google Fonts di per sé trasferisce dati a Google (IP dell'utente).

**Azioni:**
1. **Creare pagina `privacy.html`** con informativa privacy conforme al GDPR (Art. 13)
2. **Aggiungere cookie banner** — Consigliato [Iubenda](https://www.iubenda.com/it/) (piano gratuito) oppure soluzione custom minimale
3. **Aggiungere link nel footer:**
```html
<a href="/privacy.html">Privacy Policy</a> | <a href="/cookie.html">Cookie Policy</a>
```
4. **Valutare self-hosting dei Google Fonts** per evitare trasferimento dati a terzi

---

### 10. Aggiungere Schema.org / Structured Data
**Problema:** Google non ha dati strutturati per capire che è un'impresa edile.

**Aggiungere in `<head>`:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Edily srls",
  "description": "Sviluppo Immobiliare e Costruzioni d'eccellenza a Milano",
  "url": "https://www.edilymilano.com",
  "telephone": "",
  "email": "edilymilano@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via Eleonora Fonseca Pimentel, 18",
    "addressLocality": "Milano",
    "postalCode": "20127",
    "addressCountry": "IT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.4942,
    "longitude": 9.2153
  },
  "sameAs": [
    "https://www.instagram.com/edilymilano/",
    "https://www.linkedin.com/company/edilymilano/"
  ]
}
</script>
```

---

### 11. Ottimizzare Immagini e Video
**Problema:** Il repo pesa 27.6 MB — probabile che immagini e video non siano ottimizzati.

**Azioni:**
1. Convertire le immagini `.jpeg` in **WebP** (risparmio ~30-50% di peso)
2. Aggiungere tag `<picture>` con fallback:
```html
<picture>
  <source srcset="/images/2.webp" type="image/webp">
  <img src="/images/2.jpeg" alt="..." loading="lazy">
</picture>
```
3. Comprimere il video hero con **FFmpeg**:
```bash
ffmpeg -i cassia.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1920:-2 cassia-compressed.mp4
```
4. Valutare un poster frame per il video (immagine statica mostrata prima del caricamento)

---

### 12. ✅ Dominio Personalizzato
**Problema:** Il sito era su un sottodominio vercel, non professionale per un'azienda reale.

**Stato: COMPLETATO**
1. ✅ Acquistato dominio `www.edilymilano.com`
2. ✅ Configurato su Vercel: Settings → Domains → Add
3. ✅ Aggiornati tutti i meta tag con il nuovo URL
4. ✅ SSL e redirect attivati correttamente

---

## 📅 Timeline Consigliata

```
SETTIMANA 1 (URGENTE)
├── ✅ Fix form contatti (#1)
├── ✅ Rimuovere dist/ dal repo (#2)
├── ✅ Inserire link social reali (#3)
└── ✅ Aggiungere meta tags OG + SEO (#4)

SETTIMANA 2
├── 🔧 Migrare CDN → npm bundle (#5)
├── 🔧 Aggiungere favicon (#6)
├── 🔧 Consolidare font Cormorant (#7)
└── 🔧 Aggiungere preloader (#8)

SETTIMANA 3-4
├── 📋 Privacy Policy + Cookie Banner (#9)
├── 📋 Schema.org structured data (#10)
├── 📋 Ottimizzazione immagini/video (#11)
└── ✅ Dominio personalizzato (#12)
```

---

## 🧹 Nota sulle Altre Repository Edily

| Repository | Stato consigliato |
|------------|-------------------|
| `DrRobot24/edily-hub` | **Archiviare** — Primo prototipo React+Tailwind, superato da edily-mi |
| `DrRobot24/edily-milano` | **Archiviare** — Secondo tentativo React puro, superato da edily-mi |
| `DrRobot24/edily-mi` | ✅ **Repository principale** — Mantenere e sviluppare |

Per archiviare: Repository → Settings → Danger Zone → Archive this repository

---

> **Questo documento è il riferimento unico per tutti gli interventi da applicare a edily-mi.**  
> Ogni punto è indipendente e può essere completato singolarmente.  
> Priorità 🔴 = bloccante | 🟡 = importante | 🟢 = migliorativo