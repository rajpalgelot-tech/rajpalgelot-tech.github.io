import './styles.css';
import {
  identity, tagline, philosophy, heroRoles, tickerItems, bioShort, bioFull,
  stack, projects, projectFilters, projectSubs, heroNameWords, specializations, footerStatus,
  githubProfileUrl, linkedinUrl, instagramUrl, developer
} from './data';
import { stackIcon, glyph } from './icons';
import { applyFilter, stepIndex, tickerLine, formatClock, mailtoLink } from './lib';
import { mountHoverMask } from './hoverMask';

const el = (tag: string, cls = '', textContent = ''): HTMLElement => {
  const node = document.createElement(tag);
  if (cls !== '') node.className = cls;
  if (textContent !== '') node.textContent = textContent;
  return node;
};

const svg = (markup: string): SVGElement => {
  const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wrap.setAttribute('viewBox', '0 0 24 24');
  wrap.innerHTML = markup;
  return wrap;
};

const monoLabel = (text: string, cls = 'mono-label'): HTMLElement => {
  const node = el('span', cls, text);
  return node;
};

/** Section heading row: dot bullet + big number heading + hairline. */
function sectionHeading(num: string, title: string): HTMLElement {
  const row = el('div', 'section-heading reveal');
  const dot = el('span', 'heading-dot');
  const h2 = el('h2', 'section-title', `${num}. ${title}`);
  const line = el('span', 'heading-line');
  row.append(dot, h2, line);
  return row;
}

export function buildApp(root: HTMLElement): void {
  /* ================= NAV ================= */
  const nav = el('nav', 'nav reveal in');
  const navPill = el('div', 'nav-pill');
  const logo = el('a', 'nav-logo') as HTMLAnchorElement;
  logo.href = '#hero';
  const logoDot = el('span', 'status-dot');
  logo.append(logoDot, el('span', 'nav-logo-text', identity.handle));
  const links = el('div', 'nav-links');
  for (const [label, href] of [
    ['Home', '#hero'], ['About', '#about'], ['Stack', '#stack'],
    ['Projects', '#projects'], ['Connect', '#connect']
  ] as const) {
    const a = el('a', 'nav-link', label) as HTMLAnchorElement;
    a.href = href;
    a.dataset.hover = '1';
    links.append(a);
  }
  navPill.append(logo, links);
  const resumePill = el('a', 'nav-resume') as HTMLAnchorElement;
  resumePill.href = `./${identity.resumeFile}`;
  resumePill.dataset.hover = '1';
  resumePill.append(el('span', 'nav-resume-text', 'Resume'), svg(glyph('download')));
  resumePill.hidden = true; // unhidden by the resume probe when the PDF exists
  const navIcons = el('div', 'nav-icons');
  const themeBtn = el('button', 'icon-btn') as HTMLButtonElement;
  themeBtn.type = 'button';
  themeBtn.dataset.hover = '1';
  themeBtn.setAttribute('aria-label', 'Toggle theme');
  themeBtn.append(svg(glyph('moon')));
  // Mobile menu: toggles the link drawer shown at small widths.
  const menuBtn = el('button', 'icon-btn nav-menu-btn') as HTMLButtonElement;
  menuBtn.type = 'button';
  menuBtn.dataset.hover = '1';
  menuBtn.setAttribute('aria-label', 'Open menu');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.append(svg(glyph('menu')));
  const setMenu = (open: boolean): void => {
    nav.classList.toggle('open', open);
    menuBtn.replaceChildren(svg(glyph(open ? 'close' : 'menu')));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  links.addEventListener('click', () => setMenu(false));
  navIcons.append(themeBtn, menuBtn);
  nav.append(navPill, resumePill, navIcons);
  root.append(nav);

  /* ================= HERO ================= */
  const hero = el('header', 'hero');
  hero.id = 'hero';
  const heroGrid = el('div', 'hero-grid');

  const heroLeft = el('div', 'hero-left');
  const sysBadge = el('div', 'sys-badge');
  sysBadge.append(el('span', 'status-dot pulse'), el('span', 'mono-label', 'SYS://ONLINE'));
  const identityLabel = monoLabel('// IDENTITY PROTOCOL', 'mono-label dim identity-label');
  const h1 = el('h1', 'hero-name');
  h1.setAttribute('aria-label', identity.fullName);
  const nameText = el('span', 'hero-name-text');
  const caret = el('span', 'hero-caret');
  h1.append(nameText, caret);
  const tag = el('p', 'hero-tagline mono-text', tagline);
  const heroCtas = el('div', 'hero-ctas');
  const exploreBtn = el('a', 'btn btn-light') as HTMLAnchorElement;
  exploreBtn.href = '#projects';
  exploreBtn.dataset.hover = '1';
  exploreBtn.append(el('span', '', 'Explore Projects'), svg(glyph('arrowRight')));
  const touchBtn = el('a', 'btn btn-dark') as HTMLAnchorElement;
  touchBtn.href = '#connect';
  touchBtn.dataset.hover = '1';
  touchBtn.textContent = 'Get In Touch';
  heroCtas.append(exploreBtn, touchBtn);
  heroLeft.append(sysBadge, identityLabel, h1, tag, heroCtas);

  const heroCenter = el('div', 'hero-center');
  const portrait = el('figure', 'portrait');
  portrait.id = 'portrait';
  const portraitCanvas = el('div', 'portrait-canvas');
  const monogram = el('div', 'portrait-monogram', 'RG');
  const photoImg = document.createElement('img');
  photoImg.className = 'portrait-photo';
  photoImg.alt = identity.fullName;
  photoImg.hidden = true;
  const scan = el('div', 'portrait-scan');
  scan.innerHTML =
    '<span class="hud-corner tl"></span><span class="hud-corner tr"></span>' +
    '<span class="hud-corner bl"></span><span class="hud-corner br"></span>' +
    '<span class="hud-read mono-label">SCAN 100% // LAYER LOCKED</span>' +
    '<span class="hud-id mono-label">CYBERNETIC LAYER // ACTIVE</span>';
  // WebGL layer that reveals the cybernetic mask through a fluid simulation
  // while the cursor moves, exactly like the reference portrait.
  const fluidCanvas = document.createElement('canvas');
  fluidCanvas.className = 'portrait-fluid';
  portraitCanvas.append(monogram, photoImg, fluidCanvas, scan);
  const hint = el('div', 'portrait-hint');
  hint.append(
    el('span', 'status-dot'),
    el('span', 'mono-label', 'MOVE CURSOR OVER PORTRAIT TO REVEAL CYBERNETIC LAYER')
  );
  portrait.append(portraitCanvas, hint);
  heroCenter.append(portrait);

  const heroRight = el('div', 'hero-right');
  const philo = el('div', 'philosophy');
  // Quote wraps only at the comma: each clause is an inline-block, so the
  // line either fits whole or breaks cleanly into the two halves.
  const quote = el('blockquote', 'philosophy-quote');
  const commaAt = philosophy.indexOf(',');
  if (commaAt > 0) {
    quote.append(
      el('span', 'q-clause', `\u201C${philosophy.slice(0, commaAt + 1)}`),
      document.createTextNode(' '),
      el('span', 'q-clause', `${philosophy.slice(commaAt + 2)}\u201D`)
    );
  } else {
    quote.append(el('span', 'q-clause', `\u201C${philosophy}\u201D`));
  }
  philo.append(
    monoLabel('// PHILOSOPHY', 'mono-label dim'),
    quote
  );
  const roles = el('div', 'hero-roles');
  for (const r of heroRoles) {
    const role = el('div', 'hero-role');
    role.dataset.hover = '1';
    role.append(
      monoLabel(`${r.index} / ${r.domain}`, 'mono-label dim'),
      el('h3', 'hero-role-title', r.title),
      el('p', 'hero-role-tools mono-text dim', r.tools)
    );
    roles.append(role);
  }
  heroRight.append(philo, roles);

  const clock = el('div', 'hero-clock');
  clock.append(
    el('span', 'status-dot pulse'),
    monoLabel('LOCAL SYSTEM TIME', 'mono-label dim'),
    el('span', 'clock-value mono-label', '----.--.-- // --:--:--:---')
  );
  heroGrid.append(heroLeft, heroCenter, heroRight, clock);
  hero.append(heroGrid);

  const marquee = el('div', 'marquee');
  const track = el('div', 'marquee-track');
  const line = tickerLine(tickerItems);
  for (let i = 0; i < 2; i++) {
    const span = el('span', 'marquee-seg', line);
    span.setAttribute('aria-hidden', i === 1 ? 'true' : 'false');
    track.append(span);
  }
  marquee.append(track);
  hero.append(marquee);
  root.append(hero);

  /* ================= ABOUT ================= */
  const about = el('section', 'section about');
  about.id = 'about';
  about.append(sectionHeading('01', 'About Me'));
  const aboutGrid = el('div', 'about-grid');

  const badgeWrap = el('div', 'badge-wrap reveal');
  const badge = el('div', 'id-badge');
  badge.id = 'id-badge';
  const badgeTop = el('div', 'badge-top');
  badgeTop.append(
    monoLabel('ID // PASS-2026', 'mono-label dim'),
    (() => { const chip = el('span', 'badge-chip'); chip.append(el('span', 'status-dot'), monoLabel('DRAG BADGE', 'mono-label')); return chip; })()
  );
  const badgeHole = el('div', 'badge-hole');
  const badgeStrap = el('div', 'badge-strap');
  const badgePhoto = el('div', 'badge-photo');
  const badgeMonogram = el('div', 'badge-monogram', 'RG');
  const badgeImg = document.createElement('img');
  badgeImg.alt = `${identity.fullName} portrait`;
  badgeImg.hidden = true;
  badgePhoto.append(badgeMonogram, badgeImg);
  const badgeFoot = el('div', 'badge-foot');
  badgeFoot.append(
    monoLabel('DRAG // INTERACTIVE', 'mono-label dim'),
    monoLabel(`${identity.fullName.toUpperCase()} // DEV`, 'mono-label dim')
  );
  badge.append(badgeTop, badgeHole, badgeStrap, badgePhoto, badgeFoot);
  badgeWrap.append(badge);

  const aboutCopy = el('div', 'about-copy');
  aboutCopy.append(el('h3', 'about-title reveal', 'Systems software you can read, run, and break.'));
  const bioBlock = el('div', 'bio-block reveal');
  bioBlock.append(el('p', 'mono-text', bioShort));
  const moreBlock = el('div', 'bio-more');
  moreBlock.hidden = true;
  for (const p of bioFull) moreBlock.append(el('p', 'mono-text', p));
  const readBtn = el('button', 'btn btn-light btn-small') as HTMLButtonElement;
  readBtn.type = 'button';
  readBtn.dataset.hover = '1';
  readBtn.append(el('span', 'read-label', 'READ FULL VERSION'), svg(glyph('arrowRight')));
  readBtn.addEventListener('click', () => {
    const open = !moreBlock.hidden;
    moreBlock.hidden = open;
    readBtn.querySelector('.read-label')!.textContent = open ? 'READ FULL VERSION' : 'SHOW LESS';
  });
  bioBlock.append(readBtn, moreBlock);
  const eduRow = el('div', 'edu-row reveal');
  eduRow.append(
    (() => {
      const card = el('div', 'edu-card');
      card.append(monoLabel('EDUCATION', 'mono-label dim'), el('p', 'edu-value', 'B.S. Computer Science'), el('p', 'mono-text dim', 'Cleveland State University, 2023\u00A0to\u00A02027'));
      return card;
    })(),
    (() => {
      const card = el('div', 'edu-card');
      card.append(monoLabel('FOCUS', 'mono-label dim'), el('p', 'edu-value', 'Systems & Full Stack'), el('p', 'mono-text dim', 'Storage engines, consensus, and the web platform'));
      return card;
    })()
  );
  aboutCopy.append(bioBlock, eduRow);
  aboutGrid.append(badgeWrap, aboutCopy);
  about.append(aboutGrid);
  root.append(about);

  /* ================= STACK ================= */
  const stackSec = el('section', 'section stack');
  stackSec.id = 'stack';
  stackSec.append(sectionHeading('02', 'Tech Stack'));
  const stackHead = el('div', 'stack-head reveal');
  stackHead.append(
    el('h3', 'stack-title', 'The languages and tools the repos actually use.'),
    el('p', 'stack-sub mono-text dim',
      'A toolkit pulled straight from github.com/rajpalgelot-tech: every item below ships in a real project on this page.'),
    monoLabel('TARGET CURSOR // HOVER CARDS', 'mono-label dim stack-corner')
  );
  stackSec.append(stackHead);
  const grid = el('div', 'stack-grid');
  stack.forEach((item, i) => {
    const tile = el('div', 'stack-tile reveal');
    tile.dataset.target = '1';
    tile.style.transitionDelay = `${(i % 9) * 40}ms`;
    const iconBox = el('div', 'stack-icon');
    iconBox.innerHTML = stackIcon(item.icon);
    tile.append(iconBox, el('p', 'stack-name mono-label', item.name));
    grid.append(tile);
  });
  stackSec.append(grid);
  root.append(stackSec);

  /* ================= PROJECTS ================= */
  const projSec = el('section', 'section projects');
  projSec.id = 'projects';
  // The pin wrapper becomes a sticky full-height viewport on phones, so page
  // scroll drives the carousel, like the reference portfolio.
  const projPin = el('div', 'projects-pin');
  projPin.append(sectionHeading('03', 'Projects'));
  const projGrid = el('div', 'projects-grid');

  const panel = el('aside', 'projects-panel reveal');
  panel.append(
    el('h3', 'projects-title', 'Built from scratch, broken on purpose.'),
    el('p', 'projects-sub mono-text dim',
      'Scroll horizontally to inspect each system. Click any poster to flip the card and read the architecture notes.'),
    monoLabel('// DOMAIN FILTER', 'mono-label dim filter-label')
  );
  const filterNav = el('nav', 'filter-nav');
  filterNav.setAttribute('aria-label', 'Project domain filter');
  projectFilters.forEach((f, i) => {
    const row = el('button', 'filter-row') as HTMLButtonElement;
    row.type = 'button';
    row.dataset.hover = '1';
    row.dataset.filter = f.key;
    row.append(
      el('span', 'filter-dash'),
      el('span', 'filter-index mono-label dim', String(i + 1).padStart(2, '0')),
      el('span', 'filter-name', f.label)
    );
    if (i === 0) row.classList.add('active');
    filterNav.append(row);
  });
  panel.append(filterNav);
  const indexRow = el('div', 'index-row');
  const counter = el('span', 'index-counter mono-label');
  counter.innerHTML = `INDEX // <b>01</b> OF 09`;
  const arrows = el('div', 'index-arrows');
  const prevBtn = el('button', 'icon-btn round') as HTMLButtonElement;
  const nextBtn = el('button', 'icon-btn round') as HTMLButtonElement;
  prevBtn.type = 'button'; nextBtn.type = 'button';
  prevBtn.dataset.hover = '1'; nextBtn.dataset.hover = '1';
  prevBtn.setAttribute('aria-label', 'Previous project');
  nextBtn.setAttribute('aria-label', 'Next project');
  prevBtn.append(svg(glyph('chevronLeft')));
  nextBtn.append(svg(glyph('chevronRight')));
  arrows.append(prevBtn, nextBtn);
  const progress = el('div', 'progress-track');
  const progressFill = el('div', 'progress-fill');
  progress.append(progressFill);
  const flipHint = el('p', 'flip-hint');
  flipHint.append(el('span', 'status-dot'), monoLabel('Scroll down or click card to flip', 'mono-label dim'));
  indexRow.append(counter, arrows);
  panel.append(indexRow, progress, flipHint);

  const carousel = el('div', 'carousel');
  carousel.setAttribute('tabindex', '0');

  // Phones: the section pins full height and page scroll drives the carousel,
  // so a spacer div below the pin provides the scroll runway (sticky travel is
  // limited to the parent's content box, so padding alone would not work).
  const isPinnedMobile = (): boolean => window.matchMedia('(max-width: 720px)').matches;
  const runway = el('div', 'pin-runway');
  runway.setAttribute('aria-hidden', 'true');
  const syncRunway = (): void => {
    if (isPinnedMobile()) {
      const travel = carousel.scrollWidth - carousel.clientWidth;
      runway.style.height = travel > 0 ? `${Math.round(travel)}px` : '';
    } else {
      runway.style.height = '';
    }
  };
  // Pause the sweep while the visitor is swiping the carousel directly.
  let touchHold = false;
  carousel.addEventListener('touchstart', () => { touchHold = true; }, { passive: true });
  carousel.addEventListener('touchend', () => {
    window.setTimeout(() => { touchHold = false; }, 900);
  }, { passive: true });

  const cards: HTMLElement[] = [];
  let activeFilter = 'all';
  const renderCards = (): void => {
    carousel.innerHTML = '';
    cards.length = 0;
    const visible = applyFilter(projects, activeFilter);
    visible.forEach((p, i) => {
      const card = el('button', 'project-card reveal in') as HTMLButtonElement;
      card.type = 'button';
      card.dataset.target = '1';
      card.setAttribute('aria-label', `Project ${p.name}`);
      const inner = el('div', 'card-inner');
      const front = el('div', 'card-front');
      const img = document.createElement('img');
      img.src = p.poster;
      img.alt = `${p.name} screenshot`;
      img.loading = 'lazy';
      front.append(img);
      const back = el('div', 'card-back');
      const backInner = el('div', 'card-back-inner');
      const backHead = el('div', 'card-back-head');
      backHead.append(
        el('span', 'card-cat-chip mono-label', p.category.toUpperCase()),
        el('span', 'card-flip-hint mono-label dim', 'Click to Flip Back \u21A9')
      );
      backInner.append(
        backHead,
        el('h4', 'card-name back', p.name),
        el('p', 'card-sub mono-text dim', projectSubs[p.id] ?? ''),
        el('p', 'card-desc mono-text dim', p.tagline)
      );
      const tagRow = el('div', 'card-tags');
      for (const t of p.tags) tagRow.append(el('span', 'tag mono-label', t));
      const linkRow = el('div', 'card-links');
      const src = el('a', 'card-link') as HTMLAnchorElement;
      src.href = p.sourceUrl;
      src.target = '_blank';
      src.rel = 'noreferrer';
      src.dataset.hover = '1';
      src.append(svg(glyph('github')), el('span', '', 'Source Code'));
      const live = el('a', 'card-link live') as HTMLAnchorElement;
      live.href = p.liveUrl;
      live.target = '_blank';
      live.rel = 'noreferrer';
      live.dataset.hover = '1';
      live.append(svg(glyph('external')), el('span', '', p.liveLabel));
      linkRow.append(src, live);
      backInner.append(tagRow, linkRow);
      back.append(backInner);
      inner.append(front, back);
      card.append(inner);
      card.addEventListener('click', (ev) => {
        if ((ev.target as HTMLElement).closest('a')) return;
        card.classList.toggle('flipped');
      });
      card.style.setProperty('--i', String(i));
      carousel.append(card);
      cards.push(card);
    });
    updateCounter();
    carousel.scrollTo({ left: 0 });
    syncRunway();
  };

  const updateCounter = (): void => {
    const total = Math.max(cards.length, 1);
    const visibleIndex = Math.min(
      cards.findIndex((c) => {
        const rect = c.getBoundingClientRect();
        const crect = carousel.getBoundingClientRect();
        return rect.left >= crect.left - 40 && rect.right > crect.left + crect.width * 0.4;
      }),
      total - 1
    );
    const idx = visibleIndex < 0 ? 0 : visibleIndex;
    counter.innerHTML = `INDEX // <b>${String(idx + 1).padStart(2, '0')}</b> OF ${String(total).padStart(2, '0')}`;
    const max = carousel.scrollWidth - carousel.clientWidth;
    progressFill.style.width = max > 0 ? `${Math.max(6, (carousel.scrollLeft / max) * 100)}%` : '100%';
  };

  filterNav.addEventListener('click', (ev) => {
    const row = (ev.target as HTMLElement).closest('.filter-row') as HTMLElement | null;
    if (row === null) return;
    activeFilter = row.dataset.filter ?? 'all';
    for (const r of filterNav.querySelectorAll('.filter-row')) r.classList.remove('active');
    row.classList.add('active');
    renderCards();
  });
  prevBtn.addEventListener('click', () => {
    const target = stepIndex(currentCardIndex() - 1, 0, cards.length);
    scrollToCard(target);
  });
  nextBtn.addEventListener('click', () => {
    const target = stepIndex(currentCardIndex() + 1, 0, cards.length);
    scrollToCard(target);
  });
  const currentCardIndex = (): number => {
    const crect = carousel.getBoundingClientRect();
    let best = 0;
    let bestLeft = Number.POSITIVE_INFINITY;
    cards.forEach((c, i) => {
      const left = Math.abs(c.getBoundingClientRect().left - crect.left);
      if (left < bestLeft) { bestLeft = left; best = i; }
    });
    return best;
  };
  const scrollToCard = (i: number): void => {
    const c = cards[Math.min(Math.max(i, 0), cards.length - 1)];
    if (c === undefined) return;
    carousel.scrollTo({ left: c.offsetLeft - 24, behavior: 'smooth' });
  };
  carousel.addEventListener('scroll', () => requestAnimationFrame(updateCounter), { passive: true });
  window.addEventListener('resize', updateCounter);

  projGrid.append(panel, carousel);
  projPin.append(projGrid);
  projSec.append(projPin, runway);
  root.append(projSec);
  renderCards();

  /* ================= CONNECT ================= */
  const connect = el('section', 'section connect');
  connect.id = 'connect';
  connect.append(sectionHeading('04', "Let's Connect"));
  const connectGrid = el('div', 'connect-grid');

  const connectLeft = el('div', 'connect-left');
  connectLeft.append(
    el('h3', 'connect-title reveal', "Let's build something that actually runs."),
    (() => {
      const chip = el('div', 'status-chip reveal');
      chip.append(el('span', 'status-dot pulse'), monoLabel(identity.status, 'mono-label'));
      return chip;
    })()
  );
  const emailCard = el('div', 'email-card reveal');
  const emailText = el('span', 'email-text mono-text', identity.email);
  const copyBtn = el('button', 'btn btn-dark btn-tiny') as HTMLButtonElement;
  copyBtn.type = 'button';
  copyBtn.dataset.hover = '1';
  copyBtn.append(svg(glyph('copy')), el('span', '', 'COPY'));
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      copyBtn.querySelector('span')!.textContent = 'COPIED';
      setTimeout(() => { copyBtn.querySelector('span')!.textContent = 'COPY'; }, 1600);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  });
  const mailBtn = el('a', 'btn btn-light btn-tiny') as HTMLAnchorElement;
  mailBtn.href = `mailto:${identity.email}`;
  mailBtn.dataset.hover = '1';
  mailBtn.append(el('span', '', 'MAIL'), svg(glyph('arrowRight')));
  emailCard.append(monoLabel('// DIRECT EMAIL DISPATCH', 'mono-label dim'), emailText);
  const emailActions = el('div', 'email-actions');
  emailActions.append(copyBtn, mailBtn);
  emailCard.append(emailActions);

  const metaRow = el('div', 'connect-meta reveal');
  const locCard = el('div', 'meta-card');
  locCard.append(monoLabel('LOCATION', 'mono-label dim'), el('p', 'meta-value mono-text', identity.location));
  const respCard = el('div', 'meta-card');
  respCard.append(monoLabel('RESPONSE WINDOW', 'mono-label dim'), el('p', 'meta-value mono-text', identity.responseWindow));
  metaRow.append(locCard, respCard);

  const socialsBlock = el('div', 'socials-block reveal');
  socialsBlock.append(monoLabel('// SOCIAL PROFILES', 'mono-label dim'));
  const socialRow = el('div', 'social-row');
  const ghBtn = el('a', 'social-btn') as HTMLAnchorElement;
  ghBtn.href = githubProfileUrl;
  ghBtn.target = '_blank';
  ghBtn.rel = 'noreferrer';
  ghBtn.dataset.hover = '1';
  ghBtn.append(svg(glyph('github')), el('span', '', 'GitHub'), svg(glyph('external')));
  const liBtn = el('a', 'social-btn') as HTMLAnchorElement;
  liBtn.href = linkedinUrl;
  liBtn.target = '_blank';
  liBtn.rel = 'noreferrer';
  liBtn.dataset.hover = '1';
  liBtn.append(svg(glyph('linkedin')), el('span', '', 'LinkedIn'), svg(glyph('external')));
  const igBtn = el('a', 'social-btn') as HTMLAnchorElement;
  igBtn.href = instagramUrl;
  igBtn.target = '_blank';
  igBtn.rel = 'noreferrer';
  igBtn.dataset.hover = '1';
  igBtn.append(svg(glyph('instagram')), el('span', '', 'Instagram'), svg(glyph('external')));
  socialRow.append(ghBtn, liBtn, igBtn);
  const resumeBtn = el('a', 'social-btn resume-btn') as HTMLAnchorElement;
  resumeBtn.href = `./${identity.resumeFile}`;
  resumeBtn.dataset.hover = '1';
  resumeBtn.append(svg(glyph('download')), el('span', '', 'DOWNLOAD RESUME (PDF)'));
  resumeBtn.hidden = true; // unhidden by the resume probe
  const resumeRow = el('div', 'resume-row');
  resumeRow.append(resumeBtn);
  socialsBlock.append(socialRow, resumeRow);

  connectLeft.append(emailCard, metaRow, socialsBlock);

  const formCard = el('div', 'form-card reveal');
  formCard.append(
    monoLabel('// DIRECT MAIL INTERFACE', 'mono-label dim'),
    el('h3', 'form-title', 'Send a Message'),
    el('p', 'form-sub mono-text dim', `Direct dispatch to ${identity.email}`)
  );
  const form = el('form', 'contact-form') as HTMLFormElement;
  const makeField = (labelText: string, id: string): HTMLElement => {
    const wrap = el('div', 'field');
    const label = document.createElement('label');
    label.className = 'mono-label dim';
    label.textContent = labelText;
    label.htmlFor = id;
    wrap.append(label);
    return wrap;
  };
  const nameInput = document.createElement('input');
  nameInput.id = 'cf-name';
  nameInput.required = true;
  nameInput.placeholder = 'Jane Doe';
  const emailInput = document.createElement('input');
  emailInput.id = 'cf-email';
  emailInput.type = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'jane@example.com';
  const subjectInput = document.createElement('input');
  subjectInput.id = 'cf-subject';
  subjectInput.placeholder = 'Internship / Full Stack Inquiry';
  const messageInput = document.createElement('textarea');
  messageInput.id = 'cf-message';
  messageInput.required = true;
  messageInput.placeholder = 'Tell me about the role, project, or timeline...';
  const formRow = el('div', 'form-row');
  const f1 = makeField('YOUR NAME *', 'cf-name'); f1.append(nameInput);
  const f2 = makeField('YOUR EMAIL *', 'cf-email'); f2.append(emailInput);
  formRow.append(f1, f2);
  const f3 = makeField('PROJECT / ROLE SUBJECT', 'cf-subject'); f3.append(subjectInput);
  const f4 = makeField('YOUR MESSAGE *', 'cf-message'); f4.append(messageInput);
  const sendBtn = el('button', 'btn btn-light btn-wide') as HTMLButtonElement;
  sendBtn.type = 'submit';
  sendBtn.dataset.hover = '1';
  sendBtn.textContent = 'DISPATCH MESSAGE';
  form.append(formRow, f3, f4, sendBtn);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const href = mailtoLink(
      identity.email, nameInput.value, emailInput.value, subjectInput.value, messageInput.value
    );
    window.location.href = href;
  });
  formCard.append(form);
  connectGrid.append(connectLeft, formCard);
  connect.append(connectGrid);
  root.append(connect);

  /* ================= FOOTER ================= */
  const footer = el('footer', 'footer');
  const footerTop = el('div', 'footer-top');
  const brand = el('div', 'footer-brand');
  const brandLogo = el('div', 'brand-logo');
  brandLogo.append(el('span', 'brand-letter', 'R'), el('span', 'brand-name', identity.fullName));
  brand.append(
    brandLogo,
    el('p', 'footer-copy mono-text dim', `\u00A9 copyright ${identity.fullName} 2026. All rights reserved.`),
    (() => {
      const credit = el('div', 'footer-credit');
      credit.append(
        el('p', 'footer-credit-line mono-text dim', 'Designed & engineered by'),
        el('p', 'footer-credit-name', developer.name)
      );
      const devBtn = el('a', 'dev-github-btn') as HTMLAnchorElement;
      devBtn.href = developer.githubUrl;
      devBtn.target = '_blank';
      devBtn.rel = 'noreferrer';
      devBtn.dataset.hover = '1';
      devBtn.setAttribute('aria-label', `${developer.name} on GitHub`);
      devBtn.append(
        svg(glyph('github')),
        el('span', 'mono-label', `@${developer.githubUser}`),
        svg(glyph('external'))
      );
      credit.append(devBtn);
      return credit;
    })()
  );
  const cols = el('div', 'footer-cols');
  const col = (title: string, nodes: HTMLElement[]): HTMLElement => {
    const c = el('div', 'footer-col');
    c.append(el('h4', 'footer-col-title', title));
    const list = el('ul', 'footer-list');
    for (const n of nodes) list.append(n);
    c.append(list);
    return c;
  };
  const fLink = (label: string, href: string): HTMLElement => {
    const a = el('a', 'footer-link', label) as HTMLAnchorElement;
    a.href = href;
    a.dataset.hover = '1';
    return a;
  };
  const resumeFooterLink = fLink('Resume', `./${identity.resumeFile}`);
  resumeFooterLink.hidden = true; // unhidden by the resume probe
  const navCol = col('Navigation', [
    fLink('About', '#about'), fLink('Stack', '#stack'), fLink('Projects', '#projects'),
    fLink('Connect', '#connect'), resumeFooterLink
  ]);
  const socialCol = col('Socials', [
    fLink('GitHub', githubProfileUrl), fLink('LinkedIn', linkedinUrl), fLink('Instagram', instagramUrl)
  ]);
  const specCol = col('Specializations', specializations.map((s) => el('li', 'footer-item', s)));
  const networkCol = col('Direct Network', [
    fLink(identity.email, `mailto:${identity.email}`),
    el('li', 'footer-item', footerStatus),
    el('li', 'footer-item mono-text dim', `Response: ${identity.responseWindow}`)
  ]);
  cols.append(navCol, socialCol, specCol, networkCol);
  footerTop.append(brand, cols);
  const wordmark = el('div', 'wordmark', identity.handle);
  const likeRow = el('div', 'like-row');
  const likeBtn = el('button', 'like-btn') as HTMLButtonElement;
  likeBtn.type = 'button';
  likeBtn.dataset.hover = '1';
  likeBtn.append(svg(glyph('heart')), el('span', 'like-count mono-label', '0 LIKES'));
  likeBtn.addEventListener('click', () => {
    if (likeBtn.classList.contains('liked')) return;
    const next = readLikesSafe() + 1;
    try { localStorage.setItem('rgp_likes', String(next)); } catch { /* private mode */ }
    likeBtn.classList.add('liked');
    likeBtn.querySelector('.like-count')!.textContent = `${next} LIKE${next === 1 ? '' : 'S'}`;
  });
  likeRow.append(likeBtn);
  footer.append(footerTop, wordmark, likeRow);
  root.append(footer);

  /* ================= BEHAVIOR WIRING ================= */

  // Theme toggle (dark is the default; light inverts the surface variables).
  const rootEl = document.documentElement;
  const moonSvg = glyph('moon');
  const sunSvg = glyph('sun');
  const applyTheme = (theme: 'dark' | 'light'): void => {
    rootEl.dataset.theme = theme;
    themeBtn.innerHTML = `<svg viewBox="0 0 24 24">${theme === 'dark' ? moonSvg : sunSvg}</svg>`;
    try { localStorage.setItem('rgp_theme', theme); } catch { /* private mode */ }
  };
  let storedTheme: string | null = null;
  try { storedTheme = localStorage.getItem('rgp_theme'); } catch { /* private mode */ }
  applyTheme(storedTheme === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', () => {
    applyTheme(rootEl.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // Hero name: endless typing loop cycling name and handle, like the reference.
  let wordIndex = 0;
  let letter = 0;
  let deleting = false;
  const typeLoop = (): void => {
    const word = heroNameWords[wordIndex];
    if (!deleting) {
      letter += 1;
      nameText.textContent = word.slice(0, letter);
      if (letter >= word.length) {
        deleting = true;
        setTimeout(typeLoop, 2400);
        return;
      }
      setTimeout(typeLoop, 95);
    } else {
      letter -= 1;
      nameText.textContent = word.slice(0, letter);
      if (letter <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % heroNameWords.length;
        setTimeout(typeLoop, 500);
        return;
      }
      setTimeout(typeLoop, 42);
    }
  };
  setTimeout(typeLoop, 500);

  // Nav: scrollspy pill plus link collapse on scroll down, restore on scroll up.
  const navLinks = [...nav.querySelectorAll<HTMLAnchorElement>('.nav-link')];
  const spySections = ['hero', 'about', 'stack', 'projects', 'connect']
    .map((id) => document.getElementById(id))
    .filter((s): s is HTMLElement => s !== null);
  let lastY = window.scrollY;
  const onNavScroll = (): void => {
    const y = window.scrollY;
    nav.classList.toggle('nav-collapsed', y > 520 && y > lastY + 2);
    lastY = y;
    let current = 'hero';
    for (const s of spySections) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.45) current = s.id;
    }
    for (const a of navLinks) {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    }
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Scroll-linked carousel sweep: while the projects section is on screen,
  // page scroll drives the cards horizontally, like the reference. On phones
  // the section pins full height, so the pin window drives the sweep instead.
  {
    let sweepQueued = false;
    const sweep = (): void => {
      sweepQueued = false;
      if (touchHold) return;
      const rect = projSec.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top >= vh || rect.bottom <= 0) return;
      let progress: number;
      if (isPinnedMobile()) {
        const travel = Math.max(1, runway.offsetHeight);
        // the pin starts sticking once the section's own top padding has scrolled past
        const start = parseFloat(getComputedStyle(projSec).paddingTop) || 0;
        progress = Math.min(1, Math.max(0, (-rect.top - start) / travel));
      } else {
        progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      }
      const target = progress * (carousel.scrollWidth - carousel.clientWidth);
      carousel.scrollLeft += (target - carousel.scrollLeft) * 0.3;
    };
    window.addEventListener('scroll', () => {
      if (!sweepQueued) {
        sweepQueued = true;
        requestAnimationFrame(sweep);
      }
    }, { passive: true });
    window.addEventListener('resize', syncRunway);
  }

  // Local system time with milliseconds.
  const clockValue = clock.querySelector('.clock-value') as HTMLElement;
  const tickClock = (): void => {
    clockValue.textContent = formatClock(new Date());
  };
  tickClock();
  setInterval(tickClock, 47);

  // Portrait hover: move the scan layer with the cursor; once revealed the
  // cybernetic layer stays locked on, like the reference portrait.
  mountHoverMask(portraitCanvas, fluidCanvas, `./${identity.maskFile}`);
  portraitCanvas.addEventListener('pointerenter', () => {
    portraitCanvas.classList.add('scanned');
  });
  portraitCanvas.addEventListener('pointermove', (ev) => {
    const rect = portraitCanvas.getBoundingClientRect();
    const mx = ((ev.clientX - rect.left) / rect.width) * 100;
    const my = ((ev.clientY - rect.top) / rect.height) * 100;
    portraitCanvas.style.setProperty('--mx', `${mx}%`);
    portraitCanvas.style.setProperty('--my', `${my}%`);
  });

  // Draggable ID badge with a physics-style spring back to rest on release.
  let dragging = false;
  let startX = 0;
  let startY = 0;
  badge.addEventListener('pointerdown', (ev) => {
    dragging = true;
    startX = ev.clientX;
    startY = ev.clientY;
    badge.setPointerCapture(ev.pointerId);
    badge.classList.add('dragging');
    badge.classList.remove('settle');
    badge.style.transition = 'none';
  });
  badge.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    badge.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.05}deg)`;
  });
  badge.addEventListener('pointerup', (ev) => {
    if (!dragging) return;
    dragging = false;
    badge.classList.remove('dragging');
    badge.style.transition = 'transform 1.1s cubic-bezier(0.2, 1.6, 0.35, 1)';
    badge.style.transform = 'translate(0px, 0px) rotate(0deg)';
    window.setTimeout(() => { badge.style.transition = ''; }, 1100);
    try { badge.releasePointerCapture(ev.pointerId); } catch { /* already released */ }
  });

  // Likes: seed the counter from localStorage when it exists.
  function readLikesSafe(): number {
    try {
      const raw = localStorage.getItem('rgp_likes');
      return raw === null ? 0 : Math.max(0, Math.floor(Number(raw)) || 0);
    } catch {
      return 0;
    }
  }
  const seedLikes = readLikesSafe();
  if (seedLikes > 0) {
    likeBtn.classList.add('liked');
    likeBtn.querySelector('.like-count')!.textContent =
      `${seedLikes} LIKE${seedLikes === 1 ? '' : 'S'}`;
  }

  // Scroll reveal.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  for (const node of root.querySelectorAll('.reveal')) observer.observe(node);

  // Scroll progress bar + active nav link.
  const progressBar = el('div', 'scroll-progress');
  const progressInner = el('div', 'scroll-progress-fill');
  progressBar.append(progressInner);
  document.body.append(progressBar);
  const onScroll = (): void => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressInner.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Photo slots: swap in the real portrait the moment public/rajpal.jpg exists.
  const probe = new Image();
  probe.onload = (): void => {
    photoImg.src = probe.src;
    photoImg.hidden = false;
    monogram.hidden = true;
    badgeImg.src = probe.src;
    badgeImg.hidden = false;
    badgeMonogram.hidden = true;
  };
  probe.src = `./${identity.photoFile}`;

  // Resume slots: reveal the resume buttons only when the PDF is deployed.
  // The content-type check keeps dev SPA fallbacks from faking a hit.
  fetch(`./${identity.resumeFile}`, { method: 'HEAD' })
    .then((res) => {
      const type = res.headers.get('content-type') ?? '';
      if (res.ok && (type.includes('pdf') || type.includes('octet-stream'))) {
        resumePill.hidden = false;
        resumeBtn.hidden = false;
        resumeFooterLink.hidden = false;
      }
    })
    .catch(() => undefined);
}
