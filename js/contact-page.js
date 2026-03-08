/* ══════════════════════════════════════
   CONTACT PAGE  (cp-*)
   1. Particle canvas (matrix rain style)
   2. Live clock
   3. Form interactions — REAL EmailJS send
══════════════════════════════════════ */

/* ─────────────────────────────────────
   ★  YOUR EMAILJS CREDENTIALS
      Replace the three values below after
      you complete the EmailJS setup steps.
   ───────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = '7mx0z0-UHMZtY_L3x';   // step 2
const EMAILJS_SERVICE_ID  = 'service_lxb7y3n';   // step 3
const EMAILJS_TEMPLATE_ID = 'template_qy9e85g';  // step 4

export function initContactPage() {
    const page = document.getElementById('page-contact');
    if (!page) return;

    /* ── 1. Matrix rain canvas ── */
    const canvas = document.getElementById('cp-canvas');
    if (canvas && !canvas._inited) {
        canvas._inited = true;
        const ctx = canvas.getContext('2d');
        let W, H, cols, drops;
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]()=>const let async await function'.split('');
        const fontSize = 13;

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            cols  = Math.floor(W / fontSize);
            drops = Array(cols).fill(1);
        }
        resize();
        window.addEventListener('resize', resize);

        function draw() {
            ctx.fillStyle = 'rgba(4,4,10,0.065)';
            ctx.fillRect(0, 0, W, H);
            for (let i = 0; i < cols; i++) {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                const alpha = Math.random() > 0.95 ? 0.9 : 0.15;
                ctx.fillStyle = `rgba(0,200,255,${alpha})`;
                ctx.font = `${fontSize}px Courier New`;
                ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(draw, 55);
    }

    /* ── 2. Clock ── */
    const clockEl = document.getElementById('cp-clock');
    if (clockEl && !clockEl._running) {
        clockEl._running = true;
        setInterval(() => {
            const now = new Date();
            const pad = n => String(n).padStart(2,'0');
            clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }, 1000);
    }

    /* ── 3. Form interactions ── */
    const form     = document.getElementById('cp-form');
    const msgEl    = document.getElementById('cp-msg');
    const charsEl  = document.getElementById('cp-chars');
    const submitEl = document.getElementById('cp-submit');
    const idleEl   = submitEl?.querySelector('.cp-submit-idle');
    const loadEl   = submitEl?.querySelector('.cp-submit-loading');
    const doneEl   = submitEl?.querySelector('.cp-submit-done');

    if (msgEl && charsEl) {
        msgEl.addEventListener('input', () => {
            const len = msgEl.value.length;
            charsEl.textContent = `${len} / 500 chars`;
            charsEl.style.color = len > 450
                ? 'rgba(245,158,11,0.6)'
                : 'rgba(255,255,255,0.18)';
        });
    }

    if (form && submitEl) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = document.getElementById('cp-name')?.value.trim();
            const email   = document.getElementById('cp-email')?.value.trim();
            const subject = document.getElementById('cp-subject')?.value.trim();
            const message = msgEl?.value.trim();

            if (!name || !email || !message) {
                _termOutput('⚠ Please fill in name, email and message.', 'rgba(245,158,11,0.85)');
                return;
            }

            /* Show loading */
            if (idleEl) idleEl.style.display = 'none';
            if (loadEl) loadEl.style.display = 'inline-flex';
            submitEl.disabled = true;

            try {
                /* ── EmailJS send ── */
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        from_name:  name,
                        from_email: email,
                        subject:    subject || '(no subject)',
                        message:    message,
                        reply_to:   email,
                        to_name:    'Hasibul',
                    },
                    EMAILJS_PUBLIC_KEY
                );

                /* Success */
                if (loadEl) loadEl.style.display = 'none';
                if (doneEl) doneEl.style.display = 'inline-flex';
                submitEl.style.background = 'rgba(0,200,255,0.15)';
                submitEl.style.color      = '#00c8ff';
                submitEl.style.border     = '1px solid rgba(0,200,255,0.3)';
                _termOutput("✓ Message transmitted — I'll reply within 24 hours!", '#00c8ff');
                form.reset();
                if (charsEl) charsEl.textContent = '0 / 500 chars';

            } catch (err) {
                /* Error */
                if (loadEl) loadEl.style.display = 'none';
                if (idleEl) idleEl.style.display = 'inline-flex';
                submitEl.disabled = false;
                _termOutput('✗ Send failed — please email directly: mhhasibul.is@gmail.com', 'rgba(255,95,86,0.85)');
                console.error('[EmailJS error]', err);
            }
        });
    }

    function _termOutput(text, color) {
        const body = document.querySelector('.cp-term-body');
        if (!body) return;
        const div = document.createElement('div');
        div.className = 'cp-term-output';
        div.style.marginTop = '0.8rem';
        div.style.color = color || 'inherit';
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }
}
