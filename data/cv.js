// ─────────────────────────────────────────────────────────────
// Everything on the site comes from this file. Edit here only.
// Source: CV_Singgih_2026_H2_full.pdf
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Singgih Rochmad Saputro',
  // Rotates in the hero, one after another.
  roles: [
    'Senior Android Engineer',
    'Kotlin · Jetpack Compose',
    'Server-Driven UI',
    '10 years shipping mobile',
  ],
  location: 'Jakarta, Indonesia',
  company: 'Gojek',
  email: 'singgih.rochmad@gmail.com',
  github: 'https://github.com/singgihsaputro',
  linkedin: 'https://www.linkedin.com/in/singgihrs/',
  // Your CV lists +6285791476203. Left off on purpose — a public page gets scraped.
  // Set it here only if you want it visible: phone: '+62 857-9147-6203',
  phone: '',
  avatar: 'https://avatars.githubusercontent.com/u/3947112?v=4',
  resume: '', // Drop the PDF in /public and set e.g. '/singgih-cv.pdf'
  summary:
    'Senior Android Engineer with 10 years building consumer and merchant apps at ' +
    "Indonesia's largest technology companies, including products with 100M+ downloads. " +
    'Recent focus on server-driven UI, anti-fraud and KYC integration, and app size and ' +
    'performance optimization. I lead cross-team delivery and mentor senior engineers.',
}

export const stats = [
  { value: '10 yrs', label: 'Building Android' },
  { value: '100M+', label: 'Downloads on apps shipped' },
  { value: '1st / 74', label: 'GoTo Hackathon 2025' },
]

export const skills = [
  {
    group: 'Android Native',
    items: ['Kotlin', 'Jetpack Compose', 'MVVM', 'MVI', 'Coroutines', 'Flow', 'Multi-Module Architecture', 'Clean Architecture'],
  },
  { group: 'Flutter', items: ['Dart', 'State Management', 'Git'] },
  { group: 'Backend', items: ['Java', 'Spring Boot', 'Unit Test', 'Integration Test'] },
  { group: 'Web', items: ['JavaScript', 'AngularJS', 'PHP', 'HTML', 'SQL'] },
]

export const experience = [
  {
    role: 'Senior Software Engineer (Android)',
    company: 'Gojek (GoTo Company)',
    period: 'November 2019 — Present',
    location: 'Jakarta, Indonesia',
    context:
      "Indonesia's largest tech group (Gojek + Tokopedia). GoFood Merchant is the merchant app for F&B owners nationwide, with 5M+ downloads.",
    points: [
      'Layout and campaign changes needed a full app release. Implemented server-driven UI, so new initiatives now launch through configuration.',
      'Bank account changes drove 3,000 manual tickets monthly. Built a self-serve flow with real-time FRS risk checks, removing the ticket load.',
      'Merchant sentiment was invisible after release. Built a reusable feedback module that collected 56,290 responses at 4.65/5 average.',
      'Corporate onboarding was hard to extend. Led MVI adoption, migrated to ViewBinding, and split Help Center and Onboarding into 2 modules.',
      'Oversized APK raised install friction. Cut ~10MB via rebranding cleanup, POS build optimization, and legacy flow removal.',
      'Web lacked native capabilities. Built a JS Bridge letting WebView invoke native Android functions, unlocking 1-2 financial features.',
      'Team was scaling under hiring pressure. Onboarded 3 Senior Android Engineers, ran interview panels and sprint capacity planning.',
      'New hires needed production-ready skills. Coached 23 GoTo bootcampers over 4 days and led curriculum design.',
    ],
  },
  {
    role: 'Practitioner Lecturer',
    company: 'Ministry of Education, Culture, Research, and Technology',
    period: '2022 — 2025',
    location: 'Jakarta, Indonesia',
    context:
      'National "Praktisi Mengajar" program placing industry practitioners into university classrooms.',
    points: [
      'Universities lacked hands-on mobile teaching capacity. Taught Android native and Flutter at 5 universities.',
      'Students had little industry visibility. Delivered guest lectures on the software engineering career path.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'DANA',
    period: 'July 2017 — October 2019',
    location: 'Jakarta, Indonesia',
    context:
      'Leading Indonesian digital wallet (backed by Ant Group), built from scratch and now at 100M+ downloads. Also delivered TIX ID, at 10M+ downloads.',
    points: [
      'TIX ID needed faster delivery. Led a 3-person offshore Android team, shipping 7+ features on a 10M+ download app.',
      'Images were oversized on low-end devices. Integrated Alicloud CDN with screen-aware resolution, improving load efficiency ~20%.',
      'Campaign links dropped users at app entry. Integrated Branch.io dynamic links and designed the token generation logic.',
      'Team depth limited delivery quality. Mentored 2 engineers, 1 Associate and 1 Staff Android Engineer.',
      'Backend dependencies blocked delivery. Contributed to Java Spring mobile gateways and user modules.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Ice House',
    period: 'October 2016 — June 2017',
    location: 'Jakarta, Indonesia',
    context:
      'Product consultancy building mobile and web products for enterprise and telco clients.',
    points: [
      "Client needed a payments app from zero. Built PayPro's first version end-to-end for Indosat.",
      'Boilerplate slowed delivery. Built reusable Android libraries adopted across projects.',
    ],
  },
]

export const education = [
  {
    school: 'University of Indonesia',
    degree: 'Master of Information Technology · GPA 3.42 / 4',
    period: '2023 — 2026',
    location: 'Jakarta, Indonesia',
  },
  {
    school: 'Brawijaya University',
    degree: 'Bachelor of Computer Science · GPA 3.53 / 4',
    period: '2011 — 2016',
    location: 'Malang, East Java, Indonesia',
  },
]

// Shipped products. `link` opens the Play Store listing.
export const projects = [
  {
    name: 'GoFood Merchant (GoBiz)',
    description: 'Merchant app for F&B owners across Indonesia.',
    metric: '5M+ downloads · 4.1★',
    tags: ['Kotlin', 'Jetpack Compose', 'MVVM', 'MVI', 'Multi-Module', 'Room', 'Retrofit', 'Coroutines', 'Flow'],
    link: 'https://play.google.com/store/apps/details?id=com.gojek.resto&hl=id',
  },
  {
    name: 'Gojek Consumer App',
    description:
      "Indonesia's #1 on-demand super-app for rides, food, and delivery. Prototyped the cross-app delivery initiative that won GoTo Hackathon 2025.",
    metric: '100M+ downloads · 4.7★',
    tags: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Multi-Module', 'Clean Arch', 'Coroutines', 'Flow', 'Firebase'],
    link: 'https://play.google.com/store/apps/details?id=com.gojek.app&hl=id',
  },
  {
    name: 'GoPay',
    description:
      'Digital wallet covering QRIS, transfers, and bills. Extended the delivery initiative across both consumer apps.',
    metric: '100M+ downloads · 4.7★',
    tags: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Multi-Module', 'Clean Arch', 'Coroutines', 'Flow'],
    link: 'https://play.google.com/store/apps/details?id=com.gojek.gopay&hl=id',
  },
  {
    name: 'TIX ID',
    description: 'Cinema and event ticketing for moviegoers across Indonesia.',
    metric: '10M+ downloads · 4.8★',
    tags: ['Kotlin', 'Java', 'Room', 'RxJava2', 'Dagger2', 'Retrofit', 'MVP', 'Clean Arch'],
    link: 'https://play.google.com/store/apps/details?id=id.tix.android&hl=en',
  },
  {
    name: 'DANA',
    description: 'National digital wallet built from scratch, licensed by Bank Indonesia.',
    metric: '100M+ downloads · 4.7★',
    tags: ['Java', 'Room', 'RxJava2', 'Dagger2', 'Retrofit', 'MVP', 'Clean Arch'],
    link: 'https://play.google.com/store/apps/details?id=id.dana&hl=en',
  },
  {
    name: 'PayPro',
    description: 'Fintech payment app for Indosat subscribers — white-label client project.',
    metric: 'Built end-to-end',
    tags: ['Java', 'RxJava', 'Dagger2', 'ORM', 'Retrofit', 'Firebase', 'MVP', 'Clean Arch'],
    link: '',
  },
]

export const awards = [
  {
    title: 'Champion, GoTo Hackathon',
    org: 'GoTo Company',
    date: 'November 2025',
    note: 'Team "Kompor" — a delivery feature linking the Gojek and GoPay consumer apps. 1st of 74 teams across Indonesia, India, Singapore, and China.',
  },
  {
    title: '2nd Winner, Hackathon Google Indonesia Android Kejar',
    org: 'Google with Ministry of Education',
    date: 'May 2016',
    note: 'Mobile solution for education reporting.',
  },
  {
    title: '1st Winner, Inovasi Teknologi (INOTEK) East Java — IT Category',
    org: 'BALITBANG East Java',
    date: 'January 2015',
    note: '',
  },
  {
    title: 'Winner, Mobile Apps Development Competition — Health & Fitness',
    org: 'Vocational Computer Festival, Gadjah Mada University',
    date: 'January 2014',
    note: '',
  },
  {
    title: 'Finalist & Best Category in "World Citizenship", IDTECH',
    org: 'Microsoft',
    date: 'January 2014',
    note: '',
  },
]

// Public GitHub repos — side experiments, shown as a compact list.
export const openSource = [
  { name: 'pokemon-kotlin-multiplatform-mobile', blurb: 'Shared Kotlin logic driving native Android and iOS', year: '2026' },
  { name: 'weekly-checklist', blurb: 'React + Express + SQLite task board', year: '2026' },
  { name: 'flutter_api_restaurant_sample', blurb: 'Flutter client over a REST API', year: '2024' },
  { name: 'DesignPattern-Kotlin', blurb: 'GoF patterns written idiomatically in Kotlin', year: '2017' },
  { name: 'KumpulinSampah', blurb: 'Android app for collecting and trading recyclable waste', year: '2016' },
  { name: 'Web-DSS-AHP', blurb: 'Decision support system using Analytic Hierarchy Process', year: '2019' },
]
