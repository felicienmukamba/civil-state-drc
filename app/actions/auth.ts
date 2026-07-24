'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/auth'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Veuillez remplir tous les champs.' }
  }

  try {
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { error: 'Identifiants invalides.' }
    }

    if (!user.actif) {
      return { error: 'Ce compte a été désactivé.' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return { error: 'Identifiants invalides.' }
    }

    // Create session token
    const token = await encrypt({ id: user.id, username: user.username, role: user.role })
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 10 // 10 hours
    })

  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Une erreur est survenue lors de la connexion.' }
  }

  // Redirect on success
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
