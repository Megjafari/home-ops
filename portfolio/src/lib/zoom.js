import { NAME, nameFont, clamp, reduced } from "./index.js";

/*
  The name zooms in as you scroll, until the color of one letter fills the screen.

  A tall track holds a sticky, viewport-high stage. The canvas redraws the name larger
  on every scroll step, aiming at the thickest point of a letter. The exponential
  zoom ends once that point's inscribed circle covers the whole screen, and the
  screen is then simply filled with the letter's color, which is also the background
  of the next scene.
*/

const P0 = 0.12; // the zoom runs between these scroll positions
const P1 = 0.88; // the first and last stretch hold still

// Chamfer distance transform: for every ink pixel, the distance to the nearest edge (3 units per pixel).
function distanceField(mask, w, h) {
  const d = new Float32Array(w * h);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? 1e9 : 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = d[i];
      if (!v) continue;
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      if (y > 0) {
        v = Math.min(v, d[i - w] + 3);
        if (x > 0) v = Math.min(v, d[i - w - 1] + 4);
        if (x < w - 1) v = Math.min(v, d[i - w + 1] + 4);
      }
      d[i] = v;
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = d[i];
      if (!v) continue;
      if (x < w - 1) v = Math.min(v, d[i + 1] + 3);
      if (y < h - 1) {
        v = Math.min(v, d[i + w] + 3);
        if (x < w - 1) v = Math.min(v, d[i + w + 1] + 4);
        if (x > 0) v = Math.min(v, d[i + w - 1] + 4);
      }
      d[i] = v;
    }
  }
  return d;
}

export function createZoom({ track, sticky, canvas, glow, extras }) {
  const ctx = canvas.getContext("2d");
  let G = null;
  let target = 0;
  let current = 0;
  let raf = 0;
  let settle = 0;
  let ink = "#f1e8dd";

  const dprFull = () => Math.min(window.devicePixelRatio || 1, 2);
  const dprMove = () => Math.min(dprFull(), 1.25); // lighter canvas while it moves, sharp when it stops

  const readColors = () => {
    ink = getComputedStyle(document.documentElement).getPropertyValue("--ink-hero").trim() || ink;
  };

  function measure() {
    const vw = sticky.clientWidth;
    const vh = sticky.clientHeight;
    const dpr = dprFull();
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);

    // 1. Size the name so it is 70% of the width (90% on phones).
    const startW = vw < 720 ? vw * 0.9 : vw * 0.7;
    ctx.font = nameFont(100);
    const F = (100 * startW) / ctx.measureText(NAME).width;
    ctx.font = nameFont(F);
    const m = ctx.measureText(NAME);
    const x0 = (vw - m.width) / 2;
    const y0 = vh * 0.46 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;

    // 2. Rasterize the name once, larger, and find the thickest part of a letter.
    const P = 280;
    const pad = 24;
    const mc = document.createElement("canvas");
    let mctx = mc.getContext("2d", { willReadFrequently: true });
    mctx.font = nameFont(P);
    const mm = mctx.measureText(NAME);
    const mw = Math.ceil(mm.width) + pad * 2;
    const mh = Math.ceil(mm.actualBoundingBoxAscent + mm.actualBoundingBoxDescent) + pad * 2;
    mc.width = mw;
    mc.height = mh;
    mctx = mc.getContext("2d", { willReadFrequently: true });
    mctx.font = nameFont(P);
    mctx.fillStyle = "#000";
    mctx.textBaseline = "alphabetic";
    const base = pad + mm.actualBoundingBoxAscent;
    mctx.fillText(NAME, pad, base);
    const px = mctx.getImageData(0, 0, mw, mh).data;
    const mask = new Uint8Array(mw * mh);
    for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4 + 3] > 128 ? 1 : 0;
    const dist = distanceField(mask, mw, mh);
    let best = 0;
    let bx = mw / 2;
    let by = base - P * 0.3;
    const xa = Math.floor(pad + 0.28 * mm.width);
    const xb = Math.ceil(pad + 0.78 * mm.width);
    for (let y = 0; y < mh; y++) {
      for (let x = xa; x < xb; x++) {
        const v = dist[y * mw + x];
        if (v > best) {
          best = v;
          bx = x;
          by = y;
        }
      }
    }

    // The final frames are drawn from this same raster size, so the point measured
    // above is exactly the point that is zoomed into (a small layout difference between
    // two font sizes would otherwise be magnified by the zoom and miss the letter).
    const k = F / P;
    const radius = Math.max((best / 3) * k, F * 0.02);
    const fx = (bx - pad) * k;
    const fy = (by - base) * k;
    const sEnd = (Math.hypot(vw, vh) / 2 / radius) * 1.08;
    G = {
      vw, vh, dpr, k, P, sEnd,
      px: bx - pad,
      py: by - base,
      N: { x: x0 + fx, y: y0 + fy },
      C: { x: vw / 2, y: vh / 2 },
    };
  }

  function draw(p) {
    if (!G) return;
    const t = clamp((p - P0) / (P1 - P0), 0, 1);
    const smooth = t * t * (3 - 2 * t);
    const e = reduced ? 0 : 0.55 * t + 0.45 * smooth; // mostly steady in log scale, soft at both ends
    const s = Math.exp(Math.log(G.sEnd) * e);
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.clearRect(0, 0, G.vw, G.vh);
    ctx.fillStyle = ink;
    if (e > 0.9995) {
      ctx.fillRect(0, 0, G.vw, G.vh); // inside the letter: the screen is its color
    } else {
      const fxs = G.N.x + (G.C.x - G.N.x) * e;
      const fys = G.N.y + (G.C.y - G.N.y) * e;
      ctx.translate(fxs, fys);
      ctx.scale(s * G.k, s * G.k);
      ctx.translate(-G.px, -G.py);
      ctx.font = nameFont(G.P);
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillText(NAME, 0, 0);
    }
    glow.style.opacity = String(1 - clamp(t * 1.5, 0, 1));
    extras.style.opacity = String(1 - clamp(t * 7, 0, 1));
    extras.style.transform = `translate3d(0, ${(-t * 40).toFixed(1)}px, 0)`;
  }

  const progress = () => {
    const range = track.offsetHeight - (G ? G.vh : sticky.clientHeight);
    return range > 0 ? clamp(-track.getBoundingClientRect().top / range, 0, 1) : 0;
  };

  function loop() {
    current += (target - current) * 0.34; // a little inertia, short enough not to feel late
    if (Math.abs(target - current) < 0.0003) current = target;
    draw(current);
    raf = current === target ? 0 : requestAnimationFrame(loop);
  }

  function setResolution(dpr) {
    if (!G || G.dpr === dpr) return;
    G.dpr = dpr;
    canvas.width = Math.round(G.vw * dpr);
    canvas.height = Math.round(G.vh * dpr);
  }

  function onScroll() {
    if (reduced) return;
    if (G && G.dpr !== dprMove()) {
      setResolution(dprMove());
      draw(current);
    }
    clearTimeout(settle);
    settle = setTimeout(() => {
      setResolution(dprFull());
      draw(current);
    }, 180);
    target = progress();
    if (!raf) raf = requestAnimationFrame(loop);
  }

  let alive = true;
  const start = () => {
    if (!alive) return;
    measure();
    readColors();
    current = target = progress();
    draw(current);
  };

  const fontsReady = () =>
    Promise.all([document.fonts.load(nameFont(40)), document.fonts.load('300 40px "Inter Variable"')])
      .catch(() => {})
      .then(() => document.fonts.ready);

  readColors();
  fontsReady().then(start);
  window.addEventListener("scroll", onScroll, { passive: true });
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 120);
  };
  window.addEventListener("resize", onResize);

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    },
    // Draw a single frame (used to check the zoom without scrolling).
    drawAt(p) {
      current = target = p;
      draw(p);
    },
  };
}
