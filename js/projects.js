/* ══════════════════════════════════════
   PROJECTS — dev card interactions
   1. IntersectionObserver scroll reveal (home + work page)
   2. Smooth 3D tilt on mousemove
   3. Click handled by project-drawer.js
══════════════════════════════════════ */

function attachTilt(card) {
    let rx = 0, ry = 0, rafId = null;
    function lerp(a, b, t) { return a + (b - a) * t; }

    card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width  - 0.5;
        const ny = (e.clientY - r.top)  / r.height - 0.5;
        const tx =  nx * 12, ty = -ny * 10;
        cancelAnimationFrame(rafId);
        function frame() {
            rx = lerp(rx, ty, 0.14); ry = lerp(ry, tx, 0.14);
            card.style.transform = `translateY(-6px) scale(1.015) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            if (Math.abs(ty-rx) > 0.05 || Math.abs(tx-ry) > 0.05) rafId = requestAnimationFrame(frame);
        }
        rafId = requestAnimationFrame(frame);
    });

    card.addEventListener('mouseleave', () => {
        cancelAnimationFrame(rafId);
        function springBack() {
            rx = lerp(rx, 0, 0.1); ry = lerp(ry, 0, 0.1);
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            if (Math.abs(rx) > 0.05 || Math.abs(ry) > 0.05) rafId = requestAnimationFrame(springBack);
            else { card.style.transform = ''; rafId = null; }
        }
        rafId = requestAnimationFrame(springBack);
    });
}

function revealSection(section) {
    if (section._revealed) return;
    section._revealed = true;
    section.classList.add('dev-revealed');
    section.querySelectorAll('.dev-card').forEach(attachTilt);
}

export function initProjects() {
    /* ── home page cards ── */
    const homeSec = document.getElementById('hm-projects');
    if (homeSec && !homeSec._revealed) {
        // If already in viewport on load, reveal immediately
        const rect = homeSec.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            revealSection(homeSec);
        } else {
            const io = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) { revealSection(homeSec); io.disconnect(); }
            }, { threshold: 0.06 });
            io.observe(homeSec);
        }
    }

    /* ── old home projects-section (kept for compat) ── */
    const devSec = document.getElementById('projects-section');
    if (devSec && !devSec._revealed) {
        const io2 = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { revealSection(devSec); io2.disconnect(); }
        }, { threshold: 0.06 });
        io2.observe(devSec);
    }
}

/* ══════════════════════════════════════
   WORK PAGE — filter logic
══════════════════════════════════════ */
export function initWorkPage() {
    const filters = document.querySelectorAll('.wp-filter');
    const cards   = document.querySelectorAll('.wp-card');
    const countEl = document.getElementById('wp-count');
    if (!filters.length) return;

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.filter;
            filters.forEach(b => b.classList.remove('wp-filter--active'));
            btn.classList.add('wp-filter--active');
            let visible = 0;
            cards.forEach(card => {
                const match = type === 'all' || card.dataset.type === type;
                card.classList.toggle('wp-hidden', !match);
                if (match) { visible++; card.style.transitionDelay = `${visible * 0.07}s`; }
                else card.style.transitionDelay = '0s';
            });
            if (countEl) countEl.textContent = `0${visible} project${visible !== 1 ? 's' : ''}`;
        });
    });
}
