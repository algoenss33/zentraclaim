import type { Metadata, Viewport } from 'next'
import { Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Web3Provider } from '@/components/providers/web3-provider'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zentra Wallet Airdrop Claim Portal',
  description: 'Claim your ZNTR airdrop with your registered Zentra Wallet address and email.',
  icons: {
    icon: '/zentra.png',
    apple: '/zentra.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background ${robotoMono.variable}`}>
      <body className="font-sans antialiased">
        <Web3Provider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Web3Provider>
      </body>
    </html>
  )
}
