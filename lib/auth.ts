import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getSecretKey } from './utils/jwt'

export async function encrypt(payload: any) {
  return jwt.sign(payload, getSecretKey(), { expiresIn: '10h' })
}

export async function decrypt(token: string): Promise<any> {
  try {
    return jwt.verify(token, getSecretKey())
  } catch (err) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}
