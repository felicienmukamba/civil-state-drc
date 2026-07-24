import { ok, problem } from '@/lib/registry/api'
import { demoStore } from '@/lib/registry/store'
export async function GET(request: Request) { if (demoStore.roleFrom(request) !== 'ADMIN') return problem(403, 'FORBIDDEN', 'Journal réservé aux administrateurs'); return ok(demoStore.audits, { mode: 'demo-local' }) }
