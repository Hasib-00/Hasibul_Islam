/* ══════════════════════════════════════
   SCROLL FADE-IN
   Uses IntersectionObserver to reveal
   .fade-in elements as they enter the
   viewport. Staggered by DOM index.
══════════════════════════════════════ */

export function initFadeIn() {
    const elements = Array.from(document.querySelectorAll('.fade-in'));
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const i = elements.indexOf(entry.target);
            // Stagger siblings in groups of 3
            entry.target.style.transitionDelay = (i % 3 * 0.12) + 's';
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}
