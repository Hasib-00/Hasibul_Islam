/* ══════════════════════════════════════
   CONTACT — TERMINAL  (tc-*)
   1. Particle field (canvas)
   2. Scroll reveal
   3. Live clock
   4. Typewriter subtitle
   5. Terminal window line-by-line reveal
   6. Chip toggle (cards)
══════════════════════════════════════ */

export function initContact() {
    const section = document.getElementById('contact-section');
    if (!section) return;

    /* ── 1. Particles ── */
    initParticles();

    /* ── 2. Scroll reveal ── */
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            section.classList.add('tc-revealed');
            startTerminal();
            startTyped();
            io.disconnect();
        }
    }, { threshold: 0.06 });
    io.observe(section);

    /* ── 3. Live clock ── */
    const clockEl = document.getElementById('tc-time');
    function updateClock() {
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ── 4. Typewriter subtitle ── */
    const phrases = [
        'Android Developer based in Dhaka, Bangladesh',
        'Kotlin · Jetpack Compose · Firebase',
        'NSDA Certified — Level 4 Android Development',
        'Open to freelance and full-time opportunities',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const typedEl = document.getElementById('tc-typed');

    function startTyped() {
        if (!typedEl) return;
        function tick() {
            const phrase = phrases[pIdx];
            if (!deleting) {
                typedEl.textContent = '> ' + phrase.slice(0, ++cIdx);
                if (cIdx === phrase.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
                setTimeout(tick, 45);
            } else {
                typedEl.textContent = '> ' + phrase.slice(0, --cIdx);
                if (cIdx === 0) {
                    deleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                    setTimeout(tick, 300);
                    return;
                }
                setTimeout(tick, 22);
            }
        }
        tick();
    }

    /* ── 5. Terminal typewriter ── */
    const termBody = document.getElementById('tc-win-body');
    const lines = [
        { type: 'prompt', text: 'hasibul@portfolio:~/contact$ ' },
        { type: 'cmd',    text: 'cat profile.json', delay: 600 },
        { type: 'out',    text: '{', delay: 900 },
        { type: 'keyval', key: '  "name"',       val: '"Hasibul Islam"',          delay: 1050 },
        { type: 'keyval', key: '  "role"',        val: '"Android & Web Developer"', delay: 1200 },
        { type: 'keyval', key: '  "location"',    val: '"Dhaka, Bangladesh"',       delay: 1350 },
        { type: 'keyval', key: '  "available"',   val: 'true',                      delay: 1500 },
        { type: 'keyval', key: '  "stack"',        val: '["Kotlin","React","Node"]', delay: 1650 },
        { type: 'out',    text: '}', delay: 1800 },
        { type: 'blank',  delay: 1950 },
        { type: 'prompt', text: 'hasibul@portfolio:~/contact$ ', delay: 2050 },
        { type: 'cmd',    text: 'echo $STATUS', delay: 2600 },
        { type: 'green',  text: '✓ Open to new opportunities', delay: 2900 },
        { type: 'blank',  delay: 3100 },
        { type: 'prompt', text: 'hasibul@portfolio:~/contact$ ', delay: 3200 },
        { type: 'cursor', delay: 3700 },
    ];

    function startTerminal() {
        if (!termBody) return;
        termBody.innerHTML = '';
        let currentPromptSpan = null;
        let cmdText = '';
        let cmdIdx = 0;

        lines.forEach((line, i) => {
            setTimeout(() => {
                if (line.type === 'blank') {
                    termBody.appendChild(document.createElement('br'));
                } else if (line.type === 'prompt') {
                    const span = document.createElement('span');
                    span.className = 'tc-line';
                    span.innerHTML = `<span class="tc-line-prompt">${line.text}</span>`;
                    currentPromptSpan = span;
                    termBody.appendChild(span);
                } else if (line.type === 'cmd' && currentPromptSpan) {
                    cmdText = line.text;
                    cmdIdx = 0;
                    function typeCmd() {
                        const txt = cmdText.slice(0, ++cmdIdx);
                        const existing = currentPromptSpan.querySelector('.tc-line-cmd');
                        if (existing) { existing.textContent = txt; }
                        else {
                            const cmdSpan = document.createElement('span');
                            cmdSpan.className = 'tc-line-cmd';
                            cmdSpan.textContent = txt;
                            currentPromptSpan.appendChild(cmdSpan);
                        }
                        if (cmdIdx < cmdText.length) setTimeout(typeCmd, 60);
                    }
                    typeCmd();
                } else if (line.type === 'out') {
                    const span = document.createElement('span');
                    span.className = 'tc-line tc-line-out';
                    span.textContent = line.text;
                    termBody.appendChild(span);
                } else if (line.type === 'keyval') {
                    const span = document.createElement('span');
                    span.className = 'tc-line';
                    span.innerHTML = `<span class="tc-line-key">${line.key}</span><span class="tc-line-out">: </span><span class="tc-line-val">${line.val}</span><span class="tc-line-out">,</span>`;
                    termBody.appendChild(span);
                } else if (line.type === 'green') {
                    const span = document.createElement('span');
                    span.className = 'tc-line';
                    span.style.color = '#0095ff';
                    span.textContent = line.text;
                    termBody.appendChild(span);
                } else if (line.type === 'cursor') {
                    const span = document.createElement('span');
                    span.className = 'tc-line';
                    span.innerHTML = '<span class="tc-cursor-line"></span>';
                    termBody.appendChild(span);
                }
                termBody.scrollTop = termBody.scrollHeight;
            }, line.delay || 0);
        });
    }

    /* ── 6. Particles canvas ── */
    function initParticles() {
        const canvas = document.getElementById('tc-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, pts = [];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const COUNT = 80;
        for (let i = 0; i < COUNT; i++) {
            pts.push({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.3,
                a: Math.random(),
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,149,255,${p.a * 0.5})`;
                ctx.fill();
            });
            // Connect nearby particles
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(0,149,255,${(1 - dist/100) * 0.08})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }
}
