import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import './globals.css'

import { JetBrains_Mono, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://robust.iverfinne.no'),
  title: {
    default: 'Foreningen ROBUST - Post-kapitalistisk fremtid',
    template: '%s | Foreningen ROBUST',
  },
  description: 'En kunnskapskollektiv om degrowth, post-kapitalistiske fremtider og bærekraftig samfunnsutvikling. ROBUST arbeider for systemendring gjennom forskning, dialog og handling.',
  keywords: ['degrowth', 'post-kapitalisme', 'bærekraft', 'ROBUST', 'Norge', 'samfunnsendring', 'klimakrise', 'økologi', 'solidaritet'],
  authors: [{ name: 'Foreningen ROBUST' }],
  creator: 'Foreningen ROBUST',
  publisher: 'Foreningen ROBUST',
  generator: 'v0.app',
  applicationName: 'ROBUST',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ROBUST',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'no_NO',
    url: 'https://robust.iverfinne.no',
    siteName: 'Foreningen ROBUST',
    title: 'Foreningen ROBUST - Post-kapitalistisk fremtid',
    description: 'En kunnskapskollektiv om degrowth, post-kapitalistiske fremtider og bærekraftig samfunnsutvikling.',
    images: [
      {
        url: '/robust-logo.png',
        width: 1200,
        height: 630,
        alt: 'ROBUST Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foreningen ROBUST',
    description: 'En kunnskapskollektiv om degrowth og post-kapitalistiske fremtider',
    images: ['/robust-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://robust.iverfinne.no',
  },
}

export const viewport: Viewport = {
  themeColor: '#e3160b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Foreningen ROBUST',
    url: 'https://robust.iverfinne.no',
    logo: 'https://robust.iverfinne.no/robust-logo.png',
    description: 'En kunnskapskollektiv om degrowth og post-kapitalistiske fremtider',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      availableLanguage: 'Norwegian',
    },
  };

  return (
    <html lang="no">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <AnalyticsTracker />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
