# 🛠️ Guide Développeur - Système de Gestion des Mariages et Divorces
## État Civil - Ville de Bukavu

---

## 📚 Documentation Connexe

Ce guide fait partie d'une documentation complète :

| Guide | Lien |
|-------|------|
| 📘 [Guide Utilisateur](./GUIDE_UTILISATEUR.md) | Pour comprendre le fonctionnement de l'application |
| 📖 [README](./README.md) | Vue d'ensemble du projet et architecture |
| 📋 [Audit Technique](./.windsurf/plans/google-audit-report-235f5f.md) | Rapport de sécurité et qualité du code |

> 💡 **Conseil** : Si vous découvrez le projet, commencez par le [README](./README.md) pour comprendre l'architecture, puis consultez ce guide pour l'installation.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Approche par Compétences](#approche-par-compétences)
5. [Approche par Situation](#approche-par-situation)
6. [Architecture du Code](#architecture-du-code)
7. [Développement](#développement)
8. [Tests](#tests)
9. [Déploiement](#déploiement)
10. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Système Requis

- **OS** : Windows 10+, macOS 10.15+, ou Linux
- **Node.js** : Version 18.0 ou supérieure
- **npm** : Version 9.0 ou supérieure (ou pnpm)
- **Git** : Version 2.0 ou supérieure

### Outils Recommandés

- **IDE** : VS Code avec extensions TypeScript et ESLint
- **Client API** : Postman ou Insomnia
- **Client Git** : GitHub Desktop ou GitKraken
- **Navigateur** : Chrome, Firefox ou Edge (dernières versions)

### Vérification des Prérequis

```bash
# Vérifier Node.js
node --version  # Doit afficher v18.0.0 ou supérieur

# Vérifier npm
npm --version   # Doit afficher 9.0.0 ou supérieur

# Vérifier Git
git --version   # Doit afficher 2.0.0 ou supérieur
```

---

## 🚀 Installation

### Niveau 1 : Installation Locale (Développement)

#### Étape 1 : Cloner le Repository

```bash
# Via HTTPS
git clone https://github.com/your-repo/systeme-de-gestion-des-mariages-et-divorce.git

# Via SSH (si configuré)
git clone git@github.com:your-repo/systeme-de-gestion-des-mariages-et-divorce.git

# Se déplacer dans le répertoire
cd systeme-de-gestion-des-mariages-et-divorce
```

#### Étape 2 : Installer les Dépendances

```bash
# Avec npm
npm install

# Avec pnpm (recommandé pour les projets plus grands)
pnpm install
```

> ⏱️ **Temps estimé** : 2-5 minutes selon votre connexion internet

#### Étape 3 : Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations :

```env
# Base de données (développement)
DATABASE_URL="file:./dev.db"

# Base de données (production - PostgreSQL)
# DATABASE_URL="postgresql://user:password@host:port/database"

# Authentification
JWT_SECRET="votre-secret-ici-au-moins-32-caracteres"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

> ⚠️ **Sécurité** : En production, utilisez un `JWT_SECRET` fort d'au moins 32 caractères. Ne commettez jamais ce fichier.

#### Étape 4 : Initialiser la Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer le schéma
npx prisma db push

# (Optionnel) Charger les données de test
npx prisma db seed
```

#### Étape 5 : Lancer le Serveur de Développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

### Niveau 2 : Installation avec Docker (Production)

#### Étape 1 : Créer le fichier Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --app --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Étape 2 : Construire et Exécuter

```bash
# Construire l'image
docker build -t etat-civil-bukavu .

# Exécuter le conteneur
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" etat-civil-bukavu
```

---

### Niveau 3 : Installation avec Docker Compose (Complet)

#### Étape 1 : Créer docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/etat_civil
      - JWT_SECRET=${JWT_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=etat_civil
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Étape 2 : Lancer avec Docker Compose

```bash
# Créer le fichier .env
echo "JWT_SECRET=votre-secret-ici" > .env

# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f app
```

---

## ⚙️ Configuration

### Configuration de la Base de Données

#### SQLite (Développement)

```env
DATABASE_URL="file:./dev.db"
```

#### PostgreSQL (Production)

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

**Exemple avec Neon (PostgreSQL cloud) :**
```env
DATABASE_URL="postgresql://neondb_owner:npg_xxx@ep-nameless-field-xxx-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Configuration de l'Authentification

```env
# Secret pour signer les tokens JWT
JWT_SECRET="votre-secret-tres-securise-ici"

# URL de l'application
NEXTAUTH_URL="http://localhost:3000"

# En production, utilisez l'URL réelle
# NEXTAUTH_URL="https://etat-civil-bukavu.vercel.app"
```

### Configuration de l'Environnement

```env
# Mode de l'application
NODE_ENV="development"  # ou "production"
```

---

## 🎯 Approche par Compétences

### Compétence 1 : Comprendre l'Architecture du Projet

**Objectif** : Maîtriser la structure du code et les responsabilités de chaque couche.

#### Niveau Débutant
- ✅ Comprendre la structure des dossiers
- ✅ Identifier les routes API
- ✅ Localiser les composants frontend

#### Niveau Intermédiaire
- ✅ Comprendre l'architecture en couches (API → Service → Repository)
- ✅ Identifier les middleware d'authentification
- ✅ Comprendre le rôle de Prisma

#### Niveau Avancé
- ✅ Comprendre le flux des données
- ✅ Maîtriser les patterns utilisés (Repository, Service)
- ✅ Comprendre la gestion des transactions

---

### Compétence 2 : Développer une Nouvelle Fonctionnalité

**Objectif** : Savoir ajouter une nouvelle fonctionnalité de bout en bout.

#### Étape 1 : Créer le Schéma de Base de Données

```prisma
// Dans prisma/schema.prisma
model NouvelleEntite {
  id        Int      @id @default(autoincrement())
  nom       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

#### Étape 2 : Générer le Client Prisma

```bash
npx prisma generate
npx prisma db push
```

#### Étape 3 : Créer le Repository

```typescript
// lib/repositories/nouvelle-entite.repository.ts
import { db } from '../db';

export class NouvelleEntiteRepository {
  async findAll() {
    return db.nouvelleEntite.findMany({ where: { deletedAt: null } });
  }

  async findById(id: number) {
    return db.nouvelleEntite.findFirst({ where: { id, deletedAt: null } });
  }

  async create(data: any) {
    return db.nouvelleEntite.create({ data });
  }

  async update(id: number, data: any) {
    return db.nouvelleEntite.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return db.nouvelleEntite.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}

export const nouvelleEntiteRepository = new NouvelleEntiteRepository();
```

#### Étape 4 : Créer le Service

```typescript
// lib/services/nouvelle-entite.service.ts
import { nouvelleEntiteRepository } from '../repositories/nouvelle-entite.repository';

export class NouvelleEntiteService {
  async getAll() {
    return nouvelleEntiteRepository.findAll();
  }

  async getById(id: number) {
    const entity = await nouvelleEntiteRepository.findById(id);
    if (!entity) throw new Error('Entité introuvable');
    return entity;
  }

  async create(data: any) {
    return nouvelleEntiteRepository.create(data);
  }
}

export const nouvelleEntiteService = new NouvelleEntiteService();
```

#### Étape 5 : Créer la Route API

```typescript
// app/api/nouvelle-entite/route.ts
import { NextRequest } from 'next/server';
import { nouvelleEntiteService } from '@/lib/services/nouvelle-entite.service';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const entities = await nouvelleEntiteService.getAll();
  return ApiResponse.success(entities);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const data = await req.json();
    const entity = await nouvelleEntiteService.create(data);
    return ApiResponse.created(entity);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
```

#### Étape 6 : Créer le Frontend

```typescript
// app/(dashboard)/nouvelle-entite/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { DataTable, Column } from '@/components/shared/data-table';

interface Entity {
  id: number;
  nom: string;
}

export default function NouvelleEntitePage() {
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    apiFetch('/nouvelle-entite').then(setEntities);
  }, []);

  const columns: Column<Entity>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nom', accessorKey: 'nom' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nouvelle Entité</h2>
      <DataTable columns={columns} data={entities} />
    </div>
  );
}
```

---

### Compétence 3 : Déboguer et Résoudre les Problèmes

**Objectif** : Identifier et corriger les erreurs courantes.

#### Outils de Débogage

1. **Console du navigateur** : Pour les erreurs frontend
2. **Logs du serveur** : Pour les erreurs backend
3. **Prisma Studio** : Pour inspecter la base de données
4. **Network tab** : Pour inspecter les requêtes API

#### Erreurs Courantes

**Erreur : "JWT_SECRET is not defined"**
- Solution : Ajouter `JWT_SECRET` dans le fichier `.env`

**Erreur : "Database connection failed"**
- Solution : Vérifier `DATABASE_URL` et s'assurer que la base est accessible

**Erreur : "401 Unauthorized"**
- Solution : Vérifier que le token JWT est valide et non expiré

---

## 🎬 Approche par Situation

### Situation 1 : Premier Lancement du Projet

**Contexte** : Vous venez de cloner le projet et voulez le lancer pour la première fois.

**Actions à effectuer** :
1. Installer les dépendances : `npm install`
2. Configurer l'environnement : `cp .env.example .env`
3. Initialiser Prisma : `npx prisma generate && npx prisma db push`
4. Charger les données de test : `npx prisma db seed`
5. Lancer le serveur : `npm run dev`
6. Se connecter avec `admin` / `admin123`

**Vérification** :
- ✅ Le serveur démarre sans erreur
- ✅ La page de connexion s'affiche
- ✅ La connexion fonctionne
- ✅ Le dashboard est accessible

---

### Situation 2 : Ajouter un Nouveau Champ à une Entité

**Contexte** : Vous devez ajouter un champ "téléphone" à l'entité Citizen.

**Actions à effectuer** :
1. Modifier le schéma Prisma :
```prisma
model Citizen {
  // ... autres champs
  telephone String?
}
```

2. Appliquer les changements :
```bash
npx prisma db push
```

3. Mettre à jour le repository si nécessaire
4. Mettre à jour le service si nécessaire
5. Mettre à jour l'API route
6. Mettre à jour le formulaire frontend

**Vérification** :
- ✅ Le schéma est mis à jour
- ✅ Le champ apparaît dans Prisma Studio
- ✅ L'API accepte le nouveau champ
- ✅ Le formulaire inclut le champ

---

### Situation 3 : Déployer en Production

**Contexte** : Vous devez déployer l'application sur Vercel.

**Actions à effectuer** :
1. Configurer les variables d'environnement sur Vercel :
   - `DATABASE_URL` (PostgreSQL)
   - `JWT_SECRET` (secret fort)
   - `NEXTAUTH_URL` (URL de production)

2. Connecter le repository GitHub à Vercel
3. Configurer les build settings :
   - Build command : `npm run build`
   - Output directory : `.next`
   - Install command : `npm install`

4. Déployer

5. Exécuter les migrations :
```bash
npx prisma db push
```

**Vérification** :
- ✅ Le build réussit
- ✅ L'application est accessible
- ✅ La connexion fonctionne
- ✅ Les données sont persistantes

---

### Situation 4 : Optimiser les Performances

**Contexte** : L'application est lente avec beaucoup de données.

**Actions à effectuer** :
1. Ajouter des indexes dans Prisma :
```prisma
model Marriage {
  // ...
  @@index([numero_acte])
  @@index([date_celebration])
}
```

2. Optimiser les requêtes N+1 :
```typescript
// Au lieu de
const marriages = await db.marriage.findMany();
for (const marriage of marriages) {
  marriage.epoux = await db.citizen.findUnique({ where: { id: marriage.epoux_id } });
}

// Utiliser
const marriages = await db.marriage.findMany({
  include: { epoux: true, epouse: true }
});
```

3. Implémenter le cache si nécessaire

**Vérification** :
- ✅ Les requêtes sont plus rapides
- ✅ La charge CPU diminue
- ✅ L'expérience utilisateur s'améliore

---

## 🏗️ Architecture du Code

### Structure en Couches

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js Pages & Components)  │
└─────────────────────────────────────────┘
                  ↓ HTTP
┌─────────────────────────────────────────┐
│  API Routes (Controllers & Middleware)  │
└─────────────────────────────────────────┘
                  ↓ Appel
┌─────────────────────────────────────────┐
│  Services (Business Logic & Validation) │
└─────────────────────────────────────────┘
                  ↓ Query
┌─────────────────────────────────────────┐
│  Repositories (Data Access Layer)       │
└─────────────────────────────────────────┘
                  ↓ SQL
┌─────────────────────────────────────────┐
│  Database (Prisma ORM)                  │
└─────────────────────────────────────────┘
```

### Responsabilités de Chaque Couche

| Couche | Responsabilité | Exemple |
|--------|----------------|---------|
| **Frontend** | Interface utilisateur, validation UI | Formulaires, tableaux, navigation |
| **API Routes** | Contrôleurs HTTP, authentification | `app/api/citizens/route.ts` |
| **Services** | Logique métier, validation business | `lib/services/citizen.service.ts` |
| **Repositories** | Accès aux données, requêtes SQL | `lib/repositories/citizen.repository.ts` |
| **Database** | Persistance des données | Prisma + PostgreSQL/SQLite |

---

## 💻 Développement

### Commandes de Développement

```bash
# Lancer le serveur de développement
npm run dev

# Lancer avec hot reload
npm run dev -- --turbo

# Construire pour la production
npm run build

# Lancer en mode production
npm start

# Linter le code
npm run lint

# Formater le code (si configuré)
npm run format
```

### Outils de Développement

#### Prisma Studio

```bash
npx prisma studio
```

Ouvre une interface visuelle pour inspecter et modifier la base de données.

#### TypeScript Check

```bash
npx tsc --noEmit
```

Vérifie les erreurs TypeScript sans générer de fichiers.

---

## 🧪 Tests

### Structure des Tests

```
__tests__/
├── unit/
│   ├── repositories/
│   │   └── citizen.repository.test.ts
│   └── services/
│       └── citizen.service.test.ts
├── integration/
│   └── api/
│       └── citizens.test.ts
└── e2e/
    └── user-flows.test.ts
```

### Écrire un Test Unitaire

```typescript
// __tests__/unit/services/citizen.service.test.ts
import { citizenService } from '@/lib/services/citizen.service';

describe('CitizenService', () => {
  it('should create a citizen', async () => {
    const data = {
      numero_national: '123456789',
      nom: 'Test',
      postnom: 'User',
      prenom: 'John',
      date_naissance: '1990-01-01',
      lieu_naissance: 'Bukavu',
      sexe: 'M',
      profession: 'Dev',
      adresse_actuelle: 'Bukavu'
    };

    const citizen = await citizenService.registerCitizen(data);
    expect(citizen).toHaveProperty('id');
  });
});
```

### Exécuter les Tests

```bash
# Avec Jest
npm test

# Avec coverage
npm test -- --coverage

# Tests spécifiques
npm test citizen
```

---

## 🚀 Déploiement

### Déploiement sur Vercel

#### Étape 1 : Préparer le Projet

```bash
# S'assurer que tout est commité
git add .
git commit -m "Ready for deployment"
git push
```

#### Étape 2 : Configurer Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Importer le projet depuis GitHub
3. Configurer les variables d'environnement
4. Déployer

#### Étape 3 : Configurer la Base de Données

```bash
# En production
npx prisma db push --schema=./prisma/schema.prisma
```

### Déploiement sur Docker

```bash
# Construire l'image
docker build -t etat-civil-bukavu .

# Taguer pour le registre
docker tag etat-civil-bukavu username/etat-civil-bukavu:latest

# Push vers Docker Hub
docker push username/etat-civil-bukavu:latest

# Pull et run sur le serveur
docker pull username/etat-civil-bukavu:latest
docker run -d -p 3000:3000 username/etat-civil-bukavu:latest
```

---

## 🔧 Dépannage

### Problèmes Courants

#### Problème : "Module not found"

**Cause** : Dépendance manquante

**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Problème : "Prisma Client not generated"

**Cause** : Client Prisma non généré

**Solution** :
```bash
npx prisma generate
```

#### Problème : "Port 3000 already in use"

**Cause** : Un autre processus utilise le port

**Solution** :
```bash
# Sur Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Sur macOS/Linux
lsof -ti:3000 | xargs kill -9

# Ou utiliser un autre port
PORT=3001 npm run dev
```

#### Problème : "Database connection timeout"

**Cause** : Base de données inaccessible

**Solution** :
- Vérifier que la base de données est en cours d'exécution
- Vérifier `DATABASE_URL` dans `.env`
- Vérifier les règles de pare-feu

---

## 📚 Ressources Supplémentaires

### Documentation Officielle

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Guides Connexes

- 📘 [Guide Utilisateur](./GUIDE_UTILISATEUR.md) - Pour comprendre l'utilisation
- 📖 [README](./README.md) - Pour l'architecture et la vue d'ensemble
- 📋 [Audit Technique](./.windsurf/plans/google-audit-report-235f5f.md) - Pour la sécurité

---

## 🤝 Contribution

### Processus de Contribution

1. Fork le projet
2. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
3. Commit vos changements : `git commit -m 'Ajouter ma fonctionnalité'`
4. Push vers la branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une Pull Request

### Standards de Code

- Utiliser TypeScript pour tout nouveau code
- Suivre les conventions de nommage existantes
- Ajouter des commentaires pour le code complexe
- Écrire des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire

---

## 📞 Support

### Obtenir de l'Aide

- Consulter la [documentation](./README.md)
- Vérifier les [issues existantes](https://github.com/your-repo/issues)
- Créer une nouvelle issue avec un titre descriptif
- Inclure des étapes pour reproduire le problème

### Contact

- Email : support@etatcivil-bukavu.cd
- GitHub : [github.com/your-repo](https://github.com/your-repo)

---

**Version du guide** : 1.0  
**Date de mise à jour** : 19 août 2026  
**Mainteneur par** : Équipe Technique de l'État Civil de Bukavu

---

*Ce guide est conçu pour être évolutif. N'hésitez pas à proposer des améliorations.*
