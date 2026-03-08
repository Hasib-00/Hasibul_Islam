/* ══════════════════════════════════════
   HOME PAGE v2  (hm-*)
   1. Particle-grid canvas
   2. Role typewriter
   3. Scroll-reveal for about/project sections
══════════════════════════════════════ */

export function initHome() {
    const page = document.getElementById('page-home');
    if (!page) return;

    /* ── 1. Hex-grid particle canvas ── */
    const canvas = document.getElementById('hm-canvas');
    if (canvas && !canvas._inited) {
        canvas._inited = true;
        const ctx = canvas.getContext('2d');
        let W, H, particles = [], mouse = { x: -9999, y: -9999 };

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Dot {
            constructor() { this.reset(true); }
            reset(init) {
                this.x  = Math.random() * W;
                this.y  = init ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10);
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.r  = Math.random() * 1.2 + 0.4;
                this.base = Math.random() * 0.35 + 0.08;
                this.a  = this.base;
            }
            update() {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    this.x += dx / dist * 0.6;
                    this.y += dy / dist * 0.6;
                    this.a = Math.min(0.8, this.a + 0.04);
                } else {
                    this.a += (this.base - this.a) * 0.05;
                }
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(false);
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,200,255,${this.a})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) particles.push(new Dot());

        function loop() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d  = Math.sqrt(dx*dx + dy*dy);
                    if (d < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const a = 0.07 * (1 - d / 130);
                        ctx.strokeStyle = `rgba(0,200,255,${a})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(loop);
        }
        loop();
    }

    /* ── 2. Role typewriter ── */
    const roleEl = document.getElementById('hm-role-typed');
    if (roleEl && !roleEl._typed) {
        roleEl._typed = true;
        const roles = [
            'Android Developer',
            'Kotlin & Jetpack Compose',
            'Firebase & Room DB',
            'MVVM Architecture',
            'NSDA Certified',
        ];
        let ri = 0, ci = 0, deleting = false;
        function tick() {
            const word = roles[ri];
            if (!deleting) {
                ci++;
                roleEl.textContent = word.slice(0, ci);
                if (ci === word.length) { deleting = true; setTimeout(tick, 2000); return; }
            } else {
                ci--;
                roleEl.textContent = word.slice(0, ci);
                if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
            }
            setTimeout(tick, deleting ? 40 : 75);
        }
        setTimeout(tick, 1000);
    }

    /* ── 3. Scroll reveal for about + project sections ── */
    const reveals = page.querySelectorAll('.hm-about, .hm-about-badges span, .hm-astat');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('hm-revealed');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
}
