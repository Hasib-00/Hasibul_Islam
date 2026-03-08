/* ══════════════════════════════════════
   ROUTER
   Intercepts nav-link clicks, runs the
   page transition, swaps the active page,
   then reveals it.

   Pages are <section class="page" id="page-*"> elements.
   The active one gets class "page--active".
   All others are hidden via CSS (display:none or visibility).
══════════════════════════════════════ */

import { coverScreen, revealScreen } from './transition.js';
import { resetPageModules }          from './main.js';

let currentPageId = 'page-home';

/**
 * Navigate to a page by its id (e.g. "page-about").
 * Plays cover → swap → reveal.
 */
export async function navigateTo(targetId) {
    if (targetId === currentPageId) return;

    // 1. Cover screen
    await coverScreen(targetId);

    // 2. Swap visible page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('page--active', p.id === targetId);
    });

    // Update nav active state
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('nav--active', a.dataset.page === targetId);
    });

    currentPageId = targetId;

    // 3. Re-init page-specific modules (fade-ins, etc.)
    resetPageModules();

    // 4. Scroll new page to top (Lenis)
    window.dispatchEvent(new CustomEvent('router:pageChange'));

    // 5. Reveal screen
    await revealScreen();
}

/**
 * Wire up all nav links with data-page attributes.
 */
export function initRouter() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Show home by default
    const home = document.getElementById('page-home');
    if (home) home.classList.add('page--active');
}
