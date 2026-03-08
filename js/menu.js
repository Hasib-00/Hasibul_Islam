export function initMenu() {
    const hamburgerBtn   = document.getElementById('hamburger-btn');
    const navLinks       = document.getElementById('nav-links');
    const drawerOverlay  = document.getElementById('drawer-overlay');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerClose    = document.getElementById('drawer-close');

    // Bail only if the essential open/close elements are missing
    if (!hamburgerBtn || !drawerOverlay) return;

    /* ── Open / Close ── */
    function openDrawer() {
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* ── Button listeners ── */
    hamburgerBtn.addEventListener('click', openDrawer);

    // Close button — guard in case element is somehow missing
    if (drawerClose) {
        drawerClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeDrawer();
        });
    }

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDrawer();
    });

    // Close when any drawer nav link is clicked
    if (drawerOverlay) {
        drawerOverlay.querySelectorAll('.drawer-link').forEach(function(link) {
            link.addEventListener('click', closeDrawer);
        });
    }

    /* ── Scroll: show/hide hamburger ── */
    const THRESHOLD = 80;
    let scrolled = false;

    function handleScroll(y) {
        const show = y > THRESHOLD;
        if (show === scrolled) return;
        scrolled = show;
        hamburgerBtn.classList.toggle('visible', show);
        if (navLinks) navLinks.classList.toggle('hidden', show);
    }

    window.addEventListener('scroll', function() {
        handleScroll(window.scrollY);
    }, { passive: true });

    // Hook into Lenis — retry until available
    function attachLenis() {
        if (window.__lenis) {
            window.__lenis.on('scroll', function(e) { handleScroll(e.scroll); });
        } else {
            setTimeout(attachLenis, 150);
        }
    }
    attachLenis();

    /* ── Active dot on page change ── */
    function updateDot() {
        var active = document.querySelector('.page.page--active');
        var activeId = active ? active.id : 'page-home';
        drawerOverlay.querySelectorAll('.drawer-link').forEach(function(a) {
            a.classList.toggle('active-page', a.dataset.page === activeId);
        });
    }

    updateDot();
    window.addEventListener('router:pageChange', function() {
        updateDot();
        scrolled = false;
        hamburgerBtn.classList.remove('visible');
        if (navLinks) navLinks.classList.remove('hidden');
    });
}
