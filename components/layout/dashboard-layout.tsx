'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, FileCheck2, Gavel, History, LayoutDashboard, Menu, ShieldCheck, UserRound, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const navigation = [
  { id: 'dashboard', href: '/dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'citizens', href: '/citizens', label: 'Citoyens', icon: Users },
  { id: 'marriages', href: '/marriages', label: 'Registre des mariages', icon: FileCheck2 },
  { id: 'divorces', href: '/divorces', label: 'Registre des divorces', icon: Gavel },
  { id: 'audit', href: '/audit', label: 'Journal d’audit', icon: History, adminOnly: true },
]

function Seal() {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground">
      <ShieldCheck className="size-5" aria-hidden="true" />
    </div>
  )
}

import { logout } from '@/app/actions/auth'

function SideNav({ role, setMobileOpen }: { role: string; setMobileOpen?: (val: boolean) => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 p-5">
        <Seal />
        <div>
          <p className="font-serif text-sm font-bold leading-tight">État civil</p>
          <p className="text-xs text-sidebar-foreground/60">Ville de Bukavu</p>
        </div>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
          Registres
        </p>
        {navigation
          .filter((item) => !item.adminOnly || role === 'ADMIN')
          .map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
      </nav>
      <div className="p-4">
        <form action={logout}>
          <Button variant="outline" className="w-full text-xs">
            Se déconnecter
          </Button>
        </form>
      </div>
    </div>
  )
}

export function DashboardLayout({
  children,
  user
}: {
  children: React.ReactNode
  user: { username: string; role: string }
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const roleLabel = user.role === 'ADMIN' ? 'Administrateur' : 'Officier d’état civil'

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block">
        <SideNav role={user.role} />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir la navigation" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SideNav role={user.role} setMobileOpen={setMobileOpen} />
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold">{user.username}</p>
              <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <UserRound className="size-4" />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
