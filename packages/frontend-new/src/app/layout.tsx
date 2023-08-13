import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Political capital two',
  description: 'PC2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
