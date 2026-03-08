/* ══════════════════════════════════════
   ANIMATE.JS
   Global scroll-driven reveal system +
   cursor trail + magnetic buttons +
   live radial mouse glow on cards
══════════════════════════════════════ */

/* ─────────────────────────────────────
   1. SCROLL REVEAL
   Observes [data-reveal] + [data-reveal-group]
───────────────────────────────────── */
export function initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function attachAll() {
        document.querySelectorAll('[data-reveal]:not(.revealed), [data-reveal-group]:not(.revealed)')
            .forEach(el => io.observe(el));
    }
    attachAll();
    // Re-scan after page transitions
    window.addEventListener('router:pageChange', () => {
        setTimeout(attachAll, 100);
    });
}

/* ─────────────────────────────────────
   2. CURSOR TRAIL GLOW
───────────────────────────────────── */
export function initCursorTrail() {
    const trail = document.getElementById('cursor-trail');
    if (!trail) return;

    let tx = -500, ty = -500;
    let cx = -500, cy = -500;
    let raf;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    function tick() {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        trail.style.left = cx + 'px';
        trail.style.top  = cy + 'px';
        raf = requestAnimationFrame(tick);
    }
    tick();
}

/* ─────────────────────────────────────
   3. CARD RADIAL MOUSE GLOW
   Makes the card glow follow cursor
───────────────────────────────────── */
export function initCardGlow() {
    function attach() {
        document.querySelectorAll('.dev-card:not([data-glow-init])').forEach(card => {
            card.dataset.glowInit = '1';
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const x  = e.clientX - r.left;
                const y  = e.clientY - r.top;
                const pct_x = (x / r.width  * 100).toFixed(1);
                const pct_y = (y / r.height * 100).toFixed(1);
                const glowEl = card.querySelector('.dev-card-glow');
                if (glowEl) {
                    glowEl.style.background = `radial-gradient(circle at ${pct_x}% ${pct_y}%, var(--glow, #00c8ff), transparent 70%)`;
                }
            });
            card.addEventListener('mouseleave', () => {
                const glowEl = card.querySelector('.dev-card-glow');
                if (glowEl) glowEl.style.background = '';
            });
        });
    }
    attach();
    window.addEventListener('router:pageChange', () => setTimeout(attach, 200));
}

/* ─────────────────────────────────────
   4. MAGNETIC BUTTONS
   data-mag elements softly follow cursor
───────────────────────────────────── */
export function initMagnetic() {
    function attach() {
        document.querySelectorAll('[data-mag]:not([data-mag-init])').forEach(el => {
            el.dataset.magInit = '1';
            el.addEventListener('mousemove', e => {
                const r  = el.getBoundingClientRect();
                const cx = r.left + r.width  / 2;
                const cy = r.top  + r.height / 2;
                const dx = (e.clientX - cx) * 0.3;
                const dy = (e.clientY - cy) * 0.3;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }
    attach();
    window.addEventListener('router:pageChange', () => setTimeout(attach, 200));
}

/* ─────────────────────────────────────
   5. CONTACT LINK CARD MOUSE GLOW
───────────────────────────────────── */
export function initContactGlow() {
    function attach() {
        document.querySelectorAll('.cp-link-card:not([data-glow-init])').forEach(card => {
            card.dataset.glowInit = '1';
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
            });
        });
    }
    attach();
    window.addEventListener('router:pageChange', () => setTimeout(attach, 200));
}

/* ─────────────────────────────────────
   6. ANIMATED COUNTERS
   data-count="40" triggers count-up on reveal
───────────────────────────────────── */
export function initCounters() {
    const statNums = document.querySelectorAll('.hm-astat-num');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el  = entry.target;
            const end = parseInt(el.dataset.to || el.textContent, 10);
            if (isNaN(end)) return;
            const suffix = el.dataset.suffix || '';
            let start = 0, dur = 1200, startTime = null;
            function step(ts) {
                if (!startTime) startTime = ts;
                const p = Math.min((ts - startTime) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(ease * end) + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => {
        const text = el.textContent.trim();
        const num  = parseInt(text, 10);
        const suffix = text.replace(/[0-9]/g, '');
        if (!isNaN(num)) {
            el.dataset.to = num;
            el.dataset.suffix = suffix;
            el.textContent = '0' + suffix;
            io.observe(el);
        }
    });
}

/* ─────────────────────────────────────
   7. SECTION ENTRANCE LINES
   Draws a horizontal line across section tops
───────────────────────────────────── */
export function initEntranceLines() {
    const lineTargets = document.querySelectorAll('.hm-about, .hm-projects, .ab2-services, .ab2-facts, .ab2-tl-section');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-entered');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    lineTargets.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────
   8. SCROLL PROGRESS BAR
───────────────────────────────────── */
export function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
        const doc  = document.documentElement;
        const scrolled = doc.scrollTop || document.body.scrollTop;
        const total    = doc.scrollHeight - doc.clientHeight;
        bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }
    window.addEventListener('scroll', update, { passive: true });
    // Also hook into Lenis
    if (window.__lenis) {
        window.__lenis.on('scroll', ({ scroll, limit }) => {
            bar.style.width = (scroll / limit * 100) + '%';
        });
    }
}

/* ─────────────────────────────────────
   9. DRAWER — stagger links on open
───────────────────────────────────── */
export function initDrawerAnim() {
    const overlay = document.getElementById('drawer-overlay');
    const panel   = document.getElementById('drawer-panel');
    if (!overlay || !panel) return;

    const obs = new MutationObserver(() => {
        const isOpen = overlay.classList.contains('open');
        panel.classList.toggle('drawer--open', isOpen);
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
}

/* ─────────────────────────────────────
  10. CONN TITLE data-text mirror
───────────────────────────────────── */
export function initConnTitle() {
    document.querySelectorAll('.ab2-conn-title').forEach(el => {
        if (!el.dataset.text) el.dataset.text = el.textContent;
    });
}

/* ─────────────────────────────────────
  11. NAV LINKS — ultra animated hover
  Liquid underline + char scatter effect
───────────────────────────────────── */
export function initNavAnimations() {
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const text = link.textContent.trim();
        if (!text) return;

        link.textContent = '';
        link.style.cssText += ';position:relative;overflow:hidden;display:inline-block;vertical-align:middle;';

        // ── Layer 1: original chars (slide UP and out on hover) ──
        const original = document.createElement('span');
        original.style.cssText = 'display:inline-flex;position:relative;z-index:1;';

        text.split('').forEach((ch, i) => {
            const s = document.createElement('span');
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            s.style.cssText =
                'display:inline-block;' +
                'transition:transform 0.35s cubic-bezier(0.16,1,0.3,1) ' + (i * 25) + 'ms,' +
                'opacity 0.25s ease ' + (i * 18) + 'ms;';
            original.appendChild(s);
        });

        // ── Layer 2: hover chars (slide IN from below on hover) ──
        // Uses same layout — absolutely positioned over layer 1
        const hover = document.createElement('span');
        hover.setAttribute('aria-hidden', 'true');
        hover.style.cssText =
            'display:inline-flex;position:absolute;inset:0;' +
            'z-index:2;pointer-events:none;color:#00c8ff;';

        text.split('').forEach((ch, i) => {
            const s = document.createElement('span');
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            s.style.cssText =
                'display:inline-block;' +
                'transform:translateY(105%);' +
                'transition:transform 0.35s cubic-bezier(0.16,1,0.3,1) ' + (i * 25) + 'ms;';
            hover.appendChild(s);
        });

        // ── Underline ──
        const uline = document.createElement('span');
        uline.setAttribute('aria-hidden', 'true');
        uline.style.cssText =
            'position:absolute;bottom:-2px;left:0;height:1px;width:0;' +
            'background:linear-gradient(90deg,#00c8ff,#7c6aff);' +
            'transition:width 0.3s cubic-bezier(0.16,1,0.3,1);' +
            'pointer-events:none;';

        link.appendChild(original);
        link.appendChild(hover);
        link.appendChild(uline);

        const origSpans  = original.querySelectorAll('span');
        const hoverSpans = hover.querySelectorAll('span');

        link.addEventListener('mouseenter', () => {
            origSpans.forEach(s => {
                s.style.transform = 'translateY(-105%)';
                s.style.opacity   = '0';
            });
            hoverSpans.forEach(s => { s.style.transform = 'translateY(0)'; });
            uline.style.width = '100%';
        });

        link.addEventListener('mouseleave', () => {
            origSpans.forEach(s => {
                s.style.transform = '';
                s.style.opacity   = '';
            });
            hoverSpans.forEach(s => { s.style.transform = 'translateY(105%)'; });
            uline.style.width = '0';
        });
    });
}

/* ─────────────────────────────────────
  12. SECTION-ENTERED — triggers for
  tc-section, ab3-stats, dev-grid etc.
───────────────────────────────────── */
export function initSectionEntered() {
    const targets = [
        '.tc-section',
        '#ab3-stats',
        '.hm-projects',
        '.ab3-section-head',
        '.dev-grid',
        '.wp-grid',
    ];

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-entered', 'dev-revealed', 'revealed');
                // Stagger work cards
                if (entry.target.matches('.wp-grid, .dev-grid')) {
                    entry.target.querySelectorAll('.dev-card, .wp-card').forEach((card, i) => {
                        setTimeout(() => card.classList.add('wp-visible'), i * 100);
                    });
                }
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    function attach() {
        targets.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (!el.classList.contains('section-entered')) io.observe(el);
            });
        });
    }
    attach();
    window.addEventListener('router:pageChange', () => setTimeout(attach, 150));
}

/* ─────────────────────────────────────
  13. NAV HIDE ON SCROLL DOWN
───────────────────────────────────── */
export function initNavHide() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    let lastY = 0;
    let ticking = false;

    function check() {
        const y = window.scrollY;
        if (y > 80 && y > lastY) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(check); ticking = true; }
    }, { passive: true });
}

/* ─────────────────────────────────────
  14. FLOATING ELEMENTS — cancel CSS
  animation during page load, then add
  the floating bob after load
───────────────────────────────────── */
export function initFloatingElements() {
    // Remove the one-shot entrance animation after it ends,
    // leaving the continuous bob from motion-v2.css
    const floaters = [
        { sel: '.hm-float-code',  delay: 1800 },
        { sel: '.hm-float-stat',  delay: 2000 },
        { sel: '.hm-float-avail', delay: 2200 },
    ];
    floaters.forEach(({ sel, delay }) => {
        const el = document.querySelector(sel);
        if (!el) return;
        setTimeout(() => {
            el.style.opacity = '1';
        }, delay);
    });
}

/* ─────────────────────────────────────
  15. CARD 3D TILT — subtle perspective
  on mousemove within each card
───────────────────────────────────── */
export function initCardTilt() {
    function attach() {
        document.querySelectorAll('.dev-card:not([data-tilt-init])').forEach(card => {
            card.dataset.tiltInit = '1';
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const cx = r.left + r.width  / 2;
                const cy = r.top  + r.height / 2;
                const dx = (e.clientX - cx) / (r.width  / 2);
                const dy = (e.clientY - cy) / (r.height / 2);
                card.style.transform = `translateY(-6px) perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    attach();
    window.addEventListener('router:pageChange', () => setTimeout(attach, 200));
}

/* ─────────────────────────────────────
  16. ABOUT PAGE — JSON type-in
───────────────────────────────────── */
export function initAboutJsonAnim() {
    const jsonEl = document.getElementById('ab3-json');
    if (!jsonEl) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            jsonEl.querySelectorAll('.ab3-json-line').forEach((line, i) => {
                line.style.setProperty('--jl', i);
            });
            io.disconnect();
        }
    }, { threshold: 0.3 });
    io.observe(jsonEl);
}

/* ─────────────────────────────────────
  17. STATS BAR FILL TRIGGER
───────────────────────────────────── */
export function initStatsBarFill() {
    const statsSection = document.getElementById('ab3-stats');
    if (!statsSection) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            statsSection.classList.add('section-entered');
            io.disconnect();
        }
    }, { threshold: 0.2 });
    io.observe(statsSection);
}
