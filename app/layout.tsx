import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Lora } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'Registre civil de Bukavu',
  description: 'Gestion sécurisée des actes de mariage et de divorce de la ville de Bukavu.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#101411' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" suppressHydrationWarning className={`bg-background ${geist.variable} ${geistMono.variable} ${lora.variable}`}><body className="font-sans antialiased"><TooltipProvider>{children}<Toaster /></TooltipProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
