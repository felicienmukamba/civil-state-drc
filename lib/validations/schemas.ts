import { z } from 'zod';

export const citizenSchema = z.object({
  numero_national: z.string().min(5).max(40),
  nom: z.string().min(2).max(80),
  postnom: z.string().min(2).max(80),
  prenom: z.string().min(2).max(80),
  date_naissance: z.string().or(z.date()),
  lieu_naissance: z.string().min(2),
  sexe: z.enum(['F', 'M']),
  profession: z.string().min(2),
  adresse_actuelle: z.string().min(2)
});

export const marriageSchema = z.object({
  epoux_id: z.coerce.number().int().positive(),
  epouse_id: z.coerce.number().int().positive(),
  numero_acte: z.string().min(3),
  date_celebration: z.string().or(z.date()),
  lieu_celebration: z.string().min(2),
  regime_matrimonial: z.string().min(2)
});

export const divorceSchema = z.object({
  mariage_id: z.coerce.number().int().positive(),
  numero_acte: z.string().min(3),
  date_enregistrement: z.string().or(z.date()),
  decision_justice_ref: z.string().min(2),
  motif: z.string().min(2)
});

export const userSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OFFICIER', 'OFFICIER_SUPERIEUR']).optional()
});
