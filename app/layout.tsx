import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vigil — AI Relationship Investigator',
  description: 'Discover the truth about your partner with a calm, methodical AI investigator. Available 24/7. Zero judgment. Private and secure.',
  keywords: ['relationship investigator', 'cheating partner', 'infidelity', 'AI investigator', 'relationship advice'],
  authors: [{ name: 'Vigil' }],
  openGraph: {
    title: 'Vigil — AI Relationship Investigator',
    description: 'Discover the truth about your partner. Private. Methodical. Available at 2am.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vigil — AI Relationship Investigator',
    description: 'Discover the truth about your partner. Private. Methodical. Available at 2am.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vigil',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0e0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Vigil',
              applicationCategory: 'LifestyleApplication',
              description: 'AI-powered relationship investigator that helps you find the truth about suspected infidelity — methodically, legally, and privately.',
              offers: [
                {
                  '@type': 'Offer',
                  price: '9.99',
                  priceCurrency: 'USD',
                  description: 'Weekly plan — unlimited conversations and all investigation modules',
                },
                {
                  '@type': 'Offer',
                  price: '29.99',
                  priceCurrency: 'USD',
                  description: 'Monthly plan — full access including confrontation toolkit',
                },
              ],
              operatingSystem: 'Web',
              url: 'https://catch-agent.vercel.app',
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
