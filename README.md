# Hasibul Islam — Portfolio

A minimal, animation-rich personal portfolio built with vanilla HTML, CSS, and JavaScript (ES modules). No frameworks, no build step.

## Project Structure

```
hasibul-portfolio/
├── index.html              ← Entry point — all markup lives here
├── css/
│   ├── variables.css       ← Design tokens (colors, fonts, spacing, easing)
│   ├── style.css           ← All component styles
│   ├── animations.css      ← Preloader, fade-in, and keyframe animations
│   └── responsive.css      ← Mobile / tablet breakpoints
├── js/
│   ├── main.js             ← Boots all modules & drives the unified RAF loop
│   ├── preloader.js        ← Multilingual greeting + curtain wipe
│   ├── smooth-scroll.js    ← Lenis wrapper + shared scrollState object
│   ├── cursor.js           ← Custom cursor + expand on hover
│   ├── marquee.js          ← Hero marquee + opposing project-row marquees
│   ├── parallax.js         ← Layered hero parallax
│   └── fade-in.js          ← IntersectionObserver scroll reveals
├── data/
│   └── projects.js         ← Edit this to change portfolio cards (reference only)
├── assets/
│   └── images/             ← Drop local images here; update src in index.html
└── lib/
    └── lenis.min.js        ← (Optional) local copy of Lenis for offline use
```

## Getting Started

### Serve locally
Open `index.html` in any modern browser, **or** use a local dev server to enable ES modules:

```bash
# Node
npx serve .

# Python
python -m http.server 8080
```

Then open `http://localhost:8080`.

### Offline / no CDN
1. Download [Lenis](https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js) into `lib/`.
2. In `index.html`, change the Lenis `<script>` src:
   ```html
   <script src="lib/lenis.min.js"></script>
   ```

## Customisation

| What to change | Where |
|---|---|
| Name, bio, stats, badges | `index.html` — About Strip section |
| Portfolio cards | `index.html` — Work section (or use `data/projects.js` as reference) |
| Hero photo | `index.html` — `<img class="hero-photo">` `src` attribute |
| Color palette | `css/variables.css` — `:root` block |
| Greeting words | `js/preloader.js` — `greetings` array |
| Email address | `index.html` — footer `mailto:` links |
| Social links | `index.html` — footer `.footer-socials` anchors |
