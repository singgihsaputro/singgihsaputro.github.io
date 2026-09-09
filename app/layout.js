import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Reveal from '@/components/Reveal'
import { profile, education, skills } from '@/data/cv'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const url = 'https://singgihsaputro.github.io'

export const metadata = {
  metadataBase: new URL(url),
  title: `${profile.name} — ${profile.roles[0]}`,
  description: profile.summary,
  alternates: { canonical: '/' },
  authors: [{ name: profile.name, url }],
  creator: profile.name,
  keywords: [profile.name, 'Android Engineer', 'Jakarta', profile.company, ...skills.flatMap((s) => s.items)],
  openGraph: {
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
    url,
    siteName: profile.name,
    images: [{ url: profile.avatar, width: 460, height: 460, alt: profile.name }],
    type: 'profile',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
    images: [profile.avatar],
  },
}

// Google reads this for the knowledge panel / rich result. Keep it in sync with data/cv.js.
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url,
  image: profile.avatar,
  jobTitle: profile.roles[0],
  description: profile.summary,
  email: `mailto:${profile.email}`,
  worksFor: { '@type': 'Organization', name: profile.company },
  address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
  knowsAbout: skills.flatMap((s) => s.items),
  sameAs: [profile.github, profile.linkedin].filter(Boolean),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-ink text-fg selection:bg-accent/25">
        {children}
        <Reveal />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </body>
    </html>
  )
}
