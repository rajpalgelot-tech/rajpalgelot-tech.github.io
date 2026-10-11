import { buildApp } from './app';
import { mountCursor } from './cursor';

const root = document.getElementById('root');
if (root === null) throw new Error('#root missing from index.html');

buildApp(root);
mountCursor(document.body);
runBoot();

/** Animate the boot overlay, then fade it out and drop it from the DOM. */
function runBoot(): void {
  const boot = document.getElementById('boot');
  if (boot === null) return;
  const pct = document.getElementById('boot-pct');
  const bar = document.getElementById('boot-bar');
  const status = document.getElementById('boot-status');
  const lines = [
    'SYNCHRONIZING SYSTEM DATA...',
    'LOADING PROJECT MANIFESTS...',
    'CALIBRATING INTERFACE...',
    'SYSTEMS ONLINE'
  ];
  let progress = 0;
  const timer = window.setInterval(() => {
    progress = Math.min(100, progress + Math.ceil(Math.random() * 9) + 3);
    if (pct !== null) pct.textContent = `${String(progress).padStart(2, '0')}%`;
    if (bar !== null) bar.style.width = `${progress}%`;
    if (status !== null) status.textContent = lines[Math.min(lines.length - 1, Math.floor(progress / 28))];
    if (progress >= 100) {
      window.clearInterval(timer);
      window.setTimeout(() => {
        boot.classList.add('done');
        window.setTimeout(() => boot.remove(), 600);
      }, 260);
    }
  }, 90);
}
