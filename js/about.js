/* ══════════════════════════════════════
   ABOUT PAGE v3  (ab3-*)
   1. Particle constellation canvas
   2. JSON typewriter in system card
   3. Role-text cycle typewriter
   4. Live local time
   5. Stat counters + bar fills
   6. Skills tab switcher + ink indicator
══════════════════════════════════════ */

export function initAbout() {
    const page = document.getElementById('page-about');
    if (!page) return;

    /* ── 1. PARTICLE CANVAS ── */
    const canvas = document.getElementById('ab3-canvas');
    if (canvas && !canvas._inited) {
        canvas._inited = true;
        const ctx = canvas.getContext('2d');
        let W, H, pts = [], raf;
        function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < 70; i++) pts.push({
            x: Math.random()*W, y: Math.random()*H,
            vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
            r: Math.random()*1.2+.4, a: Math.random()*.4+.1
        });
        function loop() {
            ctx.clearRect(0,0,W,H);
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x<0||p.x>W) p.vx*=-1;
                if (p.y<0||p.y>H) p.vy*=-1;
                for (let j = i+1; j < pts.length; j++) {
                    const q = pts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
                    if (d < 110) {
                        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
                        ctx.strokeStyle = `rgba(0,200,255,${0.07*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke();
                    }
                }
                ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
                ctx.fillStyle = `rgba(0,200,255,${p.a})`; ctx.fill();
            }
            raf = requestAnimationFrame(loop);
        }
        loop();
    }

    /* ── 2. JSON TYPEWRITER ── */
    const jsonEl = document.getElementById('ab3-json');
    if (jsonEl && !jsonEl._typed) {
        jsonEl._typed = true;
        const lines = [
            `<span style="color:rgba(255,255,255,0.3)">{</span>`,
            `  <span style="color:#61afef">"name"</span><span style="color:rgba(255,255,255,0.3)">: </span><span style="color:#98c379">"Hasibul Islam"</span><span style="color:rgba(255,255,255,0.3)">,</span>`,
            `  <span style="color:#61afef">"role"</span><span style="color:rgba(255,255,255,0.3)">: </span><span style="color:#98c379">"Android Developer"</span><span style="color:rgba(255,255,255,0.3)">,</span>`,
            `  <span style="color:#61afef">"location"</span><span style="color:rgba(255,255,255,0.3)">: </span><span style="color:#98c379">"Dhaka, Bangladesh 🇧🇩"</span><span style="color:rgba(255,255,255,0.3)">,</span>`,
            `  <span style="color:#61afef">"cert"</span><span style="color:rgba(255,255,255,0.3)">: </span><span style="color:#98c379">"NSDA Level-4"</span><span style="color:rgba(255,255,255,0.3)">,</span>`,
            `  <span style="color:#61afef">"open"</span><span style="color:rgba(255,255,255,0.3)">: </span><span style="color:#0095ff">true</span>`,
            `<span style="color:rgba(255,255,255,0.3)">}</span>`,
        ];
        let i = 0;
        function dropLine() {
            if (i >= lines.length) return;
            const div = document.createElement('div');
            div.innerHTML = lines[i];
            div.style.cssText = 'opacity:0;transform:translateY(4px);transition:opacity .3s ease,transform .3s ease;';
            jsonEl.appendChild(div);
            requestAnimationFrame(() => requestAnimationFrame(() => { div.style.opacity='1'; div.style.transform='translateY(0)'; }));
            i++;
            setTimeout(dropLine, 150);
        }
        setTimeout(dropLine, 400);
    }

    /* ── 3. ROLE TYPEWRITER ── */
    const roleEl = document.getElementById('ab3-role');
    if (roleEl && !roleEl._typed) {
        roleEl._typed = true;
        const roles = ['Android Developer','Kotlin & Jetpack Compose','Firebase Specialist','MVVM Architecture','NSDA Certified'];
        let ri = 0, ci = 0, deleting = false;
        function typeRole() {
            const word = roles[ri];
            if (!deleting) {
                ci++; roleEl.textContent = word.slice(0,ci);
                if (ci === word.length) { deleting=true; setTimeout(typeRole,1800); return; }
            } else {
                ci--; roleEl.textContent = word.slice(0,ci);
                if (ci === 0) { deleting=false; ri=(ri+1)%roles.length; }
            }
            setTimeout(typeRole, deleting ? 42 : 78);
        }
        setTimeout(typeRole, 700);
    }

    /* ── 4. LIVE LOCAL TIME (Dhaka UTC+6) ── */
    const timeEl = document.getElementById('ab3-time');
    if (timeEl && !timeEl._ticking) {
        timeEl._ticking = true;
        function tick() {
            const now = new Date();
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            const dhaka = new Date(utc + 6 * 3600000);
            const h = String(dhaka.getHours()).padStart(2,'0');
            const m = String(dhaka.getMinutes()).padStart(2,'0');
            const s = String(dhaka.getSeconds()).padStart(2,'0');
            timeEl.textContent = `${h}:${m}:${s}`;
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ── 5. STAT COUNTERS ── */
    const statsEl = document.getElementById('ab3-stats');
    if (statsEl && !statsEl._counted) {
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            statsEl._counted = true;
            io.disconnect();
            statsEl.classList.add('ab3-stats--counted');
            statsEl.querySelectorAll('.ab3-stat').forEach(stat => {
                const target = parseInt(stat.dataset.target, 10);
                const countEl = stat.querySelector('[data-count]');
                if (!countEl) return;
                let cur = 0;
                const step = Math.ceil(target / 40);
                const iv = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    countEl.textContent = cur;
                    if (cur >= target) clearInterval(iv);
                }, 30);
            });
        }, { threshold: 0.3 });
        io.observe(statsEl);
    }

    /* ── 6. SKILLS TABS + INK INDICATOR ── */
    const tabs   = page.querySelectorAll('.ab3-tab');
    const panels = page.querySelectorAll('.ab3-spanel');
    const ink    = document.getElementById('ab3-tab-ink');

    function moveInk(tab) {
        if (!ink) return;
        const cr = tab.closest('.ab3-tabs').getBoundingClientRect();
        const tr = tab.getBoundingClientRect();
        ink.style.left  = (tr.left - cr.left) + 'px';
        ink.style.width = tr.width + 'px';
    }

    function switchTab(name) {
        tabs.forEach(t => t.classList.toggle('ab3-tab--on', t.dataset.tab === name));
        panels.forEach(p => {
            const on = p.dataset.panel === name;
            p.classList.toggle('ab3-spanel--on', on);
            if (on) {
                p.querySelectorAll('.ab3-sk-bar').forEach(bar => {
                    bar.style.transition = 'none';
                    bar.style.width = '0';
                    bar.offsetHeight;
                    bar.style.transition = '';
                    bar.style.width = bar.style.getPropertyValue('--w') || getComputedStyle(bar).getPropertyValue('--w');
                });
            }
        });
        const activeTab = [...tabs].find(t => t.dataset.tab === name);
        if (activeTab) moveInk(activeTab);
    }

    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    setTimeout(() => {
        const firstOn = page.querySelector('.ab3-tab--on');
        if (firstOn) moveInk(firstOn);
    }, 120);
}
