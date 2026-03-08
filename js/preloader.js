/* ══════════════════════════════════════
   PRELOADER v5 — CINEMATIC ULTRA
   Total time: ~1.6s

   Stage 1 (0-400ms):
   — Canvas: explosion burst + color trails
   — Orbiting neon rings with glow dots
   — Background grid manifests
   — Corner brackets draw in

   Stage 2 (400-1000ms):
   — Wordmark chars drop in with spring
   — Shimmer runs across the letters
   — Progress line fills with glow tip

   Stage 3 (1000-1600ms):
   — Grid implodes to center
   — White + green diagonal slash sweeps left→right
   — Everything dissolves with fade + scale
   — Preloader exits, page is revealed
══════════════════════════════════════ */

export function initPreloader() {
    return new Promise(resolve => {
        const el = document.getElementById('preloader');
        if (!el) { resolve(); return; }

        const canvas = document.getElementById('pl-cv');
        const ctx    = canvas ? canvas.getContext('2d') : null;
        let   raf    = null;
        let   done   = false;

        if (canvas && ctx) {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const W  = canvas ? canvas.width  : 0;
        const H  = canvas ? canvas.height : 0;
        const cx = W / 2;
        const cy = H / 2;

        /* ─── Particle burst ─── */
        const COLS = ['#ffffff','#00c8ff','#818cf8','#38bdf8','#f59e0b'];
        const particles = [];

        function spawnBurst(n, speed, fromX, fromY) {
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4;
                const spd   = (Math.random() * speed * 0.6 + speed * 0.4);
                particles.push({
                    x: fromX, y: fromY,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    r:  Math.random() * 2.5 + 0.8,
                    a:  0.95,
                    col: COLS[Math.floor(Math.random() * COLS.length)],
                    dec: 0.014 + Math.random() * 0.018,
                    trail: [],
                    maxTrail: 8,
                });
            }
        }

        // Main burst
        spawnBurst(80, 6, cx, cy);

        // Secondary bursts from corners
        setTimeout(() => spawnBurst(20, 4, cx - W*0.3, cy - H*0.25), 80);
        setTimeout(() => spawnBurst(20, 4, cx + W*0.3, cy + H*0.25), 130);

        /* ─── Rings ─── */
        let ringT = 0;
        const rings = [
            { r: 70,  spd: 0.9,  alpha: 0.18, dotCol: '#00c8ff', dotR: 2.5 },
            { r: 130, spd: -0.6, alpha: 0.12, dotCol: '#818cf8', dotR: 2   },
            { r: 190, spd: 0.4,  alpha: 0.08, dotCol: '#38bdf8', dotR: 1.5 },
        ];

        /* ─── Background grid ─── */
        const GRID = 55;
        let gridAlpha = 0;

        /* ─── Draw loop ─── */
        function drawFrame() {
            if (done) return;
            ctx.clearRect(0, 0, W, H);
            ringT += 0.018;

            // Grid
            if (gridAlpha < 0.06) gridAlpha += 0.002;
            ctx.strokeStyle = `rgba(0,200,255,${gridAlpha})`;
            ctx.lineWidth = 0.5;
            for (let x = 0; x < W; x += GRID) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += GRID) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            // Rings
            rings.forEach(ring => {
                // Ring arc
                ctx.beginPath();
                ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${ring.alpha})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();

                // Glow dot
                const ang  = ringT * ring.spd * Math.PI * 2;
                const dotX = cx + Math.cos(ang) * ring.r;
                const dotY = cy + Math.sin(ang) * ring.r;

                const g = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, ring.dotR * 4);
                g.addColorStop(0, ring.dotCol);
                g.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(dotX, dotY, ring.dotR * 4, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.globalAlpha = 0.4;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(dotX, dotY, ring.dotR, 0, Math.PI * 2);
                ctx.fillStyle = ring.dotCol;
                ctx.globalAlpha = 0.9;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // Particles
            let alive = false;
            particles.forEach(p => {
                if (p.a <= 0) return;
                alive = true;

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > p.maxTrail) p.trail.shift();

                // Trail
                for (let i = 1; i < p.trail.length; i++) {
                    const frac = i / p.trail.length;
                    ctx.beginPath();
                    ctx.moveTo(p.trail[i-1].x, p.trail[i-1].y);
                    ctx.lineTo(p.trail[i].x, p.trail[i].y);
                    ctx.strokeStyle = p.col;
                    ctx.globalAlpha = p.a * frac * 0.5;
                    ctx.lineWidth   = p.r * frac;
                    ctx.stroke();
                }

                // Head glow
                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                grd.addColorStop(0, p.col);
                grd.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.globalAlpha = p.a * 0.3;
                ctx.fill();

                // Head
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.col;
                ctx.globalAlpha = p.a;
                ctx.fill();
                ctx.globalAlpha = 1;

                p.x  += p.vx; p.y  += p.vy;
                p.vx *= 0.96; p.vy *= 0.96;
                p.vy += 0.05; // gravity
                p.a  -= p.dec;
            });

            raf = requestAnimationFrame(drawFrame);
        }

        if (canvas && ctx) drawFrame();

        /* ─── Progress line ─── */
        const fill = document.getElementById('pl-line-fill');
        if (fill) {
            fill.style.transition = 'width 1.1s cubic-bezier(0.16,1,0.3,1)';
            requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = '100%'; }));
        }

        /* ─── Shimmer pass over wordmark after chars land ─── */
        setTimeout(() => {
            const wm = document.getElementById('pl-wordmark');
            if (!wm) return;
            wm.style.transition = 'filter 0.3s ease';
            wm.style.filter = 'brightness(1.6) drop-shadow(0 0 20px rgba(0,200,255,0.4))';
            setTimeout(() => {
                wm.style.filter = 'brightness(1) drop-shadow(0 0 8px rgba(0,200,255,0.15))';
            }, 300);
        }, 700);

        /* ─── Exit after 1.45s ─── */
        setTimeout(triggerExit, 1450);

        function triggerExit() {
            done = true;
            cancelAnimationFrame(raf);

            const slash   = document.getElementById('pl-slash');
            const wordmark = document.getElementById('pl-wordmark');
            const lineBar  = document.getElementById('pl-line-bar');

            // Fade wordmark & bar
            if (wordmark) { wordmark.style.transition = 'opacity 0.2s ease, transform 0.35s ease'; wordmark.style.opacity = '0'; wordmark.style.transform = 'scale(1.05)'; }
            if (lineBar)  { lineBar.style.transition  = 'opacity 0.2s ease'; lineBar.style.opacity  = '0'; }

            // Grid implosion on canvas
            if (canvas && ctx) {
                let imp = 0;
                function implode() {
                    imp += 0.08;
                    ctx.clearRect(0, 0, W, H);
                    const alpha = Math.max(0, gridAlpha * (1 - imp));
                    ctx.strokeStyle = `rgba(0,200,255,${alpha})`;
                    ctx.lineWidth = 0.5;
                    const scale = 1 - imp * 0.4;
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.scale(scale, scale);
                    ctx.translate(-cx, -cy);
                    for (let x = 0; x < W; x += GRID) {
                        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
                    }
                    for (let y = 0; y < H; y += GRID) {
                        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
                    }
                    ctx.restore();
                    if (imp < 1) raf = requestAnimationFrame(implode);
                }
                implode();
            }

            // Double slash sweep — white then green
            if (slash) {
                slash.style.background = '#ffffff';
                slash.style.left = '-110%';
                slash.style.transition = 'left 0.38s cubic-bezier(0.76,0,0.24,1)';
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    slash.style.left = '0%';
                    setTimeout(() => {
                        slash.style.left = '110%';
                        // Second slash — green
                        const slash2 = document.createElement('div');
                        slash2.style.cssText = `position:absolute;top:0;left:-110%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,200,255,0.3),transparent);z-index:4;transform:skewX(-8deg);`;
                        el.appendChild(slash2);
                        requestAnimationFrame(() => requestAnimationFrame(() => {
                            slash2.style.transition = 'left 0.35s cubic-bezier(0.76,0,0.24,1)';
                            slash2.style.left = '110%';
                        }));
                    }, 180);
                }));
            }

            setTimeout(finish, 560);
        }

        function finish() {
            cancelAnimationFrame(raf);
            el.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(1.02)';
            setTimeout(() => { el.remove(); resolve(); }, 260);
        }
    });
}
