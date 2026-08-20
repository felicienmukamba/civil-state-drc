'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, FileCheck2, Gavel, History, LayoutDashboard, Menu, ShieldCheck, UserRound, Users, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { logout } from '@/app/actions/auth'
import { Toast } from '@/lib/utils/toast'

const navigation = [
  { id: 'dashboard', href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'citizens', href: '/citizens', label: 'Citoyens', icon: Users },
  { id: 'marriages', href: '/marriages', label: 'Registre des mariages', icon: FileCheck2 },
  { id: 'divorces', href: '/divorces', label: 'Registre des divorces', icon: Gavel },
  { id: 'reports', href: '/reports', label: 'Rapports', icon: BookOpen },
  { id: 'audit', href: '/audit', label: 'Journal d\'audit', icon: History, adminOnly: true },
  { id: 'users', href: '/users', label: 'Utilisateurs', icon: Settings, adminOnly: true },
]

function Seal() {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground">
      <ShieldCheck className="size-5" aria-hidden="true" />
    </div>
  )
}

function SideNav({ role, setMobileOpen, onLogout }: { role: string; setMobileOpen?: (val: boolean) => void; onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 p-5">
        <Seal />
        <div>
          <p className="font-serif text-sm font-bold leading-tight">Etat civil</p>
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
        <Link 
          href="/profile" 
          className="block mb-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
        >
          <UserRound className="size-4" />
          Mon profil
        </Link>
        <Button 
          variant="outline" 
          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="mr-2 size-4" />
          Se deconnecter
        </Button>
      </div>
    </div>
  )
}

export function DashboardLayout({
  children,
  user
}: {
  children: React.ReactNode
  user: { username: string; role: string; id: number }
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const roleLabel = user.role === 'ADMIN' ? 'Administrateur' : 'Officier d\'etat civil'

  const handleLogout = async () => {
    await logout()
    Toast.success('Deconnexion reussie')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block">
        <SideNav role={user.role} onLogout={handleLogout} />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger 
              className="lg:hidden inline-flex items-center justify-center rounded-lg hover:bg-muted hover:text-foreground size-8 gap-1.5 transition-all"
              aria-label="Ouvrir la navigation"
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SideNav role={user.role} setMobileOpen={setMobileOpen} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" aria-label="Menu utilisateur">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <UserRound className="size-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{roleLabel}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <UserRound className="mr-2 size-4" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Se deconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
