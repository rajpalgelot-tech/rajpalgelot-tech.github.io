import { buildApp } from './app';
import { mountCursor } from './cursor';

const root = document.getElementById('root');
if (root === null) throw new Error('#root missing from index.html');

buildApp(root);
mountCursor(document.body);
runBoot();

/** Animate the boot overlay, then fade it out and drop it from the DOM. */
function runBoot(): void {
  const bootEl = document.getElementById('boot');
  if (bootEl === null) return;
  const boot = bootEl;
  const pct = document.getElementById('boot-pct');
  const bar = document.getElementById('boot-bar');
  const status = document.getElementById('boot-status');
  const secure = document.getElementById('boot-secure-text');
  const lines = [
    'SYNCHRONIZING SYSTEM DATA...',
    'LOADING PROJECT MANIFESTS...',
    'CALIBRATING.',
    'CALIBRATING.'
  ];
  let progress = 0;
  const timer = window.setInterval(() => {
    progress = Math.min(100, progress + Math.ceil(Math.random() * 7) + 3);
    if (pct !== null) pct.innerHTML = `${String(progress).padStart(2, '0')}<i>%</i>`;
    if (bar !== null) bar.style.width = `${progress}%`;
    if (status !== null) status.textContent = lines[Math.min(lines.length - 1, Math.floor(progress / 28))];
    if (progress >= 100) {
      window.clearInterval(timer);
      typeSecureLine();
    }
  }, 80);

  /** Type the verification line, then fade the whole boot out. */
  function typeSecureLine(): void {
    const text = '[SECURE] PROTOCOLS VERIFIED // SYSTEM ONLINE';
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      if (secure !== null) secure.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(typer);
        window.setTimeout(() => {
          boot.classList.add('done');
          window.setTimeout(() => boot.remove(), 700);
        }, 450);
      }
    }, 26);
  }
}
