import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'hoardy.ai — Built for brands. Ready for agents.',
  description:
    'AI assistants, product development, web & VR. hoardy.ai ships what moves your business forward — from concept to launch, with quality baked in.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
