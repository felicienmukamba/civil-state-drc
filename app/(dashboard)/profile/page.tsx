'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { UserRound, ShieldCheck, Calendar, Clock } from 'lucide-react'
import { Toast } from '@/lib/utils/toast'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setFormData({ ...formData, username: userData.username })
      }
    } catch (error) {
      Toast.error('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setEditing(false)
        Toast.success('Profil mis à jour avec succès')
      } else {
        Toast.error('Erreur lors de la mise à jour du profil')
      }
    } catch (error) {
      Toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      Toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.newPassword.length < 6) {
      Toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      const response = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (response.ok) {
        Toast.success('Mot de passe changé avec succès')
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        Toast.error(error.error || 'Erreur lors du changement de mot de passe')
      }
    } catch (error) {
      Toast.error('Erreur lors du changement de mot de passe')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Utilisateur non trouvé</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <div className="flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserRound className="size-12" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <div className="font-semibold text-lg">{user.username}</div>
              <div className="text-sm text-muted-foreground">
                {user.role === 'ADMIN' ? 'Administrateur' : 'Officier d\'état civil'}
              </div>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Statut:</span>
                <span className={user.actif ? 'text-green-600' : 'text-red-600'}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Créé le:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span>#{user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Modifier le profil</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!editing}
                />
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button type="submit">Enregistrer</Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setEditing(false)
                      setFormData({ ...formData, username: user.username })
                    }}>
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setEditing(true)}>
                    Modifier
                  </Button>
                )}
              </div>
            </form>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4">Changer le mot de passe</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Changer le mot de passe</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
