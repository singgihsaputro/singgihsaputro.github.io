// ─────────────────────────────────────────────────────────────
// Everything on the site comes from this file. Edit here only.
// Lines marked TODO are placeholders — replace with real details.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Singgih Rochmad Saputro',
  // Rotates in the hero, one after another.
  roles: ['Mobile Engineer', 'Android · Kotlin', 'Flutter & KMP', 'Engineer at Gojek'],
  location: 'Jakarta, Indonesia',
  company: 'Gojek',
  email: 'singgih.rochmad@gmail.com',
  github: 'https://github.com/singgihsaputro',
  linkedin: '', // TODO: paste your LinkedIn URL to show the button
  avatar: 'https://avatars.githubusercontent.com/u/3947112?v=4',
  resume: '', // TODO: drop a PDF in /public and set e.g. '/singgih-cv.pdf'
  summary:
    'Mobile engineer building Android apps at scale. Writing Kotlin since 2016 — ' +
    'from RxJava and Java to Jetpack Compose, Flutter, and Kotlin Multiplatform. ' +
    'I care about apps that stay fast and code that stays boring.',
}

// Rough numbers shown under the hero. Adjust to taste.
export const stats = [
  { value: '10+', label: 'Years shipping mobile' },
  { value: '31',  label: 'Public repositories' },
  { value: '2016', label: 'Writing Kotlin since' },
]

export const skills = [
  { group: 'Mobile',    items: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Coroutines', 'Flutter / Dart', 'Kotlin Multiplatform', 'Java'] },
  { group: 'Architecture', items: ['MVVM', 'Clean Architecture', 'Modularization', 'RxJava', 'Dependency Injection'] },
  { group: 'Backend & Web', items: ['Node.js', 'Express', 'React', 'Python', 'SQLite', 'REST APIs'] },
  { group: 'Tooling',   items: ['Gradle', 'Git', 'CI/CD', 'Firebase', 'Retrofit', 'Testing'] },
]

// TODO: replace every entry below with your real roles, companies and dates.
export const experience = [
  {
    role: 'TODO — your current title',
    company: 'Gojek',
    period: 'TODO — e.g. 2021 — Present',
    location: 'Jakarta, Indonesia',
    points: [
      'TODO — what you own, and the scale of it (users, modules, team size).',
      'TODO — one result with a number attached (crash rate, build time, adoption).',
      'TODO — something you led or improved beyond your own tickets.',
    ],
  },
  {
    role: 'TODO — previous title',
    company: 'TODO — previous company',
    period: 'TODO — e.g. 2018 — 2021',
    location: 'TODO',
    points: [
      'TODO — the main thing you built there.',
      'TODO — a technical decision you made and why.',
    ],
  },
]

// TODO: add your degree, university and years — or delete this array to hide the section.
export const education = [
  {
    school: 'TODO — university',
    degree: 'TODO — degree',
    period: 'TODO — years',
  },
]

// Pulled from your public GitHub. Reorder, trim, or add private highlights.
export const projects = [
  {
    name: 'Pokémon Kotlin Multiplatform Mobile',
    repo: 'https://github.com/singgihsaputro/pokemon-kotlin-multiplatform-mobile',
    description: 'Shared Kotlin business logic driving native Android and iOS clients.',
    tags: ['Kotlin', 'KMP', 'iOS', 'Android'],
    year: '2026',
  },
  {
    name: 'Weekly Checklist',
    repo: 'https://github.com/singgihsaputro/weekly-checklist',
    description: 'React + Express + SQLite task board. One process, one port, one file of data.',
    tags: ['React', 'Node.js', 'SQLite'],
    year: '2026',
  },
  {
    name: 'Restaurant App',
    repo: 'https://github.com/singgihsaputro/flutter_api_restaurant_sample',
    description: 'Flutter client over a REST API — lists, detail views, and state handling.',
    tags: ['Flutter', 'Dart', 'REST'],
    year: '2024',
  },
  {
    name: 'KumpulinSampah',
    repo: 'https://github.com/singgihsaputro/KumpulinSampah',
    description: 'Android app for posting, collecting and buying recyclable waste.',
    tags: ['Android', 'Java', 'Firebase'],
    year: '2016',
  },
  {
    name: 'Design Patterns in Kotlin',
    repo: 'https://github.com/singgihsaputro/DesignPattern-Kotlin',
    description: 'Classic GoF patterns written idiomatically in Kotlin.',
    tags: ['Kotlin', 'Patterns'],
    year: '2017',
  },
  {
    name: 'Web DSS-AHP',
    repo: 'https://github.com/singgihsaputro/Web-DSS-AHP',
    description: 'Decision support system implementing the Analytic Hierarchy Process.',
    tags: ['JavaScript', 'Algorithms'],
    year: '2019',
  },
]
