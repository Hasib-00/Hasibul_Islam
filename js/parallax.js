/* ══════════════════════════════════════
   PARALLAX
   Applies layered scroll-depth transforms
   to hero elements.
══════════════════════════════════════ */

const heroPhoto    = document.getElementById('hero-photo');
const heroHeadline = document.getElementById('hero-headline');
const locationPill = document.getElementById('location-pill');

export function initParallax() {
    if (!locationPill) return;

    // Anchor the pill vertically using marginTop instead of CSS translate
    // so our JS translate3d calls don't clash with CSS top: 50%.
    locationPill.style.top       = '50%';
    locationPill.style.marginTop = '-22px'; // approx half its height (~44px)
}

/**
 * Called every frame from main.js with the current smooth scroll value.
 * @param {number} scrollY  - current Lenis scroll position in pixels
 */
export function tickParallax(scrollY) {
    if (heroPhoto) {
        // Photo moves slowest — depth factor 0.25
        heroPhoto.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
    }

    if (heroHeadline) {
        // Headline — depth factor 0.12
        heroHeadline.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
    }

    if (locationPill) {
        // Pill — depth factor 0.08, compensates for CSS top: 50%
        locationPill.style.transform = `translate3d(0, calc(-50% + ${scrollY * 0.08}px), 0)`;
    }
}
