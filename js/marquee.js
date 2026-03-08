/* ══════════════════════════════════════
   MARQUEE
   Hero name marquee — always scrolls
   RIGHT TO LEFT (negative X direction).
   Scrolling speeds it up temporarily,
   then it returns to base speed.
══════════════════════════════════════ */

const BASE_SPEED = 0.7;   /* px per frame — constant left drift */
const SCROLL_BOOST = 0.4; /* extra speed multiplier from scroll */

let marqueeX  = 0;
let boostV    = 0;         /* extra velocity from scroll, decays */

const hm    = document.getElementById('hero-marquee');
const track = hm ? hm.querySelector('.marquee-track') : null;

export function tickHeroMarquee(scrollY, scrollDelta) {
    if (!track) return;

    /* Scroll adds a temporary speed boost (always left = negative) */
    if (scrollDelta !== 0) {
        boostV = -Math.abs(scrollDelta) * SCROLL_BOOST;
    }

    /* Total movement this frame: base + boost */
    marqueeX += -BASE_SPEED + boostV;

    /* Seamless infinite loop */
    const half = track.scrollWidth / 2;
    if (marqueeX <= -half) marqueeX += half;

    track.style.transform = `translate3d(${marqueeX}px, 0, 0)`;

    /* Decay the scroll boost */
    boostV *= 0.93;
    if (Math.abs(boostV) < 0.02) boostV = 0;

    /* Fade as page scrolls past hero */
    hm.style.opacity = Math.max(0, 1 - scrollY / 500);
}

/* ── Project rows (unused in current layout but kept for compatibility) ── */
let leftX = 0, rightX = 0, rowVelocity = 0;
const rowLeft  = document.querySelector('.row-left');
const rowRight = document.querySelector('.row-right');

export function tickProjectRows(scrollDelta) {
    if (!rowLeft || !rowRight) return;
    rowVelocity = scrollDelta * 0.3;
    leftX  -= rowVelocity;
    rightX += rowVelocity;
    const lh = rowLeft.scrollWidth  / 2;
    const rh = rowRight.scrollWidth / 2;
    if (leftX  <= -lh) leftX  += lh;
    if (leftX  >= 0)   leftX  -= lh;
    if (rightX >= 0)   rightX -= rh;
    if (rightX <= -rh) rightX += rh;
    rowLeft.style.transform  = `translate3d(${leftX}px, 0, 0)`;
    rowRight.style.transform = `translate3d(${rightX}px, 0, 0)`;
    rowVelocity *= 0.95;
    if (Math.abs(rowVelocity) < 0.01) rowVelocity = 0;
}
