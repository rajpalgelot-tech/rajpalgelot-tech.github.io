/**
 * Inline SVG brand icons for the tech stack grid, simplified but recognizable.
 * Each entry renders inside a 24x24 viewBox; the tile supplies the frame.
 */

type IconDef = { label: string; svg: string };

const text = (
  x: number, y: number, size: number, content: string, fill: string, weight = 700
) =>
  `<text x="${x}" y="${y}" font-family="'JetBrains Mono', monospace" font-size="${size}" ` +
  `font-weight="${weight}" fill="${fill}" text-anchor="middle" dominant-baseline="central">${content}</text>`;

export const icons: Record<string, IconDef> = {
  typescript: {
    label: 'TypeScript',
    svg: `<rect x="1" y="1" width="22" height="22" rx="3" fill="#3178c6"/>` +
      text(9.5, 16.5, 9, 'T', '#fff') + text(16.5, 12, 9, 'S', '#fff')
  },
  cplusplus: {
    label: 'C++',
    svg: `<path d="M12 2 21 7v10l-9 5-9-5V7z" fill="#649ad2"/>` +
      text(11, 13, 8, 'C', '#fff') +
      `<path d="M15 10v6M12.5 13h5" stroke="#fff" stroke-width="1.6"/>`
  },
  javascript: {
    label: 'JavaScript',
    svg: `<rect x="1" y="1" width="22" height="22" rx="3" fill="#f7df1e"/>` +
      text(12, 16.5, 9, 'JS', '#1a1a1a')
  },
  python: {
    label: 'Python',
    svg: `<rect x="1" y="1" width="22" height="22" rx="3" fill="#1e2b3d"/>` +
      `<path d="M12 4c-3 0-4 1.3-4 3v2h5v1H7c-1.8 0-3 1.4-3 3.5S5.2 17 7 17h2v-2.5c0-1.6 1.3-2.5 3-2.5 2.4 0 4-.8 4-3V7c0-1.7-1.3-3-4-3z" fill="#4b8bbe"/>` +
      `<path d="M12 20c3 0 4-1.3 4-3v-2h-5v-1h6c1.8 0 3-1.4 3-3" fill="none"/>` +
      `<path d="M14.5 20c1.5-.3 2.5-1.2 2.5-3v-2h-2v2.5c0 1.6-1.3 2.5-3 2.5-2.4 0-4 .8-4 3" fill="#ffd845" transform="translate(0,-1)"/>` +
      `<circle cx="10" cy="7" r="1" fill="#fff"/>`
  },
  sql: {
    label: 'SQL',
    svg: `<ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="#9ca3af" stroke-width="1.6"/>` +
      `<path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" fill="none" stroke="#9ca3af" stroke-width="1.6"/>` +
      `<path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="#9ca3af" stroke-width="1.6"/>`
  },
  html5: {
    label: 'HTML5',
    svg: `<path d="M3 2h18l-1.6 18L12 22l-7.4-2z" fill="#e8622c"/>` +
      `<path d="M12 4v16l6-1.6L19.4 4z" fill="#f0793f"/>` +
      `<path d="M7 7h10l-.3 3H10.5l.2 3h6l-.5 5-4.2 1.2L7.8 18l-.2-2h2.8l.1 1 2.5.7 2.4-.7.2-2H8.2z" fill="#fff"/>`
  },
  css3: {
    label: 'CSS3',
    svg: `<path d="M3 2h18l-1.6 18L12 22l-7.4-2z" fill="#3c99d4"/>` +
      `<path d="M12 4v16l6-1.6L19.4 4z" fill="#33a9dc"/>` +
      `<path d="M7 7h10l-.3 3H10.4l.2 3h6l-.5 5-4.1 1.2L8 18l-.2-2h2.7l.1 1 2.4.7 2.4-.7.2-2H8.4z" fill="#fff"/>`
  },
  wasm: {
    label: 'WebAssembly',
    svg: `<rect x="1" y="3" width="22" height="18" rx="3" fill="#22262e"/>` +
      `<path d="M6 20l3-8 2 5 1.5-3.5L15 20z" fill="#c4c9d4"/>` +
      text(16.5, 9, 8, 'WA', '#c4c9d4', 600)
  },
  emscripten: {
    label: 'Emscripten',
    svg: `<circle cx="12" cy="12" r="9" fill="none" stroke="#5bc0de" stroke-width="1.8"/>` +
      `<path d="M8 12h7M12 8.5 15.5 12 12 15.5" fill="none" stroke="#5bc0de" stroke-width="1.8"/>`
  },
  cmake: {
    label: 'CMake',
    svg: `<path d="M12 3 21 20H3z" fill="none" stroke="#1e9c46" stroke-width="1.8"/>` +
      `<path d="M12 3 9.5 14.5 3 20zM9.5 14.5 15 17.8" fill="none" stroke="#1e9c46" stroke-width="1.4"/>`
  },
  shell: {
    label: 'Shell',
    svg: `<rect x="1" y="3" width="22" height="18" rx="3" fill="#1c2430"/>` +
      `<path d="M6 9l4 3-4 3" fill="none" stroke="#89e051" stroke-width="1.8"/>` +
      `<path d="M12 15h6" stroke="#89e051" stroke-width="1.8"/>`
  },
  nodejs: {
    label: 'Node.js',
    svg: `<path d="M12 2 21 7v10l-9 5-9-5V7z" fill="#5fa04e"/>` +
      text(12, 13, 9, 'N', '#fff')
  },
  react: {
    label: 'React',
    svg: `<circle cx="12" cy="12" r="2" fill="#61dafb"/>` +
      `<g fill="none" stroke="#61dafb" stroke-width="1.2">` +
      `<ellipse cx="12" cy="12" rx="10" ry="4"/>` +
      `<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>` +
      `<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g>`
  },
  vite: {
    label: 'Vite',
    svg: `<path d="M2 4l10 18L22 4l-6 2-4-2-4 2z" fill="#41d1ff" opacity="0.25"/>` +
      `<path d="M2 4l10 18L22 4z" fill="none" stroke="#41d1ff" stroke-width="1.6"/>` +
      `<path d="M13 2l-3 7h3l-2 6 6-8h-3l2-5z" fill="#f7df1e"/>`
  },
  vitest: {
    label: 'Vitest',
    svg: `<path d="M2 5l10 16L22 5z" fill="none" stroke="#fcc72b" stroke-width="1.6"/>` +
      `<path d="M9 3l3.5 4L16 3" fill="none" stroke="#729b1b" stroke-width="1.8"/>`
  },
  git: {
    label: 'Git',
    svg: `<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="#f05033"/>` +
      `<path d="M8 15.5v-6a2 2 0 100-.01M8 15.5a2 2 0 100 .01M15.5 9.5v4a2 2 0 11-1.5 1.9" fill="none" stroke="#fff" stroke-width="1.5"/>` +
      `<circle cx="8" cy="7.5" r="1.6" fill="#fff"/><circle cx="8" cy="15.5" r="1.6" fill="#fff"/><circle cx="14" cy="15.5" r="1.6" fill="#fff"/>`
  },
  actions: {
    label: 'GitHub Actions',
    svg: `<circle cx="8.5" cy="6.5" r="4" fill="none" stroke="#d1d5db" stroke-width="1.6"/>` +
      `<path d="M8.5 10.5v4a3 3 0 003 3h2" fill="none" stroke="#d1d5db" stroke-width="1.6"/>` +
      `<circle cx="8.5" cy="6.5" r="1.4" fill="#d1d5db"/>` +
      `<path d="M13.5 14.5l5 3-5 3z" fill="#d1d5db"/>`
  },
  tailwind: {
    label: 'Tailwind CSS',
    svg: `<path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.8 2 1.5 1 1.1 2.2 2.5 4.5 2.5 2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.8-2-1.5-1-1.1-2.2-2.5-4.5-2.5zM7 12c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.8 2 1.5 1 1.1 2.2 2.5 4.5 2.5 2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.8-2-1.5-1-1.1-2.2-2.5-4.5-2.5z" fill="#38bdf8" transform="translate(0,-1.5)"/>`
  }
};

export function stackIcon(key: string): string {
  const def = icons[key];
  if (def === undefined) return '';
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${def.svg}</svg>`;
}

/** Small UI glyphs used across the page. */
export const glyphs: Record<string, string> = {
  arrowRight: `<path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
  download: `<path d="M12 3v12m-5-5 5 5 5-5M4 21h16" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
  copy: `<rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>` +
    `<path d="M5 15V6a2 2 0 012-2h9" fill="none" stroke="currentColor" stroke-width="1.6"/>`,
  mail: `<rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>` +
    `<path d="m3.5 7 8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.6"/>`,
  external: `<path d="M14 4h6v6M20 4 11 13M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-3" fill="none" stroke="currentColor" stroke-width="1.7"/>`,
  heart: `<path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9z" fill="none" stroke="currentColor" stroke-width="1.7"/>`,
  moon: `<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" fill="currentColor"/>`,
  sun: `<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/>` +
    `<path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" stroke="currentColor" stroke-width="1.7"/>`,
  chevronLeft: `<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
  chevronRight: `<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  close: `<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  github: `<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>`,
  linkedin: `<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>`,
  instagram: `<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/>` +
    `<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/>` +
    `<circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>`
};

export function glyph(key: string): string {
  return glyphs[key] ?? '';
}
