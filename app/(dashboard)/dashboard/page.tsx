'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileCheck2, FileText, Gavel, History, Plus, Users, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { apiFetch } from '@/lib/api-client'

interface AuditLog {
  id: number
  entity: string
  summary: string
  actor: string
  createdAt: string
}

export default function DashboardPage() {
  const [citizenCount, setCitizenCount] = useState(0)
  const [marriageCount, setMarriageCount] = useState(0)
  const [divorceCount, setDivorceCount] = useState(0)
  const [activeMarriages, setActiveMarriages] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        // For now, we'll fetch from individual endpoints
        // In a real app, you'd have a dedicated dashboard stats endpoint
        const [citizens, marriages, divorces] = await Promise.all([
          apiFetch('/citizens'),
          apiFetch('/marriages'),
          apiFetch('/divorces')
        ])
        
        setCitizenCount(citizens?.length || 0)
        setMarriageCount(marriages?.length || 0)
        setDivorceCount(divorces?.length || 0)
        
        // Calculate active marriages (those without divorce)
        const active = marriages?.filter((m: any) => !m.divorce).length || 0
        setActiveMarriages(active)
        
        // Mock user count for now
        setUserCount(2)
        
        // Mock audit logs for now
        setAuditLogs([])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    
    fetchDashboardData()
  }, [])

  const stats = [
    { label: 'Citoyens enregistres', value: citizenCount, note: 'Fiches d\'identite civile', icon: Users, color: 'text-blue-600' },
    { label: 'Mariages actifs', value: activeMarriages, note: 'Unions en cours', icon: FileCheck2, color: 'text-green-600' },
    { label: 'Total mariages', value: marriageCount, note: 'Tous statuts confondus', icon: FileCheck2, color: 'text-purple-600' },
    { label: 'Divorces', value: divorceCount, note: 'Decisions de justice', icon: Gavel, color: 'text-red-600' },
    { label: 'Utilisateurs actifs', value: userCount, note: 'Officiers et admins', icon: ShieldCheck, color: 'text-orange-600' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Tableau de bord</p>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-balance">Vue d'ensemble</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Voici la situation des registres d'etat civil de la ville de Bukavu.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-muted hover:text-foreground h-8 gap-1.5 px-2.5 text-sm font-medium transition-all">
            <BookOpen className="mr-2 h-4 w-4" />
            Rapports
          </Link>
          <Link href="/marriages" className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 h-8 gap-1.5 px-2.5 text-sm font-medium transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel acte
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardDescription className="text-xs">{stat.label}</CardDescription>
                <CardTitle className="font-serif text-2xl">{stat.value}</CardTitle>
              </div>
              <div className={`flex size-8 items-center justify-center rounded-lg bg-secondary ${stat.color}`}>
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
                <CardTitle>Activite recente</CardTitle>
                <CardDescription>Dernieres operations sur les registres</CardDescription>
              </div>
              <Link href="/audit" className="inline-flex items-center justify-center rounded-lg hover:bg-muted hover:text-foreground h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium transition-all">
                Tout voir
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activite recente.</p>
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

        <Card>
          <CardHeader>
            <CardTitle>Statistiques rapides</CardTitle>
            <CardDescription>Indicateurs cles de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-sm">Taux de mariages actifs</span>
              </div>
              <span className="font-semibold">
                {marriageCount > 0 ? Math.round((activeMarriages / marriageCount) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                <span className="text-sm">Moyenne par citoyen</span>
              </div>
              <span className="font-semibold">
                {citizenCount > 0 ? (marriageCount / citizenCount).toFixed(2) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="size-4 text-red-600" />
                <span className="text-sm">Taux de divorce</span>
              </div>
              <span className="font-semibold">
                {marriageCount > 0 ? Math.round((divorceCount / marriageCount) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
