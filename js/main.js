/* ══════════════════════════════════════
   MAIN — entry point
   Boots all modules, drives the unified
   RAF loop, and wires up page transitions.
══════════════════════════════════════ */

import { initPreloader }                    from './preloader.js';
import { initSmoothScroll, scrollState }    from './smooth-scroll.js';
import { initCursor }                       from './cursor.js';
import { tickHeroMarquee, tickProjectRows } from './marquee.js';
import { initParallax, tickParallax }       from './parallax.js';
import { initFadeIn }                       from './fade-in.js';
import { initRouter }                       from './router.js';
import { initMenu }                         from './menu.js';
import { initLogoFx, initAboutCircle }      from './logo-fx.js';
import { initProjects, initWorkPage }       from './projects.js';
import { initContact }                      from './contact.js';
import { initProjectDrawer }               from './project-drawer.js';
import { initAbout }                        from './about.js';
import { initHome }                         from './home.js';
import { initContactPage }                  from './contact-page.js';
import { initScrollReveal, initCursorTrail, initCardGlow, initMagnetic, initContactGlow, initCounters, initEntranceLines, initScrollProgress, initDrawerAnim, initConnTitle, initNavAnimations, initSectionEntered, initNavHide, initFloatingElements, initCardTilt, initAboutJsonAnim, initStatsBarFill } from './animate.js';

/* ──────────────────────────────────────
   Boot sequence
────────────────────────────────────── */

// 1. Smooth scroll (must come first — others read scrollState)
const lenis = initSmoothScroll();
window.__lenis = lenis; // expose for router scroll-reset

// 2. Cursor
initCursor();

// 3. Router — wires nav links, shows first page
initRouter();

// 4. Menu — scroll-triggered hamburger + drawer
initMenu();

// 5. Logo effects — shake + magnetic
initLogoFx();
initAboutCircle();
initProjects();
initWorkPage();
initContact();
initProjectDrawer();
initAbout();
initContactPage();
initHome();

// Global animation systems
initScrollReveal();
initCursorTrail();
initCardGlow();
initMagnetic();
initContactGlow();
initCounters();
initEntranceLines();
initScrollProgress();
initDrawerAnim();
initConnTitle();
initNavAnimations();
initSectionEntered();
initNavHide();
initFloatingElements();
initCardTilt();
initAboutJsonAnim();
initStatsBarFill();

// 4. Page-specific modules
initFadeIn();
initParallax();

// 5. Preloader — just wait for it to finish, homepage is already visible underneath
initPreloader();

// Scroll to top on page change
window.addEventListener('router:pageChange', () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
});

/* ──────────────────────────────────────
   resetPageModules
   Called by the router after each swap
────────────────────────────────────── */
export function resetPageModules() {
    initFadeIn();
    initParallax();
    initWorkPage();
    initAbout();
    initContactPage();
    initHome();
    initScrollReveal();
    initCardGlow();
    initMagnetic();
    initContactGlow();
    initCounters();
    initEntranceLines();
    initConnTitle();
    initSectionEntered();
    initCardTilt();
    initAboutJsonAnim();
    initStatsBarFill();
}

/* ──────────────────────────────────────
   UNIFIED RAF LOOP
────────────────────────────────────── */
function mainLoop() {
    const { y, delta } = scrollState;

    tickHeroMarquee(y, delta);
    tickProjectRows(delta);
    tickParallax(y);

    scrollState.delta = 0;

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
