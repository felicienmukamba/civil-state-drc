'use client'

import { useState, useTransition } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createCitizen } from '@/app/actions/citizen'

export function CreateCitizenForm() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      await createCitizen(formData)
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Nouveau citoyen
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un citoyen</SheetTitle>
        </SheetHeader>
        <form action={action} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero_national">Numéro national</Label>
            <Input id="numero_national" name="numero_national" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postnom">Post-nom</Label>
            <Input id="postnom" name="postnom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_naissance">Date de naissance</Label>
            <Input id="date_naissance" name="date_naissance" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lieu_naissance">Lieu de naissance</Label>
            <Input id="lieu_naissance" name="lieu_naissance" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe</Label>
            <select
              id="sexe"
              name="sexe"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              required
            >
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" name="profession" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse_actuelle">Adresse actuelle</Label>
            <Input id="adresse_actuelle" name="adresse_actuelle" required />
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
