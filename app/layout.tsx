import { Analytics } from '@vercel/analytics/next'
import { Cormorant_Garamond } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Soothing Interiors | Luxury Interior Design in Kampala',
  description:
    'Bespoke interior design and complete spatial experiences for distinguished residential, commercial, hospitality, healthcare and retail spaces across Africa and beyond.',
  icons: {
    icon: '/Soothing_Interiors-04.png',
    apple: '/Soothing_Interiors-04.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#181b1e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}