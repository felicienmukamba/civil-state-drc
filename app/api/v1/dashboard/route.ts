import { ok } from '@/lib/registry/api'
import { demoStore } from '@/lib/registry/store'

export async function GET() {
  const validMarriages = demoStore.marriages.filter((item) => item.status === 'VALIDE').length
  const drafts = demoStore.marriages.filter((item) => item.status === 'BROUILLON').length
  return ok({ citizens: demoStore.citizens.length, marriages: demoStore.marriages.length, divorces: demoStore.divorces.length, validMarriages, drafts, recentActivity: demoStore.audits.slice(0, 5) }, { mode: 'demo-local' })
}
