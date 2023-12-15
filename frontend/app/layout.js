import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'News Feed',
  description: 'Personalized news feed',
}

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  )
}
