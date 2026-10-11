/**
 * RAJPAL GELOT PORTFOLIO: ALL CONTENT LIVES IN THIS ONE FILE.
 * Data sources: github.com/rajpalgelot-tech (repos, languages, READMEs)
 * plus the details already public on the previous portfolio.
 * Photos, resume and any link marked PENDING are slotted in later;
 * see GUIDE.md for the exact list.
 */

export const identity = {
  firstName: 'RAJPAL',
  fullName: 'Rajpal Gelot',
  handle: 'rajpalgelot',
  githubUser: 'rajpalgelot-tech',
  role: 'Software Developer & Systems Programmer',
  email: 'rajpalgelot16705@gmail.com',
  location: 'United States [EST]',
  responseWindow: 'Within 24-48h',
  status: 'STATUS // OPEN TO INTERNSHIPS',
  // Photo slots: drop these files into public/ and they appear automatically.
  photoFile: 'rajpal.jpg',
  resumeFile: 'RajpalResume.pdf'
};

export const githubProfileUrl = 'https://github.com/rajpalgelot-tech';
export const linkedinUrl = 'https://www.linkedin.com/in/rajpal-gelot-825b29298';

export const tagline =
  'Building systems software you can open and break: a SQL engine written from ' +
  'scratch in C++ and compiled to WebAssembly, a Raft cluster that heals itself, ' +
  'a blockchain that proves its own tamper, all running live in the browser.';

export const philosophy = 'Build it from scratch, then let people break it.';

export type HeroRole = {
  index: string;
  domain: string;
  title: string;
  tools: string;
};

export const heroRoles: HeroRole[] = [
  {
    index: '01',
    domain: 'SYSTEMS & DATABASES',
    title: 'Systems Developer',
    tools: 'C++ \u2022 WebAssembly \u2022 B+Trees \u2022 WAL'
  },
  {
    index: '02',
    domain: 'ARCHITECTURE & PLATFORMS',
    title: 'Full Stack Developer',
    tools: 'TypeScript \u2022 React \u2022 Node \u2022 CI/CD'
  },
  {
    index: '03',
    domain: 'ALGORITHMS & SIMULATION',
    title: 'Simulation Engineer',
    tools: 'Raft \u2022 CRDTs \u2022 Pipelines \u2022 Regex'
  }
];

export const tickerItems: string[] = [
  'RAJPAL GELOT',
  'RAJPALGELOT-TECH',
  'SOFTWARE DEVELOPER',
  'SYSTEMS PROGRAMMER',
  'FULL STACK DEVELOPER',
  'DATABASES FROM SCRATCH',
  'DISTRIBUTED SYSTEMS',
  'CLEVELAND STATE UNIVERSITY',
  'SYSTEMS ONLINE'
];

export const bioShort =
  'I am a computer science student at Cleveland State University (class of 2027) ' +
  'and a software developer. I learn systems the honest way: I build them from ' +
  'scratch, wire a playground around them, and let anyone poke at the moving parts.';

export const bioFull: string[] = [
  'Every project on this page is a real engine with no borrowed core. RajSQL is a ' +
  'SQL database in C++17: its own lexer, parser, paged storage, B+tree and ' +
  'write-ahead log, compiled to WebAssembly so the crash-recovery demo runs in a ' +
  'browser tab. The Raft simulator implements the consensus paper end to end: ' +
  'elections, log replication, network partitions and chaos mode.',
  'The rest of the shelf works the same way: a blockchain with SHA-256 written ' +
  'from scratch that passes the NIST test vectors, a five-stage CPU pipeline with ' +
  'honest hazards and forwarding, a regex engine that shows Thompson NFA and ' +
  'subset DFA construction live, and a memory allocator you can fragment with ' +
  'your own hands.',
  'On the application side I ship full-stack TypeScript with the same discipline: ' +
  'a job application tracker with response and offer analytics, and a campus ' +
  'resource booking platform with real conflict detection. Both carry deterministic ' +
  'test suites and green CI pipelines on every push.',
  'Currently looking for software engineering internships where systems work and ' +
  'product work meet. If that sounds like your team, the Connect section opens ' +
  'straight into my inbox.'
];

export type StackItem = {
  name: string;
  icon: string;
  color: string;
};

export const stack: StackItem[] = [
  { name: 'TypeScript', icon: 'typescript', color: '#3178c6' },
  { name: 'C++', icon: 'cplusplus', color: '#649ad2' },
  { name: 'JavaScript', icon: 'javascript', color: '#f7df1e' },
  { name: 'Python', icon: 'python', color: '#4b8bbe' },
  { name: 'SQL', icon: 'sql', color: '#9ca3af' },
  { name: 'HTML5', icon: 'html5', color: '#e8622c' },
  { name: 'CSS3', icon: 'css3', color: '#3c99d4' },
  { name: 'WebAssembly', icon: 'wasm', color: '#c4c9d4' },
  { name: 'Emscripten', icon: 'emscripten', color: '#5bc0de' },
  { name: 'CMake', icon: 'cmake', color: '#1e9c46' },
  { name: 'Shell', icon: 'shell', color: '#89e051' },
  { name: 'Node.js', icon: 'nodejs', color: '#5fa04e' },
  { name: 'React', icon: 'react', color: '#61dafb' },
  { name: 'Vite', icon: 'vite', color: '#41d1ff' },
  { name: 'Vitest', icon: 'vitest', color: '#fcc72b' },
  { name: 'Git', icon: 'git', color: '#f05033' },
  { name: 'GitHub Actions', icon: 'actions', color: '#d1d5db' },
  { name: 'Tailwind CSS', icon: 'tailwind', color: '#38bdf8' }
];

export type ProjectCategory = 'Systems' | 'Distributed' | 'Algorithms' | 'Full Stack';

export type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  tags: string[];
  poster: string;
  sourceUrl: string;
  liveUrl: string;
  liveLabel: string;
};

const pages = 'https://rajpalgelot-tech.github.io';

export const projects: Project[] = [
  {
    id: 'rg-sql',
    name: 'RajSQL',
    category: 'Systems',
    tagline:
      'A SQL database engine written from scratch in C++17 and compiled to ' +
      'WebAssembly: paged storage, a disk-backed B+tree, and a write-ahead log ' +
      'with real crash recovery, running joins in a browser tab.',
    tags: ['C++17', 'WebAssembly', 'Emscripten', 'B+Tree', 'WAL'],
    poster: './projects/rg-sql.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/RG-sql',
    liveUrl: `${pages}/RG-sql/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'raft',
    name: 'Raft',
    category: 'Distributed',
    tagline:
      'Five Raft nodes elect a leader, replicate a log, and survive crashes and ' +
    'partitions, implemented from the paper in TypeScript. Kill the leader, ' +
      'split the network, or turn on chaos mode and watch the cluster heal.',
    tags: ['TypeScript', 'Leader Election', 'Log Replication', 'Partitions'],
    poster: './projects/raft.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/Raft-consensus-simulator',
    liveUrl: `${pages}/Raft-consensus-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'blockchain',
    name: 'Chain',
    category: 'Algorithms',
    tagline:
      'A tiny blockchain you can mine, tamper with, and repair in the browser. ' +
      'SHA-256 written from scratch against the NIST test vectors, live proof of ' +
      'work, and tamper evidence that cascades down the chain.',
    tags: ['TypeScript', 'SHA-256', 'Proof of Work', 'Tamper Evidence'],
    poster: './projects/blockchain.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/blockchain-simulator',
    liveUrl: `${pages}/blockchain-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    category: 'Systems',
    tagline:
      'A five-stage CPU pipeline simulator: write tiny assembly, step cycle by ' +
      'cycle, and watch data hazards get forwarded, load-use stalls blow bubbles, ' +
      'and taken branches flush the younger instructions.',
    tags: ['TypeScript', 'Data Hazards', 'Forwarding', 'Branch Flush'],
    poster: './projects/cpu-pipeline.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/cpu-pipeline-simulator',
    liveUrl: `${pages}/cpu-pipeline-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'regex',
    name: 'Regex',
    category: 'Algorithms',
    tagline:
      'A regex engine built the way the textbooks teach it: Thompson NFA ' +
      'construction state by state, subset-construction DFA table, and a live ' +
      'match trace for every character of your test input.',
    tags: ['TypeScript', 'NFA', 'DFA', 'Compilers'],
    poster: './projects/regex.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/regex-engine-simulator',
    liveUrl: `${pages}/regex-engine-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'heap',
    name: 'Heap',
    category: 'Systems',
    tagline:
      'A memory allocator you can break with your own hands: malloc and free on ' +
      '128 words with three classic fit strategies, a fragmentation score, and a ' +
      'compact button that slides everything back together.',
    tags: ['TypeScript', 'Fit Strategies', 'Fragmentation', 'Compaction'],
    poster: './projects/memory-allocator.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/memory-allocator-simulator',
    liveUrl: `${pages}/memory-allocator-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'crdt',
    name: 'Sync',
    category: 'Distributed',
    tagline:
      'Two collaborative text replicas on an RGA CRDT: type on both sides, watch ' +
      'them diverge, press sync, and watch the merge converge both replicas to ' +
      'the exact same string.',
    tags: ['TypeScript', 'RGA CRDT', 'Convergence', 'Replicas'],
    poster: './projects/crdt.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/crdt-text-simulator',
    liveUrl: `${pages}/crdt-text-simulator/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'job-tracker',
    name: 'Job Tracker',
    category: 'Full Stack',
    tagline:
      'A job application tracker with analytics: five statuses, response and ' +
      'offer rates, weekly application bars, source breakdowns, and CSV export, ' +
      'all persisted locally with a deterministic test suite.',
    tags: ['TypeScript', 'Vitest', 'localStorage', 'CSV Export'],
    poster: './projects/job-tracker.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/Job-Application-Tracker-Analytics',
    liveUrl: `${pages}/Job-Application-Tracker-Analytics/`,
    liveLabel: 'Live Demo'
  },
  {
    id: 'booking',
    name: 'Campus Booking',
    category: 'Full Stack',
    tagline:
      'A campus event and resource booking platform: rooms and equipment with ' +
      'real conflict detection, cancel-and-rebook flows, upcoming schedules, and ' +
      'usage summaries, backed by deterministic scheduler tests.',
    tags: ['TypeScript', 'Vitest', 'Conflict Detection', 'Scheduling'],
    poster: './projects/campus-booking.png',
    sourceUrl: 'https://github.com/rajpalgelot-tech/Campus-Event-Resource-Booking-Platform',
    liveUrl: `${pages}/Campus-Event-Resource-Booking-Platform/`,
    liveLabel: 'Live Demo'
  }
];

export const projectFilters: { key: string; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'Systems', label: 'SYSTEMS' },
  { key: 'Distributed', label: 'DISTRIBUTED' },
  { key: 'Algorithms', label: 'ALGORITHMS' },
  { key: 'Full Stack', label: 'FULL STACK' }
];

export const specializations: string[] = [
  'Systems Programming',
  'Full-Stack Platforms',
  'Databases & Storage',
  'Distributed Systems'
];

export const footerStatus = 'SYSTEM STATUS: ALL PROJECTS LIVE';
