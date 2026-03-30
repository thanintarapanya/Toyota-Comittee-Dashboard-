import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ISUZU Engineering Dashboard',
  description: 'High-performance racing telemetry and engineering dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-grid-layout/1.4.4/css/styles.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-resizable/3.0.5/css/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
