/* ══════════════════════════════════════
   LOGO FX — magnetic cursor follow only
   (shake removed)
══════════════════════════════════════ */

export function initLogoFx() {
    const logo        = document.getElementById('logo');
    const logoDefault = logo ? logo.querySelector('.logo-default') : null;
    const logoHover   = logo ? logo.querySelector('.logo-hover')   : null;
    if (!logo || !logoDefault || !logoHover) return;

    const STRENGTH = 5;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHovered = false;
    let rafId = null;

    function applyMagnetic(x, y) {
        logoDefault.style.setProperty('--mx', `${x.toFixed(2)}px`);
        logoDefault.style.setProperty('--my', `${y.toFixed(2)}px`);
        logoHover.style.setProperty('--mx',   `${x.toFixed(2)}px`);
        logoHover.style.setProperty('--my',   `${y.toFixed(2)}px`);
    }

    function tick() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        applyMagnetic(currentX, currentY);

        if (isHovered || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            rafId = requestAnimationFrame(tick);
        } else {
            applyMagnetic(0, 0);
            rafId = null;
        }
    }

    logo.addEventListener('mousemove', e => {
        const rect = logo.getBoundingClientRect();
        const nx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const ny = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        targetX = nx * STRENGTH;
        targetY = ny * STRENGTH;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });

    logo.addEventListener('mouseenter', () => {
        isHovered = true;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });

    logo.addEventListener('mouseleave', () => {
        isHovered = false;
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });
}

/* ══════════════════════════════════════
   MAGNETIC ABOUT ME CIRCLE
══════════════════════════════════════ */
export function initAboutCircle() {
    const area = document.getElementById('about-me-circle-area');
    const btn  = document.getElementById('about-me-btn');
    if (!area || !btn) return;

    const STRENGTH = 28;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let hovered = false, rafId = null;

    function tick() {
        cx += (tx - cx) * 0.09;
        cy += (ty - cy) * 0.09;
        btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
        if (hovered || Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05) {
            rafId = requestAnimationFrame(tick);
        } else {
            btn.style.transform = 'translate(0px,0px)';
            rafId = null;
        }
    }

    area.addEventListener('mousemove', e => {
        const r = area.getBoundingClientRect();
        tx = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * STRENGTH;
        ty = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * STRENGTH;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });
    area.addEventListener('mouseenter', () => { hovered = true;  if (!rafId) rafId = requestAnimationFrame(tick); });
    area.addEventListener('mouseleave', () => { hovered = false; tx = 0; ty = 0; if (!rafId) rafId = requestAnimationFrame(tick); });
}
