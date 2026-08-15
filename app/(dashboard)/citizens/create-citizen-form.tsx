'use client'

import { useState, useTransition } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createCitizen } from '@/app/actions/citizen'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { citizenSchema } from '@/lib/validations/schemas'
import { z } from 'zod'

type CitizenFormValues = z.infer<typeof citizenSchema>

export function CreateCitizenForm() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CitizenFormValues>({
    resolver: zodResolver(citizenSchema)
  })

  const onSubmit = (data: CitizenFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString().split('T')[0]);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });
      
      const result = await createCitizen(formData);
      if (result.success) {
        reset();
        setOpen(false);
      } else {
        alert(result.error);
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau citoyen
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ajouter un citoyen</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero_national">Numéro national</Label>
            <Input id="numero_national" {...register("numero_national")} />
            {errors.numero_national && <p className="text-red-500 text-sm">{errors.numero_national.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" {...register("nom")} />
            {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postnom">Post-nom</Label>
            <Input id="postnom" {...register("postnom")} />
            {errors.postnom && <p className="text-red-500 text-sm">{errors.postnom.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" {...register("prenom")} />
            {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_naissance">Date de naissance</Label>
            <Input id="date_naissance" type="date" {...register("date_naissance")} />
            {errors.date_naissance && <p className="text-red-500 text-sm">{errors.date_naissance.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lieu_naissance">Lieu de naissance</Label>
            <Input id="lieu_naissance" {...register("lieu_naissance")} />
            {errors.lieu_naissance && <p className="text-red-500 text-sm">{errors.lieu_naissance.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexe">Sexe</Label>
            <select
              id="sexe"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              {...register("sexe")}
            >
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
            {errors.sexe && <p className="text-red-500 text-sm">{errors.sexe.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" {...register("profession")} />
            {errors.profession && <p className="text-red-500 text-sm">{errors.profession.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse_actuelle">Adresse actuelle</Label>
            <Input id="adresse_actuelle" {...register("adresse_actuelle")} />
            {errors.adresse_actuelle && <p className="text-red-500 text-sm">{errors.adresse_actuelle.message}</p>}
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
