/**
 * The cybernetic mask: a canvas-drawn half-face mask that glides after the
 * cursor across the portrait, like a cyborg visor being placed on the face.
 * Everything is drawn procedurally, so there is no image asset to ship.
 */

type MaskState = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  a: number;
  ta: number;
};

export function mountPortraitMask(portraitCanvas: HTMLElement): void {
  // Touch has no cursor to follow; the static HUD layer covers that case.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-mask-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  portraitCanvas.append(canvas);

  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = (): void => {
    canvas.width = Math.max(1, Math.round(portraitCanvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(portraitCanvas.clientHeight * dpr));
  };
  size();
  window.addEventListener('resize', size);

  const m: MaskState = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0 };
  let running = false;

  const tick = (): void => {
    m.x += (m.tx - m.x) * 0.16;
    m.y += (m.ty - m.y) * 0.16;
    m.a += (m.ta - m.a) * 0.09;
    // the mask leans toward where the cursor is still travelling
    const sway = Math.max(-0.18, Math.min(0.18, (m.tx - m.x) * 0.012));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (m.a > 0.01) {
      drawMask(ctx, m.x, m.y, m.a, sway);
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  };
  const wake = (): void => {
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  };

  portraitCanvas.addEventListener('pointerenter', (ev) => {
    const rect = portraitCanvas.getBoundingClientRect();
    m.x = ev.clientX - rect.left;
    m.y = ev.clientY - rect.top;
    m.tx = m.x;
    m.ty = m.y;
    m.ta = 1;
    wake();
  });
  portraitCanvas.addEventListener('pointermove', (ev) => {
    const rect = portraitCanvas.getBoundingClientRect();
    m.tx = ev.clientX - rect.left;
    m.ty = ev.clientY - rect.top;
    m.ta = 1;
    wake();
  });
  portraitCanvas.addEventListener('pointerleave', () => {
    m.ta = 0;
    wake();
  });
}

/** Draws one frame: the mask sprite centered at (cx, cy), faded by alpha. */
function drawMask(ctx: CanvasRenderingContext2D, cx: number, cy: number, alpha: number, sway: number): void {
  const s = Math.min(300, Math.max(190, canvasHeight(ctx) * 0.5));
  const tilt = -0.26 + sway;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy - s * 0.04);
  ctx.rotate(tilt);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // ambient glow halo behind the plate
  const halo = ctx.createRadialGradient(0, 0, s * 0.1, 0, 0, s * 0.85);
  halo.addColorStop(0, 'rgba(255,255,255,0.22)');
  halo.addColorStop(0.55, 'rgba(255,255,255,0.06)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // helmet plate: an angular half-mask shield
  const plate = new Path2D();
  plate.moveTo(-0.30 * s, -0.50 * s);
  plate.quadraticCurveTo(0.02 * s, -0.62 * s, 0.32 * s, -0.42 * s);
  plate.quadraticCurveTo(0.42 * s, -0.10 * s, 0.34 * s, 0.14 * s);
  plate.quadraticCurveTo(0.26 * s, 0.42 * s, 0.04 * s, 0.56 * s);
  plate.quadraticCurveTo(-0.22 * s, 0.46 * s, -0.32 * s, 0.16 * s);
  plate.quadraticCurveTo(-0.40 * s, -0.14 * s, -0.30 * s, -0.50 * s);
  plate.closePath();

  const plateFill = ctx.createLinearGradient(-0.35 * s, -0.5 * s, 0.35 * s, 0.55 * s);
  plateFill.addColorStop(0, 'rgba(8,8,10,1)');
  plateFill.addColorStop(0.55, 'rgba(15,15,19,1)');
  plateFill.addColorStop(1, 'rgba(4,4,6,1)');
  ctx.fillStyle = plateFill;
  ctx.fill(plate);

  // faint carbon weave on the plate
  ctx.save();
  ctx.clip(plate);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(i * s * 0.09 - s * 0.5, s * 0.6);
    ctx.lineTo(i * s * 0.09 + s * 0.5, -s * 0.6);
    ctx.stroke();
  }
  ctx.restore();

  // glowing rim, plus an inner machined rim line
  ctx.shadowColor = 'rgba(255,255,255,0.85)';
  ctx.shadowBlur = s * 0.06;
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = Math.max(1.4, s * 0.012);
  ctx.stroke(plate);
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.translate(0, 0);
  ctx.scale(0.94, 0.94);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1;
  ctx.stroke(plate);
  ctx.restore();

  // lens: the big bright eye, tilted and overflowing the brow like a visor
  const lens = new Path2D();
  lens.moveTo(-0.24 * s, -0.18 * s);
  lens.quadraticCurveTo(-0.04 * s, -0.44 * s, 0.28 * s, -0.26 * s);
  lens.quadraticCurveTo(0.36 * s, -0.06 * s, 0.14 * s, 0.06 * s);
  lens.quadraticCurveTo(-0.10 * s, 0.12 * s, -0.24 * s, -0.18 * s);
  lens.closePath();

  const lensFill = ctx.createRadialGradient(0.04 * s, -0.2 * s, s * 0.01, 0.02 * s, -0.16 * s, s * 0.34);
  lensFill.addColorStop(0, 'rgba(255,255,255,1)');
  lensFill.addColorStop(0.55, 'rgba(240,240,245,1)');
  lensFill.addColorStop(1, 'rgba(168,168,178,1)');
  ctx.fillStyle = lensFill;
  ctx.shadowColor = 'rgba(255,255,255,0.95)';
  ctx.shadowBlur = s * 0.11;
  ctx.fill(lens);
  ctx.shadowBlur = 0;

  // web texture clipped inside the lens
  ctx.save();
  ctx.clip(lens);
  ctx.strokeStyle = 'rgba(15,15,20,0.6)';
  ctx.lineWidth = Math.max(0.8, s * 0.007);
  for (let i = 0; i < 8; i++) {
    const ang = -2.2 + i * 0.44;
    ctx.beginPath();
    ctx.moveTo(0.02 * s + Math.cos(ang) * s * 0.05, -0.16 * s + Math.sin(ang) * s * 0.05);
    ctx.lineTo(0.02 * s + Math.cos(ang) * s * 0.45, -0.16 * s + Math.sin(ang) * s * 0.45);
    ctx.stroke();
  }
  for (let r = 0.09; r <= 0.36; r += 0.09) {
    ctx.beginPath();
    ctx.arc(0.02 * s, -0.16 * s, r * s, -2.6, 0.8);
    ctx.stroke();
  }
  ctx.restore();

  // lens rim
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = Math.max(1.2, s * 0.01);
  ctx.stroke(lens);

  // armor facet seams radiating from the lens to the rim
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = Math.max(1, s * 0.007);
  ctx.beginPath();
  ctx.moveTo(0.30 * s, -0.24 * s);
  ctx.lineTo(0.40 * s, 0.02 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0.16 * s, 0.05 * s);
  ctx.lineTo(0.30 * s, 0.30 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-0.20 * s, -0.14 * s);
  ctx.lineTo(-0.32 * s, 0.02 * s);
  ctx.stroke();

  // circuit traces running down from the lens
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = Math.max(1, s * 0.008);
  ctx.shadowColor = 'rgba(255,255,255,0.7)';
  ctx.shadowBlur = s * 0.03;
  const traces: number[][][] = [
    [[0.16, -0.02], [0.24, 0.10], [0.20, 0.24]],
    [[0.04, 0.06], [0.06, 0.22], [0.00, 0.36]],
    [[-0.10, -0.04], [-0.18, 0.10], [-0.14, 0.28]]
  ];
  for (const tr of traces) {
    ctx.beginPath();
    tr.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px * s, py * s);
      else ctx.lineTo(px * s, py * s);
    });
    ctx.stroke();
    const [lx, ly] = tr[tr.length - 1];
    ctx.beginPath();
    ctx.arc(lx * s, ly * s, Math.max(1.5, s * 0.012), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  // vent greebles near the jaw
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = Math.max(1, s * 0.007);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo((-0.16 + i * 0.07) * s, 0.40 * s);
    ctx.lineTo((-0.12 + i * 0.07) * s, 0.48 * s);
    ctx.stroke();
  }

  ctx.restore();
}

function canvasHeight(ctx: CanvasRenderingContext2D): number {
  // drawing uses CSS pixels via the dpr transform, so read the backing scale back
  const t = ctx.getTransform();
  return t.a !== 0 ? ctx.canvas.height / t.a : ctx.canvas.height;
}
