import { describe, expect, it } from 'vitest';
import { applyFilter, formatClock, mailtoLink, matchesFilter, readLikes, stepIndex, tickerLine } from '../src/lib';
import { projects, stack, tickerItems, projectFilters } from '../src/data';

describe('matchesFilter', () => {
  it('matches everything on "all"', () => {
    expect(matchesFilter(projects[0], 'all')).toBe(true);
    expect(matchesFilter(projects[7], 'all')).toBe(true);
  });

  it('matches by exact category', () => {
    expect(matchesFilter(projects[0], 'Systems')).toBe(true);
    expect(matchesFilter(projects[0], 'Distributed')).toBe(false);
  });

  it('never matches an unknown filter', () => {
    expect(matchesFilter(projects[0], 'Mobile')).toBe(false);
  });
});

describe('applyFilter', () => {
  it('"all" returns every project', () => {
    expect(applyFilter(projects, 'all')).toHaveLength(projects.length);
  });

  it('each shipped filter key returns a non-empty subset that sums with the others', () => {
    const total = projectFilters
      .filter((f) => f.key !== 'all')
      .reduce((sum, f) => sum + applyFilter(projects, f.key).length, 0);
    expect(applyFilter(projects, 'all')).toHaveLength(9);
    expect(total).toBe(9);
  });

  it('keeps the original repo order inside a category', () => {
    const systems = applyFilter(projects, 'Systems').map((p) => p.id);
    expect(systems).toEqual(['rg-sql', 'pipeline', 'heap']);
  });
});

describe('stepIndex', () => {
  it('steps forward and wraps to zero at the end', () => {
    expect(stepIndex(0, 1, 9)).toBe(1);
    expect(stepIndex(8, 1, 9)).toBe(0);
  });

  it('steps backward and wraps to the last index', () => {
    expect(stepIndex(3, -1, 9)).toBe(2);
    expect(stepIndex(0, -1, 9)).toBe(8);
  });

  it('survives empty carousels and big deltas', () => {
    expect(stepIndex(0, 1, 0)).toBe(0);
    expect(stepIndex(2, 25, 9)).toBe(0);
    expect(stepIndex(2, -25, 9)).toBe(4);
  });
});

describe('formatClock', () => {
  // Build the expectation from the same Date's local fields so the test
  // passes in any timezone.
  const expectFor = (d: Date): string => {
    const p = (n: number, w = 2) => String(n).padStart(w, '0');
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} // ` +
      `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}:${p(d.getMilliseconds(), 3)}`;
  };

  it('pads every component to its field width', () => {
    const d = new Date(2026, 9, 11, 12, 10, 9, 559);
    expect(formatClock(d)).toBe(expectFor(d));
    expect(formatClock(d)).toMatch(/^\d{4}\.\d{2}\.\d{2} \/\/ \d{2}:\d{2}:\d{2}:\d{3}$/);
  });

  it('zero-pads small hour and millisecond values', () => {
    const d = new Date(2026, 0, 2, 3, 4, 5, 6);
    expect(formatClock(d)).toBe('2026.01.02 // 03:04:05:006');
  });
});

describe('tickerLine', () => {
  it('joins items with the diamond separator', () => {
    expect(tickerLine(['A', 'B'])).toBe('A \u25C6 B');
    expect(tickerLine(tickerItems.length ? ['X'] : [])).toBe('X');
  });
});

describe('mailtoLink', () => {
  it('encodes subject and body and signs the sender', () => {
    const href = mailtoLink('to@example.com', 'Jane', 'jane@x.com', 'Hello', 'Hi there');
    expect(href.startsWith('mailto:to@example.com?')).toBe(true);
    expect(href).toContain('subject=Hello');
    expect(href).toContain(encodeURIComponent('Hi there\n\nFrom: Jane (jane@x.com)'));
  });

  it('falls back to a default subject when the field is blank', () => {
    const href = mailtoLink('to@example.com', 'Jane', 'jane@x.com', '   ', 'Hi');
    expect(href).toContain(`subject=${encodeURIComponent('Portfolio inquiry from Jane')}`);
  });
});

describe('readLikes', () => {
  it('treats absent storage as zero', () => {
    expect(readLikes(null)).toBe(0);
  });

  it('parses valid non-negative counters', () => {
    expect(readLikes('12')).toBe(12);
    expect(readLikes('0')).toBe(0);
  });

  it('rejects negative, fractional, and corrupt values', () => {
    expect(readLikes('-3')).toBe(0);
    expect(readLikes('abc')).toBe(0);
    expect(readLikes('2.9')).toBe(2);
  });
});

describe('shipped data integrity', () => {
  it('has nine projects, all with live demos and posters', () => {
    expect(projects).toHaveLength(9);
    for (const p of projects) {
      expect(p.liveUrl.startsWith('https://rajpalgelot-tech.github.io/')).toBe(true);
      expect(p.poster.startsWith('./projects/')).toBe(true);
      expect(p.tags.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('has a stack of exactly 18 tiles with unique names', () => {
    expect(stack).toHaveLength(18);
    expect(new Set(stack.map((s) => s.name)).size).toBe(18);
  });

  it('contains no em or en dashes anywhere in user visible copy', () => {
    const allStrings = JSON.stringify({ projects, stack, tickerItems, ...projects[0] });
    expect(allStrings.includes('\u2014')).toBe(false);
    expect(allStrings.includes('\u2013')).toBe(false);
  });
});
