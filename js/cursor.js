/* ══════════════════════════════════════
   CUSTOM CURSOR
   Follows the mouse and expands on
   interactive elements.
══════════════════════════════════════ */

export function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    // Track raw mouse position
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    // Expand on hoverable elements
    const targets = document.querySelectorAll('a, .proj-card, button');
    targets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });

    // Hide cursor when it leaves the viewport
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}
