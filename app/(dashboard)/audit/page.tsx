import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { History, FileText, Calendar, User, ShieldCheck, AlertCircle } from 'lucide-react'

export default async function AuditLogsPage() {
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  const actionCounts = auditLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const entityCounts = auditLogs.reduce((acc, log) => {
    acc[log.entity] = (acc[log.entity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Journal d'Audit</h1>
        <p className="text-muted-foreground">Historique complet des operations effectuees sur le systeme</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">Actions enregistrees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types d'Actions</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(actionCounts).length}</div>
            <p className="text-xs text-muted-foreground">Categories differentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entites concernees</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(entityCounts).length}</div>
            <p className="text-xs text-muted-foreground">Types d'entites</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution par Action</CardTitle>
            <CardDescription>Frequence des types d'actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).map(([action, count]) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-sm">{action}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600" 
                        style={{ width: `${(count / auditLogs.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par Entite</CardTitle>
            <CardDescription>Frequence des entites modifiees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(entityCounts).sort((a, b) => b[1] - a[1]).map(([entity, count]) => (
                <div key={entity} className="flex items-center justify-between">
                  <span className="text-sm">{entity}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600" 
                        style={{ width: `${(count / auditLogs.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Operations Recentes</CardTitle>
          <CardDescription>100 dernieres operations enregistrees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <AlertCircle className="mr-2 size-4" />
                Aucune operation enregistree
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-secondary">
                    {log.action === 'DELETE' ? (
                      <AlertCircle className="size-3.5 text-red-600" />
                    ) : (
                      <FileText className="size-3.5 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{log.action}</p>
                      <span className="text-xs text-muted-foreground">·</span>
                      <p className="text-xs text-muted-foreground">{log.entity}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.summary}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="size-3" />
                        {log.actor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
