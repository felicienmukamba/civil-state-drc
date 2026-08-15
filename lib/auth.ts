import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined in production environment. Using fallback key is highly insecure.');
}
const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-dev'

export async function encrypt(payload: any) {
  return jwt.sign(payload, secretKey, { expiresIn: '10h' })
}

export async function decrypt(token: string): Promise<any> {
  try {
    return jwt.verify(token, secretKey)
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
