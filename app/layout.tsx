import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'

import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

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
  other: {
    'dicoding:email': 'maksalbusiness@gmail.com',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="dicoding:email" content="maksalbusiness@gmail.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-sans antialiased text-slate-900 dark:text-slate-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
