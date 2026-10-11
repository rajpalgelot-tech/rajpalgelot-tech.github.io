import type { Project, ProjectCategory } from './data';

/** True when a project belongs to the active filter ("all" matches everything). */
export function matchesFilter(project: Project, filter: string): boolean {
  if (filter === 'all') return true;
  return project.category === (filter as ProjectCategory);
}

/** Projects visible under a filter, keeping their original order. */
export function applyFilter(items: Project[], filter: string): Project[] {
  return items.filter((p) => matchesFilter(p, filter));
}

/** Step a carousel index by delta and wrap around within [0, total - 1]. */
export function stepIndex(current: number, delta: number, total: number): number {
  if (total <= 0) return 0;
  const n = ((current + delta) % total + total) % total;
  return n;
}

/**
 * Format the hero system clock in the viewer's own timezone:
 * "2026.10.11 // 12:10:09:559". Fields come from the local getters of the
 * passed Date so the label matches what the viewer's clock shows.
 */
export function formatClock(now: Date): string {
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  const date = `${now.getFullYear()}.${p(now.getMonth() + 1)}.${p(now.getDate())}`;
  const time =
    `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}` +
    `:${p(now.getMilliseconds(), 3)}`;
  return `${date} // ${time}`;
}

/** Join ticker words with the diamond separator used by the marquee. */
export function tickerLine(items: string[]): string {
  return items.join(' \u25C6 ');
}

/** Mailto compose link built from the contact form values. */
export function mailtoLink(email: string, name: string, from: string, subject: string, message: string): string {
  const fullSubject = subject.trim() !== '' ? subject : `Portfolio inquiry from ${name}`;
  const body = `${message}\n\nFrom: ${name} (${from})`;
  return `mailto:${email}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
}

/** Read a localStorage counter safely; returns 0 when absent or corrupt. */
export function readLikes(raw: string | null): number {
  if (raw === null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}
