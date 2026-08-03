import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileCheck2, Gavel, ShieldCheck, TrendingUp, Calendar, MapPin, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ReportsPage() {
  const [citizens, marriages, divorces, users, activeMarriages] = await Promise.all([
    db.citizen.findMany(),
    db.marriage.findMany({
      include: {
        epoux: true,
        epouse: true,
        divorce: true
      }
    }),
    db.divorce.findMany({
      include: {
        mariage: {
          include: {
            epoux: true,
            epouse: true
          }
        }
      }
    }),
    db.user.findMany({
      where: { actif: true }
    }),
    db.marriage.count({
      where: {
        divorce: {
          is: null
        }
      }
    })
  ])

  // Calculate statistics
  const maleCount = citizens.filter(c => c.sexe === 'M').length
  const femaleCount = citizens.filter(c => c.sexe === 'F').length
  const divorceRate = marriages.length > 0 ? ((divorces.length / marriages.length) * 100).toFixed(1) : '0'
  const activeMarriageRate = marriages.length > 0 ? ((activeMarriages / marriages.length) * 100).toFixed(1) : '0'

  // Calculate marriages by year
  const marriagesByYear = marriages.reduce((acc, m) => {
    const year = new Date(m.date_celebration).getFullYear()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  // Calculate divorces by year
  const divorcesByYear = divorces.reduce((acc, d) => {
    const year = new Date(d.date_enregistrement).getFullYear()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold">Rapports & Statistiques</h1>
          <p className="text-muted-foreground">Vue d'ensemble de l'etat civil de la ville de Bukavu</p>
        </div>
        <Button onClick={() => window.print()} variant="outline">
          <Activity className="mr-2 h-4 w-4" /> Imprimer le rapport
        </Button>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Citoyens</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citizens.length}</div>
            <p className="text-xs text-muted-foreground">
              {maleCount} hommes, {femaleCount} femmes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mariages</CardTitle>
            <FileCheck2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marriages.length}</div>
            <p className="text-xs text-muted-foreground">{activeMarriages} actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Divorces</CardTitle>
            <Gavel className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{divorces.length}</div>
            <p className="text-xs text-muted-foreground">{divorceRate}% taux de divorce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.role === 'ADMIN').length} admins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Demographiques</CardTitle>
            <CardDescription>Repartition par sexe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Hommes</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${citizens.length > 0 ? (maleCount / citizens.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{maleCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Femmes</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-pink-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-600" 
                    style={{ width: `${citizens.length > 0 ? (femaleCount / citizens.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{femaleCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de Performance</CardTitle>
            <CardDescription>Statistiques cles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-sm">Taux de mariages actifs</span>
              </div>
              <span className="font-semibold">{activeMarriageRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="size-4 text-red-600" />
                <span className="text-sm">Taux de divorce</span>
              </div>
              <span className="font-semibold">{divorceRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                <span className="text-sm">Mariages par citoyen</span>
              </div>
              <span className="font-semibold">
                {citizens.length > 0 ? (marriages.length / citizens.length).toFixed(3) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Annual Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques Annuelles</CardTitle>
          <CardDescription>Evolution des mariages et divorces par annee</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Mariages par annee</h4>
              <div className="space-y-2">
                {Object.entries(marriagesByYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([year, count]) => (
                  <div key={year} className="flex items-center justify-between">
                    <span className="text-sm">{year}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-2 bg-green-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600" 
                          style={{ width: `${Math.min((count / Math.max(...Object.values(marriagesByYear))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Divorces par annee</h4>
              <div className="space-y-2">
                {Object.entries(divorcesByYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).map(([year, count]) => (
                  <div key={year} className="flex items-center justify-between">
                    <span className="text-sm">{year}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-2 bg-red-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600" 
                          style={{ width: `${Math.min((count / Math.max(...Object.values(divorcesByYear), 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resume de l'Activite</CardTitle>
          <CardDescription>Period couverte et statistiques generales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Calendar className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Periode de donnees</p>
                <p className="text-xs text-muted-foreground">
                  {marriages.length > 0 ? `${new Date(Math.min(...marriages.map(m => new Date(m.date_celebration).getTime()))).getFullYear()} - ${new Date(Math.max(...marriages.map(m => new Date(m.date_celebration).getTime()))).getFullYear()}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Zone couverte</p>
                <p className="text-xs text-muted-foreground">Ville de Bukavu, Sud-Kivu</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Statut du systeme</p>
                <p className="text-xs text-muted-foreground">Operationnel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
