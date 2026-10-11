/**
 * Custom cursor, three states like the reference site:
 *  1. default: small dot (exact tracking) + trailing ring;
 *  2. link hover: ring grows;
 *  3. card hover ([data-target]): the ring becomes four corner brackets that
 *     snap around the hovered element's bounding box, lerping between targets.
 * Disabled on coarse (touch) pointers.
 */
export function mountCursor(host: HTMLElement): void {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const target = document.createElement('div');
  target.className = 'cursor-target';
  target.innerHTML =
    '<span class="ct c-tl"></span><span class="ct c-tr"></span>' +
    '<span class="ct c-bl"></span><span class="ct c-br"></span>';
  host.append(dot, ring, target);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  // bracket box state (position + size lerped toward the hovered element)
  let bx = mx;
  let by = my;
  let bw = 0;
  let bh = 0;

  const applyBox = (): void => {
    target.style.transform = `translate(${bx}px, ${by}px)`;
    target.style.width = `${bw}px`;
    target.style.height = `${bh}px`;
  };
  applyBox();

  window.addEventListener('pointermove', (ev) => {
    mx = ev.clientX;
    my = ev.clientY;
    const el = (ev.target as HTMLElement | null)?.closest('[data-target="1"], a, button');
    if (el !== null && el !== undefined) {
      const box = el.getBoundingClientRect();
      if (el.hasAttribute('data-target')) {
        // viewfinder mode: brackets wrap the element exactly
        bw = box.width;
        bh = box.height;
        bx = box.left;
        by = box.top;
        applyBox();
        target.style.opacity = '1';
        ring.style.opacity = '0';
      } else {
        target.style.opacity = '0';
        ring.style.opacity = '1';
        ring.classList.add('grow');
      }
    } else {
      target.style.opacity = '0';
      ring.style.opacity = '1';
      ring.classList.remove('grow');
    }
  });

  window.addEventListener('pointerdown', () => ring.classList.add('grow'));
  window.addEventListener('pointerup', () => ring.classList.remove('grow'));
  document.documentElement.addEventListener('pointerleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    target.style.opacity = '0';
  });
  document.documentElement.addEventListener('pointerenter', () => {
    dot.style.opacity = '1';
  });

  const frame = (): void => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
