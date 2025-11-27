import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Baby Sports Cards - Turn Your Baby into a Sports Star',
  description: 'Create adorable AI-generated sports trading cards featuring your baby as their favorite team\'s star player!',
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
