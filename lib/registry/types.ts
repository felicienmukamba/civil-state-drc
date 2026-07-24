export type Role = 'ADMIN' | 'OFFICIER_ETAT_CIVIL' | 'CONSULTATION'
export type RecordStatus = 'BROUILLON' | 'VALIDE' | 'ARCHIVE'

export interface Citizen {
  id: string
  nationalId: string
  firstName: string
  lastName: string
  sex: 'F' | 'M'
  birthDate: string
  birthPlace: string
  address: string
  createdAt: string
}

export interface Marriage {
  id: string
  reference: string
  spouseOneId: string
  spouseTwoId: string
  celebratedAt: string
  location: string
  regime: string
  witnesses: string[]
  officer: string
  status: RecordStatus
  notes?: string
  createdAt: string
}

export interface Divorce {
  id: string
  reference: string
  marriageId: string
  judgmentNumber: string
  court: string
  pronouncedAt: string
  category: string
  officer: string
  status: RecordStatus
  notes?: string
  createdAt: string
}

export interface RegistryUser {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
}

export interface AuditEvent {
  id: string
  action: string
  entity: string
  actor: string
  summary: string
  createdAt: string
}

export interface ApiEnvelope<T> { data: T; meta?: Record<string, unknown> }
