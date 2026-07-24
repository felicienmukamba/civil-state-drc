import type { AuditEvent, Citizen, Divorce, Marriage, RegistryUser, Role } from './types'

const now = new Date().toISOString()
const citizens: Citizen[] = [
  { id: 'cit-001', nationalId: 'CD-BKV-1988-04512', firstName: 'Patrick', lastName: 'Mubalama', sex: 'M', birthDate: '1988-04-12', birthPlace: 'Bukavu', address: 'Ibanda, Bukavu', createdAt: now },
  { id: 'cit-002', nationalId: 'CD-BKV-1992-07341', firstName: 'Grâce', lastName: 'Nabintu', sex: 'F', birthDate: '1992-09-03', birthPlace: 'Kabare', address: 'Kadutu, Bukavu', createdAt: now },
  { id: 'cit-003', nationalId: 'CD-BKV-1985-01982', firstName: 'Jean-Paul', lastName: 'Cirimwami', sex: 'M', birthDate: '1985-01-19', birthPlace: 'Walungu', address: 'Bagira, Bukavu', createdAt: now },
  { id: 'cit-004', nationalId: 'CD-BKV-1990-06113', firstName: 'Aline', lastName: 'Mushagalusa', sex: 'F', birthDate: '1990-06-11', birthPlace: 'Bukavu', address: 'Ibanda, Bukavu', createdAt: now },
  { id: 'cit-005', nationalId: 'CD-BKV-1995-12204', firstName: 'Esther', lastName: 'Bahati', sex: 'F', birthDate: '1995-12-20', birthPlace: 'Kalehe', address: 'Kadutu, Bukavu', createdAt: now },
]
const marriages: Marriage[] = [
  { id: 'mar-001', reference: 'M-BKV-2026-0084', spouseOneId: 'cit-001', spouseTwoId: 'cit-002', celebratedAt: '2026-07-14', location: 'Bureau principal — Ibanda', regime: 'Communauté réduite aux acquêts', witnesses: ['Chantal Bisimwa', 'Claude Mweze'], officer: 'Joséphine Bintu', status: 'VALIDE', createdAt: now },
  { id: 'mar-002', reference: 'M-BKV-2026-0083', spouseOneId: 'cit-003', spouseTwoId: 'cit-004', celebratedAt: '2026-07-12', location: 'Antenne de Kadutu', regime: 'Séparation de biens', witnesses: ['Mireille Safari', 'Alain Mugaruka'], officer: 'Joséphine Bintu', status: 'VALIDE', createdAt: now },
  { id: 'mar-003', reference: 'M-BKV-2026-0082', spouseOneId: 'cit-001', spouseTwoId: 'cit-005', celebratedAt: '2026-07-10', location: 'Bureau principal — Ibanda', regime: 'Communauté universelle', witnesses: ['Lucie Badesire'], officer: 'David Mapendo', status: 'BROUILLON', createdAt: now },
]
const divorces: Divorce[] = [
  { id: 'div-001', reference: 'D-BKV-2026-0017', marriageId: 'mar-002', judgmentNumber: 'TGI/BKV/284/2026', court: 'Tribunal de grande instance de Bukavu', pronouncedAt: '2026-07-08', category: 'Consentement mutuel', officer: 'David Mapendo', status: 'VALIDE', createdAt: now },
  { id: 'div-002', reference: 'D-BKV-2026-0016', marriageId: 'mar-001', judgmentNumber: 'TGI/BKV/267/2026', court: 'Tribunal de grande instance de Bukavu', pronouncedAt: '2026-06-28', category: 'Rupture de la vie commune', officer: 'Joséphine Bintu', status: 'ARCHIVE', createdAt: now },
]
const users: RegistryUser[] = [
  { id: 'usr-001', name: 'Marie Kabuo', email: 'admin@registre.cd', role: 'ADMIN', active: true },
  { id: 'usr-002', name: 'Joséphine Bintu', email: 'officier@registre.cd', role: 'OFFICIER_ETAT_CIVIL', active: true },
  { id: 'usr-003', name: 'Claude Safari', email: 'lecture@registre.cd', role: 'CONSULTATION', active: true },
]
const audits: AuditEvent[] = [
  { id: 'aud-001', action: 'VALIDATION', entity: 'Mariage M-BKV-2026-0084', actor: 'Joséphine Bintu', summary: 'Acte vérifié et validé', createdAt: '2026-07-14T14:32:00.000Z' },
  { id: 'aud-002', action: 'CRÉATION', entity: 'Divorce D-BKV-2026-0017', actor: 'David Mapendo', summary: 'Décision judiciaire enregistrée', createdAt: '2026-07-08T10:18:00.000Z' },
  { id: 'aud-003', action: 'MODIFICATION', entity: 'Citoyen CD-BKV-1992-07341', actor: 'Marie Kabuo', summary: 'Adresse de résidence mise à jour', createdAt: '2026-07-06T08:45:00.000Z' },
]

const normalize = (value: string) => value.toLocaleLowerCase('fr')
export const demoStore = {
  citizens, marriages, divorces, users, audits,
  citizenName(id: string) { const person = citizens.find((item) => item.id === id); return person ? `${person.firstName} ${person.lastName}` : 'Citoyen inconnu' },
  list<T extends object>(items: T[], search = '', page = 1, limit = 10) { const filtered = search ? items.filter((item) => normalize(JSON.stringify(item)).includes(normalize(search))) : items; const start = (page - 1) * limit; return { items: filtered.slice(start, start + limit), total: filtered.length, page, limit } },
  roleFrom(request: Request): Role { const role = request.headers.get('x-demo-role'); return role === 'ADMIN' || role === 'CONSULTATION' ? role : 'OFFICIER_ETAT_CIVIL' },
  canMutate(role: Role) { return role === 'ADMIN' || role === 'OFFICIER_ETAT_CIVIL' },
  audit(action: string, entity: string, actor: string, summary: string) { audits.unshift({ id: crypto.randomUUID(), action, entity, actor, summary, createdAt: new Date().toISOString() }) },
}
