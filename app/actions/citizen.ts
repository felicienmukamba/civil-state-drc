'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createCitizen(formData: FormData) {
  try {
    const data = {
      numero_national: formData.get('numero_national') as string,
      nom: formData.get('nom') as string,
      postnom: formData.get('postnom') as string,
      prenom: formData.get('prenom') as string,
      date_naissance: new Date(formData.get('date_naissance') as string),
      lieu_naissance: formData.get('lieu_naissance') as string,
      sexe: formData.get('sexe') as string,
      profession: formData.get('profession') as string,
      adresse_actuelle: formData.get('adresse_actuelle') as string,
    }

    await db.citizen.create({
      data
    })

    revalidatePath('/citizens')
    return { success: true }
  } catch (error) {
    console.error('Error creating citizen:', error)
    return { error: 'Failed to create citizen' }
  }
}

export async function deleteCitizen(id: number) {
  try {
    await db.citizen.delete({
      where: { id }
    })
    revalidatePath('/citizens')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete citizen' }
  }
}
