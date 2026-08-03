'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { login } from '@/app/actions/auth'
import { Toast } from '@/lib/utils/toast'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const res = await login(formData)
      if (res?.error) {
        setError(res.error)
        Toast.error(res.error)
      } else if (res?.success) {
        Toast.success('Connexion reussie')
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-2xl font-serif text-blue-900">Etat Civil - Bukavu</CardTitle>
          <CardDescription>
            Connectez-vous pour acceder au registre de la ville de Bukavu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                placeholder="admin"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Se connecter
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Retour a l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
