/* ══════════════════════════════════════
   SMOOTH SCROLL
   Wraps Lenis and exposes the instance
   + shared scroll state for other modules.
══════════════════════════════════════ */

export const scrollState = {
    y:     0,
    delta: 0,
};

let lenisInstance = null;

export function initSmoothScroll() {
    lenisInstance = new Lenis({
        duration:    1.2,
        easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenisInstance.on('scroll', ({ scroll }) => {
        scrollState.delta = scroll - scrollState.y;
        scrollState.y     = scroll;
    });

    // Drive Lenis with its own RAF loop
    function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenisInstance;
}

export function getLenis() {
    return lenisInstance;
}
