/**
 * Custom cursor: a small dot that tracks the pointer exactly and a trailing
 * ring that lerps behind it. Interactive targets marked with data-hover grow
 * the ring. Disabled on coarse (touch) pointers by CSS.
 */
export function mountCursor(host: HTMLElement): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  host.append(dot, ring);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let visible = false;

  window.addEventListener('pointermove', (ev) => {
    mx = ev.clientX;
    my = ev.clientY;
    if (!visible) {
      visible = true;
      rx = mx;
      ry = my;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    const target = ev.target as HTMLElement | null;
    const interactive = target !== null && target.closest('a, button, [data-hover="1"]');
    ring.classList.toggle('grow', interactive !== null);
  });

  window.addEventListener('pointerdown', () => ring.classList.add('grow'));
  window.addEventListener('pointerup', () => ring.classList.remove('grow'));
  document.documentElement.addEventListener('pointerleave', () => {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  dot.style.opacity = '0';
  ring.style.opacity = '0';

  const frame = (): void => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
