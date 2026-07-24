import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, BookOpen, CircleAlert, FileCheck2, FileText, Gavel, History, LayoutDashboard, Menu, Plus, Search, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const [citizenCount, marriageCount, divorceCount, auditLogs] = await Promise.all([
    db.citizen.count(),
    db.marriage.count(),
    db.divorce.count(),
    // @ts-ignore
    db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  const stats = [
    { label: 'Citoyens enregistrés', value: citizenCount, note: 'Fiches d’identité civile', icon: Users },
    { label: 'Mariages', value: marriageCount, note: 'Tous statuts confondus', icon: FileCheck2 },
    { label: 'Divorces', value: divorceCount, note: 'Décisions de justice', icon: Gavel },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Tableau de bord</p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-balance">Vue d'ensemble</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Voici la situation des registres d’état civil de la ville de Bukavu.</p>
        </div>
        <Button render={<Link href="/marriages" />}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel acte
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="mt-2 font-serif text-3xl">{stat.value}</CardTitle>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Dernières opérations sur les registres</CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/audit" />}>
                Tout voir
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
            ) : (
              auditLogs.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-secondary">
                    <FileText className="size-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{event.entity}</p>
                    <p className="truncate text-xs text-muted-foreground">{event.summary} · {event.actor}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
