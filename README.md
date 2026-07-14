<div align="center">

# ✷ Sillage

### Portfolio d'un studio de direction artistique — **zéro dépendance.**

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Dépendances](https://img.shields.io/badge/d%C3%A9pendances-0-2ea44f?style=flat-square)
![Art génératif](https://img.shields.io/badge/affiches-g%C3%A9n%C3%A9ratives_SVG-8957e5?style=flat-square)
![CSP stricte](https://img.shields.io/badge/CSP-stricte-16a34a?style=flat-square)
![Licence](https://img.shields.io/badge/licence-ISC-2f81f7?style=flat-square)

[![▶ Ouvrir la démo](https://img.shields.io/badge/%E2%96%B6_Ouvrir_la_d%C3%A9mo-1D2AE8?style=for-the-badge)](https://matgordfr.github.io/site-studio/)

<br>

[![Aperçu de Sillage](preview.jpg)](https://matgordfr.github.io/site-studio/)

</div>

> [!NOTE]
> **Projet démo.** Le studio, les projets et les personnes sont **fictifs** — c'est une vitrine de savoir-faire front-end. Tout tourne dans le navigateur, sans backend.

---

## ✨ Ce que ça montre

Un **portfolio de studio créatif** immersif, éditorial — et **vivant** :

- **L'atelier — un générateur d'affiche jouable.** On choisit une initiale, un duo de couleurs, une composition, ou on **tire au sort** : l'affiche riso se redessine en direct. Le même moteur qui fabrique les six couvertures du portfolio, mis entre vos mains.
- **Des couvertures cliquables.** Chaque projet reçoit une **affiche riso unique générée au chargement** (formes, duotone, grain, grande initiale typographiée) — et **un clic en génère une autre piste**. Aucune image importée.
- **Un curseur sur mesure** — un point qui suit la souris avec inertie et grossit au survol (mode `blend`), désactivé au tactile et en `reduced-motion`.
- **Une vraie structure d'agence** — travaux, atelier, approche en 3 temps, services, le studio, avis, contact.

## 🔒 Sécurisé & rangé

- **CSP `<meta>` stricte** — `default-src 'self'`, aucun script/style inline, aucun CDN, `connect-src 'none'`. Vérifiée au rendu réel : **0 violation**.
- **0 `innerHTML`, 0 `eval`** — les affiches sont construites en `createElementNS` + `textContent`, les styles ponctuels via CSSOM (jamais `setAttribute('style')`).
- **Liens propres** — la navigation interne fait un smooth-scroll **sans laisser de `#` dans l'URL** (le `href="#id"` reste comme repli sans JavaScript).
- **`referrer no-referrer`**, **`rel="noopener noreferrer"`**, favicon + `og:image` inline/local. Rien dans le HTML qui devrait vivre ailleurs : structure en `.html`, style en `.css`, comportement en `.js`.

## 🎨 Le craft

- **Identité distinctive** — porcelaine froide + ultramarine (Klein), loin des gabarits attendus.
- **Polices auto-hébergées** — Instrument Serif (display) + Space Grotesk (UI & corps). Aucune requête tierce.
- **Graphismes générés en SVG** — affiches, atelier, tout est tracé dans le navigateur.
- **Accessible & responsive** — navigation clavier (atelier entièrement pilotable au clavier), focus visible, `prefers-reduced-motion` respecté, du grand écran au mobile **sans débordement** (vérifié à 1440 / 390 / 360 / 320 px), menu hamburger sous 640 px.

## 🛠️ Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=flat-square&logo=svg&logoColor=black)

Aucun framework, aucune librairie, aucun CDN. Polices comprises, la page reste légère.

## 📁 Structure

```
index.html             → la page (+ CSP meta stricte)
assets/css/studio.css  → design system + curseur + atelier + galerie
assets/js/studio.js    → curseur custom, affiches génératives + atelier jouable,
                        smooth-scroll sans #, hamburger (0 innerHTML/eval)
assets/fonts/          → Instrument Serif + Space Grotesk (auto-hébergées)
```

## 🚀 Lancer en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## 👤 Auteur

Réalisé par **[MatgordFR](https://github.com/MatgordFR)** — dev indépendant (bots Discord, sites, IA).
🌐 [matgord.com](https://matgord.com) · 🐦 [@matgordfr](https://x.com/matgordfr) · 🎨 [les autres démos](https://matgordfr.github.io/mes-demos-web/)

## 📄 Licence

[ISC](LICENSE) — libre d'usage.
