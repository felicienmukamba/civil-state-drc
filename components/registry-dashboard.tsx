"use client"

import { useMemo, useState } from 'react'
import { Activity, BookOpen, ChevronDown, CircleAlert, FileCheck2, FileText, Gavel, History, LayoutDashboard, Menu, Plus, Search, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { demoStore } from '@/lib/registry/store'
import type { Divorce, Marriage, Role } from '@/lib/registry/types'

const navigation = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'citizens', label: 'Citoyens', icon: Users },
  { id: 'marriages', label: 'Registre des mariages', icon: FileCheck2 },
  { id: 'divorces', label: 'Registre des divorces', icon: Gavel },
  { id: 'audit', label: 'Journal d’audit', icon: History, adminOnly: true },
  { id: 'api', label: 'Référence API', icon: BookOpen },
]
const roleLabels: Record<Role, string> = { ADMIN: 'Administrateur', OFFICIER_ETAT_CIVIL: 'Officier d’état civil', CONSULTATION: 'Consultation' }

function Seal() {
  return <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground"><ShieldCheck className="size-5" aria-hidden="true" /></div>
}

function SideNav({ active, role, onSelect }: { active: string; role: Role; onSelect: (id: string) => void }) {
  return <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
    <div className="flex items-center gap-3 p-5"><Seal /><div><p className="font-serif text-sm font-bold leading-tight">État civil</p><p className="text-xs text-sidebar-foreground/60">Ville de Bukavu</p></div></div>
    <Separator />
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
      <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">Registres</p>
      {navigation.filter((item) => !item.adminOnly || role === 'ADMIN').map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active === item.id ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}`}><item.icon className="size-4" aria-hidden="true" />{item.label}</button>)}
    </nav>
    <div className="p-4"><div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><Activity className="size-3.5" />Mode démonstration</div><p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/60">Données temporaires, réinitialisées au redémarrage.</p></div></div>
  </div>
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === 'VALIDE' ? 'default' : status === 'BROUILLON' ? 'secondary' : 'outline'}>{status === 'VALIDE' ? 'Validé' : status === 'BROUILLON' ? 'Brouillon' : 'Archivé'}</Badge>
}

function Overview({ setActive }: { setActive: (id: string) => void }) {
  const stats = [
    { label: 'Citoyens enregistrés', value: demoStore.citizens.length.toLocaleString('fr-FR'), note: 'Fiches d’identité civile', icon: Users },
    { label: 'Mariages en 2026', value: '84', note: '+12 depuis juin', icon: FileCheck2 },
    { label: 'Divorces en 2026', value: '17', note: '2 ce mois-ci', icon: Gavel },
    { label: 'Actes à valider', value: '6', note: 'Action requise', icon: CircleAlert },
  ]
  return <div className="flex flex-col gap-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-medium text-primary">Samedi 19 juillet 2026</p><h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-balance">Bonjour, Marie Kabuo</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Voici la situation des registres d’état civil de la ville de Bukavu.</p></div><Button onClick={() => setActive('marriages')}><Plus data-icon="inline-start" />Nouvel acte</Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <Card key={stat.label}><CardHeader className="flex-row items-start justify-between"><div><CardDescription>{stat.label}</CardDescription><CardTitle className="mt-2 font-serif text-3xl">{stat.value}</CardTitle></div><div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary"><stat.icon className="size-4" /></div></CardHeader><CardContent><p className="text-xs text-muted-foreground">{stat.note}</p></CardContent></Card>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Activité récente</CardTitle><CardDescription>Dernières opérations sur les registres</CardDescription></div><Button variant="ghost" size="sm" onClick={() => setActive('audit')}>Tout voir</Button></div></CardHeader><CardContent className="flex flex-col gap-1">{demoStore.audits.map((event) => <div key={event.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted"><div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-secondary"><FileText className="size-3.5 text-primary" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium">{event.entity}</p><p className="truncate text-xs text-muted-foreground">{event.summary} · {event.actor}</p></div><span className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleDateString('fr-FR')}</span></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>État des actes</CardTitle><CardDescription>Répartition des mariages enregistrés</CardDescription></CardHeader><CardContent className="flex flex-col gap-5"><div className="flex items-end gap-2"><span className="font-serif text-4xl font-bold">93%</span><span className="pb-1 text-sm text-muted-foreground">validés</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[93%] bg-primary" /></div><div className="flex flex-col gap-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Validés</span><strong>78</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Brouillons</span><strong>6</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Archivés</span><strong>14</strong></div></div></CardContent></Card>
    </div>
  </div>
}

function RegistryTable({ type, role }: { type: 'marriages' | 'divorces'; role: Role }) {
  const [query, setQuery] = useState('')
  const isMarriage = type === 'marriages'
  const rows = useMemo(() => (isMarriage ? demoStore.marriages : demoStore.divorces).filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())) as Array<Marriage & Divorce>, [isMarriage, query])
  return <div className="flex flex-col gap-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Registre légal</p><h1 className="mt-1 font-serif text-3xl font-bold">{isMarriage ? 'Actes de mariage' : 'Décisions de divorce'}</h1><p className="mt-2 text-sm text-muted-foreground">Rechercher, consulter et administrer les actes officiels.</p></div>{role !== 'CONSULTATION' && <Button><Plus data-icon="inline-start" />{isMarriage ? 'Nouveau mariage' : 'Nouveau divorce'}</Button>}</div><Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Référence, nom, officier…" className="pl-9" /></div><Button variant="outline">Tous les statuts<ChevronDown data-icon="inline-end" /></Button></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Référence</TableHead><TableHead>{isMarriage ? 'Parties' : 'Jugement'}</TableHead><TableHead>Date</TableHead><TableHead>Lieu / juridiction</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => isMarriage ? <TableRow key={row.id}><TableCell className="font-mono text-xs font-semibold">{row.reference}</TableCell><TableCell><p className="font-medium">{demoStore.citizenName(row.spouseOneId)}</p><p className="text-xs text-muted-foreground">et {demoStore.citizenName(row.spouseTwoId)}</p></TableCell><TableCell>{new Date(row.celebratedAt).toLocaleDateString('fr-FR')}</TableCell><TableCell className="max-w-48 truncate">{row.location}</TableCell><TableCell><StatusBadge status={row.status} /></TableCell></TableRow> : <TableRow key={row.id}><TableCell className="font-mono text-xs font-semibold">{row.reference}</TableCell><TableCell><p className="font-medium">{row.judgmentNumber}</p><p className="text-xs text-muted-foreground">{demoStore.marriages.find((item) => item.id === row.marriageId)?.reference}</p></TableCell><TableCell>{new Date(row.pronouncedAt).toLocaleDateString('fr-FR')}</TableCell><TableCell className="max-w-56 truncate">{row.court}</TableCell><TableCell><StatusBadge status={row.status} /></TableCell></TableRow>)}</TableBody></Table></div><div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>{rows.length} résultat(s)</span><span>Page 1 sur 1</span></div></CardContent></Card></div>
}

function Citizens({ role }: { role: Role }) {
  return <div className="flex flex-col gap-5"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-primary">Répertoire</p><h1 className="mt-1 font-serif text-3xl font-bold">Citoyens</h1><p className="mt-2 text-sm text-muted-foreground">Fiches individuelles liées aux actes d’état civil.</p></div>{role !== 'CONSULTATION' && <Button><Plus data-icon="inline-start" />Nouveau citoyen</Button>}</div><Card><CardContent className="pt-6"><Table><TableHeader><TableRow><TableHead>Identité</TableHead><TableHead>Identifiant national</TableHead><TableHead>Naissance</TableHead><TableHead>Résidence</TableHead></TableRow></TableHeader><TableBody>{demoStore.citizens.map((person) => <TableRow key={person.id}><TableCell><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-secondary font-serif font-bold text-primary">{person.firstName[0]}{person.lastName[0]}</div><div><p className="font-medium">{person.firstName} {person.lastName}</p><p className="text-xs text-muted-foreground">{person.sex === 'F' ? 'Femme' : 'Homme'}</p></div></div></TableCell><TableCell className="font-mono text-xs">{person.nationalId}</TableCell><TableCell>{new Date(person.birthDate).toLocaleDateString('fr-FR')}<p className="text-xs text-muted-foreground">{person.birthPlace}</p></TableCell><TableCell>{person.address}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>
}

function AuditLog() { return <div className="flex flex-col gap-5"><div><p className="text-sm font-medium text-primary">Sécurité</p><h1 className="mt-1 font-serif text-3xl font-bold">Journal d’audit</h1><p className="mt-2 text-sm text-muted-foreground">Traçabilité des opérations sensibles du registre.</p></div><Card><CardContent className="pt-6"><div className="flex flex-col gap-2">{demoStore.audits.map((event) => <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4"><div className="flex size-9 items-center justify-center rounded-full bg-secondary"><History className="size-4 text-primary" /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{event.action}</Badge><strong className="text-sm">{event.entity}</strong></div><p className="mt-1 text-sm text-muted-foreground">{event.summary} — {event.actor}</p></div><time className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString('fr-FR')}</time></div>)}</div></CardContent></Card></div> }

function ApiReference() { const endpoints = [['GET', '/api/v1/dashboard', 'Indicateurs et activité récente'], ['GET · POST', '/api/v1/citizens', 'Répertoire des citoyens'], ['GET · POST', '/api/v1/marriages', 'Registre des mariages'], ['GET · POST', '/api/v1/divorces', 'Registre des divorces'], ['GET', '/api/v1/users', 'Utilisateurs, accès ADMIN'], ['GET', '/api/v1/audit', 'Journal, accès ADMIN']]; return <div className="flex flex-col gap-5"><div><p className="text-sm font-medium text-primary">Développeurs</p><h1 className="mt-1 font-serif text-3xl font-bold">Référence API</h1><p className="mt-2 text-sm text-muted-foreground">API REST versionnée, exécutée en mode local démonstration.</p></div><Card><CardHeader><CardTitle>Convention</CardTitle><CardDescription>Ajoutez l’en-tête <code className="font-mono">x-demo-role</code> avec ADMIN, OFFICIER_ETAT_CIVIL ou CONSULTATION.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{endpoints.map(([method, path, description]) => <div key={path} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center"><Badge variant="secondary" className="w-fit">{method}</Badge><code className="font-mono text-sm font-semibold text-primary">{path}</code><span className="text-sm text-muted-foreground sm:ml-auto">{description}</span></div>)}</CardContent></Card></div> }

export function RegistryDashboard() {
  const [active, setActive] = useState('overview')
  const [role, setRole] = useState<Role>('ADMIN')
  const [mobileOpen, setMobileOpen] = useState(false)
  const content = active === 'overview' ? <Overview setActive={setActive} /> : active === 'citizens' ? <Citizens role={role} /> : active === 'marriages' ? <RegistryTable type="marriages" role={role} /> : active === 'divorces' ? <RegistryTable type="divorces" role={role} /> : active === 'audit' && role === 'ADMIN' ? <AuditLog /> : <ApiReference />
  const navigate = (id: string) => { setActive(id); setMobileOpen(false) }
  return <div className="min-h-screen bg-background"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r lg:block"><SideNav active={active} role={role} onSelect={navigate} /></aside><div className="lg:pl-64"><header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6"><Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir la navigation"><Menu /></Button>} /><SheetContent side="left" className="w-72 p-0"><SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle><SheetDescription>Navigation du registre</SheetDescription></SheetHeader><SideNav active={active} role={role} onSelect={navigate} /></SheetContent></Sheet><div className="relative hidden max-w-md flex-1 sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Rechercher dans tous les registres…" className="bg-muted/50 pl-9" /></div><div className="ml-auto flex items-center gap-3"><label className="sr-only" htmlFor="demo-role">Rôle de démonstration</label><select id="demo-role" value={role} onChange={(event) => { const next = event.target.value as Role; setRole(next); if (active === 'audit' && next !== 'ADMIN') setActive('overview') }} className="h-8 max-w-40 rounded-lg border bg-background px-2 text-xs font-medium"><option value="ADMIN">Administrateur</option><option value="OFFICIER_ETAT_CIVIL">Officier</option><option value="CONSULTATION">Consultation</option></select><div className="hidden text-right md:block"><p className="text-xs font-semibold">Marie Kabuo</p><p className="text-[11px] text-muted-foreground">{roleLabels[role]}</p></div><div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><UserRound className="size-4" /></div></div></header><main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{content}</main></div></div>
}
