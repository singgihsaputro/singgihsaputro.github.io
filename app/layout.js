import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Reveal from '@/components/Reveal'
import { profile } from '@/data/cv'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const url = 'https://singgihsaputro.github.io'

export const metadata = {
  metadataBase: new URL(url),
  title: `${profile.name} — ${profile.roles[0]}`,
  description: profile.summary,
  openGraph: {
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
    url,
    siteName: profile.name,
    images: [profile.avatar],
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.summary,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-ink text-fg selection:bg-accent/25">
        {children}
        <Reveal />
      </body>
    </html>
  )
}
