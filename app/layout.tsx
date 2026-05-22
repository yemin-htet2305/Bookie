import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { IBM_Plex_Serif, Mona_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});


export const metadata: Metadata = {
  title: 'Bookie',
  description: 'AI generated book summaries, powered by OpenAI and Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans antialiased bg-background`}>
        <ClerkProvider>
          <Navbar/>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}