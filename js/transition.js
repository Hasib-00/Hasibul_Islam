/* ══════════════════════════════════════
   TRANSITION ENGINE v9 — CLI / CODE EDITOR

   COVER  — Two panels (top + bottom) slam in
            from off-screen, meeting at the center.
            On the panels: scrolling green code lines.
            Center seam: a glowing terminal prompt
            types out the page route like a CLI command.
            Cursor blinks. Command executes.

   REVEAL — Panels retract outward (top up, bottom down)
            with a horizontal neon split-line at center
            that races across and then fades, leaving
            the new page underneath.
══════════════════════════════════════ */

const ROUTES = {
    'page-home'   : { cmd: 'cd ~/',              label: 'Home' },
    'page-about'  : { cmd: 'cd ./about',         label: 'About' },
    'page-work'   : { cmd: 'cd ./work',          label: 'Work' },
    'page-contact': { cmd: 'cd ./contact',       label: 'Contact' },
};

/* ─── Code snippets that scroll on panels ─── */
const CODE_LINES = [
    'import { useState, useEffect } from "react"',
    'const router = new SpaRouter()',
    'export default function Portfolio() {',
    '  const [page, setPage] = useState("home")',
    '  useEffect(() => { router.init() }, [])',
    '  return <main data-page={page} />',
    '}',
    'git commit -m "feat: new page transition"',
    'npm run build — ✓ compiled in 340ms',
    'const animate = (t) => easeOut5(t) * maxR',
    '// TODO: make this look incredible',
    'border-radius: var(--radius-card)',
    'transform: translateY(0) scale(1)',
    '> hasibul@portfolio ~ % ls -la',
    'drwxr-xr-x  about  contact  work  home',
    'const { x, y } = useMousePosition()',
    'backdrop-filter: blur(20px) saturate(180%)',
    'git push origin main → deployed ✓',
    'cursor: none; /* custom cursor only */',
    'z-index: 9500; /* above everything */',
    'export { coverScreen, revealScreen }',
    '[ ████████████████████ ] 100% done',
    'window.performance.mark("transition-end")',
    'font-family: "Syne", sans-serif',
    'const spring = cubic-bezier(.16,1,.3,1)',
];

/* ─── DOM ─────────────────────────────── */
const overlay = document.getElementById('page-transition');
overlay.innerHTML = '';
overlay.style.cssText =
    'position:fixed;inset:0;z-index:9500;pointer-events:none;overflow:hidden;';

/* Style injection */
const ST = document.createElement('style');
ST.textContent = `
#pt-cursor { display:inline-block; width:.55em; height:1.1em;
  background:#00c8ff; vertical-align:middle; margin-left:2px;
  animation: ptBlink .55s step-end infinite; }
@keyframes ptBlink { 0%,100%{opacity:1} 50%{opacity:0} }
#pt-panel-top, #pt-panel-bot {
  position:absolute; left:0; right:0; overflow:hidden;
  background:#0d0d0f; z-index:2; }
#pt-panel-top { top:0; transform:translateY(-100%); }
#pt-panel-bot { bottom:0; transform:translateY(100%); }
#pt-seam {
  position:absolute; left:0; right:0; top:50%;
  transform:translateY(-50%); z-index:10;
  pointer-events:none; }
#pt-seam-line {
  height:1px; width:100%;
  background:linear-gradient(90deg,transparent,#00c8ff 20%,#7c6aff 50%,#38bdf8 80%,transparent);
  opacity:0; }
#pt-terminal {
  padding:.5rem 0 .5rem;
  display:flex; align-items:center; justify-content:center;
  gap:.5rem; opacity:0; }
#pt-prompt {
  font-family:'Courier New',monospace; font-size:clamp(.7rem,1.3vw,1rem);
  color:rgba(0,200,255,.7); white-space:nowrap; }
#pt-cmd {
  font-family:'Courier New',monospace; font-size:clamp(.75rem,1.4vw,1.05rem);
  color:#fff; white-space:nowrap; letter-spacing:.02em; }
#pt-name-display {
  position:absolute; left:50%; top:50%;
  transform:translate(-50%,-50%) translateY(-3.5rem);
  z-index:11; text-align:center; pointer-events:none;
  opacity:0; }
`;
document.head.appendChild(ST);

/* Panels */
const panelTop = document.createElement('div');
panelTop.id = 'pt-panel-top';
overlay.appendChild(panelTop);

const panelBot = document.createElement('div');
panelBot.id = 'pt-panel-bot';
overlay.appendChild(panelBot);

/* Center seam */
const seam     = document.createElement('div'); seam.id = 'pt-seam';
const seamLine = document.createElement('div'); seamLine.id = 'pt-seam-line';
const terminal = document.createElement('div'); terminal.id = 'pt-terminal';
terminal.innerHTML = `
  <span id="pt-prompt">hasibul@portfolio:~$</span>
  <span id="pt-cmd"></span><span id="pt-cursor"></span>
`;
seam.appendChild(seamLine);
seam.appendChild(terminal);
overlay.appendChild(seam);

/* Big page name (shown briefly after cmd completes) */
const nameDisplay = document.createElement('div');
nameDisplay.id = 'pt-name-display';
nameDisplay.innerHTML = `
  <div style="overflow:hidden;margin-bottom:.4rem;">
    <span id="pt-nd-sub" style="
      display:block;font-family:'Courier New',monospace;
      font-size:.58rem;letter-spacing:.4em;text-transform:uppercase;
      color:rgba(0,200,255,.7);transform:translateY(110%);transition:none;
    ">// route loaded</span>
  </div>
  <div style="overflow:hidden;padding:.08em 0 .2em;">
    <span id="pt-nd-name" style="
      display:block;font-family:'Syne',sans-serif;font-weight:900;
      font-size:clamp(3rem,8vw,8rem);letter-spacing:-.05em;
      color:#fff;transform:translateY(110%);transition:none;
      text-shadow:0 0 80px rgba(0,200,255,.15);
    "></span>
  </div>
`;
overlay.appendChild(nameDisplay);

/* Canvas for code rain on panels */
const cvTop = document.createElement('canvas');
cvTop.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.55;';
panelTop.appendChild(cvTop);

const cvBot = document.createElement('canvas');
cvBot.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:.55;';
panelBot.appendChild(cvBot);

const ctxTop = cvTop.getContext('2d');
const ctxBot = cvBot.getContext('2d');

let W, H, PH; /* PH = panel height = H/2 */
let coverRAF = null, revealRAF = null;
let codeRAF  = null;

function resize() {
    W  = window.innerWidth;
    H  = window.innerHeight;
    PH = Math.ceil(H / 2);
    panelTop.style.height = PH + 1 + 'px';
    panelBot.style.height = PH + 1 + 'px';
    cvTop.width  = cvBot.width  = W;
    cvTop.height = cvBot.height = PH;
}
resize();
window.addEventListener('resize', resize);

/* ─── Easing ─────────────────────────── */
const easeOut3  = t => 1 - Math.pow(1 - t, 3);
const easeOut5  = t => 1 - Math.pow(1 - t, 5);
const easeInOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

/* ─── Code rain on panels ─────────────── */
const COL_W   = 16;
const CHAR_H  = 14;
const CODE_CHARS = '01{}[]<>/=|\\;abcdef0123456789アイウ'.split('');
const rnd = () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];

function makeRainState(w, h) {
    const nCols = Math.ceil(w / COL_W);
    return Array.from({ length: nCols }, (_, i) => ({
        x:    i * COL_W,
        y:    -Math.random() * h,
        spd:  1.5 + Math.random() * 2,
        len:  6 + Math.floor(Math.random() * 12),
        chars: Array.from({ length: 20 }, () => rnd()),
    }));
}

let rainTop = [], rainBot = [];

function initRain() {
    rainTop = makeRainState(W, PH);
    rainBot = makeRainState(W, PH);
}

function drawRain(context, rain, w, h) {
    context.clearRect(0, 0, w, h);
    context.font = `${CHAR_H - 2}px "Courier New"`;
    rain.forEach(col => {
        col.y += col.spd;
        if (col.y - col.len * CHAR_H > h) {
            col.y = -Math.random() * h * .3;
            col.spd = 1.5 + Math.random() * 2;
            col.chars = col.chars.map(() => rnd());
        }
        if (Math.random() > .9) col.chars[0] = rnd();

        for (let i = 0; i < col.len; i++) {
            const cy  = col.y - i * CHAR_H;
            if (cy < 0 || cy > h) continue;
            const frac = i / col.len;
            const alpha = (1 - frac) * .7;
            const bright = i === 0;
            context.globalAlpha = bright ? .95 : alpha;
            context.fillStyle   = bright ? '#ffffff' : '#00c8ff';
            context.fillText(col.chars[i % col.chars.length], col.x, cy);
        }
        context.globalAlpha = 1;
    });
}

let rainActive = false;
function startRain() {
    initRain();
    rainActive = true;
    function tick() {
        if (!rainActive) return;
        drawRain(ctxTop, rainTop, W, PH);
        drawRain(ctxBot, rainBot, W, PH);
        codeRAF = requestAnimationFrame(tick);
    }
    codeRAF = requestAnimationFrame(tick);
}
function stopRain() {
    rainActive = false;
    cancelAnimationFrame(codeRAF);
    ctxTop.clearRect(0, 0, W, PH);
    ctxBot.clearRect(0, 0, W, PH);
}

/* ─── Typewriter ──────────────────────── */
let typeHandle = null;
function typeCmd(text, onDone) {
    clearTimeout(typeHandle);
    const el  = document.getElementById('pt-cmd');
    el.textContent = '';
    let i = 0;
    const PER = 38;
    function next() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            typeHandle = setTimeout(next, PER);
        } else {
            onDone && onDone();
        }
    }
    typeHandle = setTimeout(next, 80);
}

/* ─── COVER ───────────────────────────── */
function runCover(targetId) {
    return new Promise(resolve => {
        cancelAnimationFrame(coverRAF);
        cancelAnimationFrame(revealRAF);
        stopRain();

        resize();
        overlay.style.pointerEvents = 'all';

        const route = ROUTES[targetId] || { cmd: 'cd ./page', label: 'Page' };

        /* Reset everything */
        panelTop.style.transition = panelBot.style.transition = 'none';
        panelTop.style.transform  = 'translateY(-100%)';
        panelBot.style.transform  = 'translateY(100%)';
        seamLine.style.opacity    = '0';
        seamLine.style.transition = 'none';
        terminal.style.opacity    = '0';
        terminal.style.transition = 'none';
        nameDisplay.style.opacity = '0';
        nameDisplay.style.transition = 'none';
        document.getElementById('pt-cmd').textContent = '';
        document.getElementById('pt-nd-name').textContent = route.label;

        const sub  = document.getElementById('pt-nd-sub');
        const name = document.getElementById('pt-nd-name');
        sub.style.transition  = name.style.transition = 'none';
        sub.style.transform   = 'translateY(110%)';
        name.style.transform  = 'translateY(110%)';

        /* Phase timings */
        const SLIDE_DUR  = 320;  /* panels slide in */
        const SEAM_DELAY = 260;  /* when seam line appears */
        const CMD_DELAY  = 340;  /* when typing starts */
        const CMD_LEN    = route.cmd.length * 38 + 120;
        const NAME_DELAY = CMD_DELAY + CMD_LEN;  /* big name reveal */
        const NAME_DUR   = 260;
        const RESOLVE_AFTER = NAME_DELAY + NAME_DUR + 120;

        startRain();

        /* Slide panels in */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const ease = 'cubic-bezier(0.76,0,0.24,1)';
                panelTop.style.transition = `transform ${SLIDE_DUR}ms ${ease}`;
                panelBot.style.transition = `transform ${SLIDE_DUR}ms ${ease}`;
                panelTop.style.transform  = 'translateY(0)';
                panelBot.style.transform  = 'translateY(0)';
            });
        });

        /* Seam line flashes in */
        setTimeout(() => {
            seamLine.style.transition = 'opacity .18s ease';
            seamLine.style.opacity    = '1';
        }, SEAM_DELAY);

        /* Terminal prompt fades in, then types */
        setTimeout(() => {
            terminal.style.transition = 'opacity .2s ease';
            terminal.style.opacity    = '1';
            typeCmd(route.cmd, () => {
                /* ── Command "executed" — show success then big name ── */
                const cmdEl = document.getElementById('pt-cmd');
                cmdEl.style.color = '#00c8ff';
                /* Hide cursor */
                document.getElementById('pt-cursor').style.display = 'none';
            });
        }, CMD_DELAY);

        /* Big page name rises */
        setTimeout(() => {
            nameDisplay.style.transition = 'opacity .15s ease';
            nameDisplay.style.opacity    = '1';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sub.style.transition  = 'transform .3s cubic-bezier(.16,1,.3,1)';
                    name.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1) .07s';
                    sub.style.transform   = 'translateY(0)';
                    name.style.transform  = 'translateY(0)';
                });
            });
        }, NAME_DELAY);

        setTimeout(() => {
            stopRain();
            resolve();
        }, RESOLVE_AFTER);
    });
}

/* ─── REVEAL ──────────────────────────── */
function runReveal() {
    return new Promise(resolve => {
        cancelAnimationFrame(coverRAF);
        cancelAnimationFrame(revealRAF);

        const SLIDE_DUR = 480;
        const ease      = 'cubic-bezier(0.16,1,0.3,1)';

        /* Fade label out */
        nameDisplay.style.transition = 'opacity .18s ease';
        nameDisplay.style.opacity    = '0';
        terminal.style.transition    = 'opacity .15s ease';
        terminal.style.opacity       = '0';

        setTimeout(() => {
            /* Seam line pulses bright then fades */
            seamLine.style.transition = 'opacity .12s ease';
            seamLine.style.opacity    = '1';
            setTimeout(() => {
                seamLine.style.transition = 'opacity .3s ease';
                seamLine.style.opacity    = '0';
            }, 80);

            /* Panels retract — top goes up, bottom goes down */
            panelTop.style.transition = `transform ${SLIDE_DUR}ms ${ease}`;
            panelBot.style.transition = `transform ${SLIDE_DUR}ms ${ease}`;
            panelTop.style.transform  = 'translateY(-100%)';
            panelBot.style.transform  = 'translateY(100%)';

            /* Restore cursor for next time */
            document.getElementById('pt-cursor').style.display = 'inline-block';
        }, 120);

        setTimeout(() => {
            overlay.style.pointerEvents = 'none';
            resolve();
        }, 120 + SLIDE_DUR + 60);
    });
}

/* ─── Public API ─────────────────────── */
export function coverScreen(targetId)  { return runCover(targetId); }
export function revealScreen()         { return runReveal(); }
export function introReveal()          { return Promise.resolve(); }
