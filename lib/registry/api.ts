import { NextResponse } from 'next/server'
import { z } from 'zod'

export const listQuerySchema = z.object({
  search: z.string().trim().max(100).default(''),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export function ok<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) }, { status })
}
export function problem(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, ...(details ? { details } : {}) } }, { status })
}
export function parseList(url: string) {
  const params = Object.fromEntries(new URL(url).searchParams)
  return listQuerySchema.safeParse(params)
}
