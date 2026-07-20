import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KarsaOS | Asisten Keuangan & Strategi UMKM',
  description:
    'KarsaOS membantu pemilik UMKM mencatat transaksi lewat suara, menganalisis kondisi keuangan, dan mengambil keputusan usaha secara terukur.',
  generator: 'v0.app',
  icons: {
    icon: '/karsaos.png',
    shortcut: '/karsaos.png',
    apple: '/karsaos.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFF8F0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`light ${plusJakarta.variable}`}>
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
