# Système de Gestion des Mariages et Divorces

Système de gestion civile pour l'enregistrement des mariages et divorces, conforme au Code de la Famille de la RDC.

## Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **SQLite** - Base de données (développement)
- **bcryptjs** - Hachage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **Tailwind CSS** - Styling

## Structure du Projet

```
├── app/
│   ├── api/              # Routes API
│   │   ├── auth/         # Authentification
│   │   ├── citizens/     # Gestion des citoyens
│   │   ├── marriages/    # Gestion des mariages
│   │   ├── divorces/     # Gestion des divorces
│   │   └── users/        # Gestion des utilisateurs
│   └── ...               # Pages frontend
├── lib/
│   ├── db.ts             # Client Prisma
│   ├── middleware/       # Middleware d'authentification
│   ├── repositories/     # Couche d'accès aux données
│   ├── services/         # Logique métier
│   └── utils/            # Utilitaires
├── prisma/
│   └── schema.prisma     # Schéma de base de données
└── public/               # Fichiers statiques
```

## Installation

1. Cloner le repository
2. Installer les dépendances:
```bash
npm install
```

3. Configurer les variables d'environnement:
```bash
cp .env.example .env
```

4. Générer le client Prisma:
```bash
npx prisma generate
```

5. Créer la base de données:
```bash
npx prisma db push
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Déploiement sur Vercel

1. Connecter votre compte Vercel
2. Importer le projet
3. Configurer les variables d'environnement:
   - `DATABASE_URL`: URL de votre base de données PostgreSQL
   - `NEXTAUTH_URL`: URL de votre application
   - `NEXTAUTH_SECRET`: Clé secrète pour JWT
4. Déployer

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion

### Citoyens
- `GET /api/citizens` - Liste des citoyens (ADMIN, OFFICIER)
- `POST /api/citizens` - Créer un citoyen (ADMIN)
- `PUT /api/citizens/[id]` - Modifier un citoyen (ADMIN, OFFICIER)
- `DELETE /api/citizens/[id]` - Supprimer un citoyen (ADMIN)

### Mariages
- `GET /api/marriages` - Liste des mariages (ADMIN, OFFICIER)
- `POST /api/marriages` - Créer un mariage (ADMIN, OFFICIER)
- `PUT /api/marriages/[id]` - Modifier un mariage (ADMIN, OFFICIER)
- `DELETE /api/marriages/[id]` - Supprimer un mariage (ADMIN)

### Divorces
- `GET /api/divorces` - Liste des divorces (ADMIN, OFFICIER)
- `POST /api/divorces` - Créer un divorce (ADMIN, OFFICIER)
- `PUT /api/divorces/[id]` - Modifier un divorce (ADMIN, OFFICIER)
- `DELETE /api/divorces/[id]` - Supprimer un divorce (ADMIN)

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (ADMIN)
- `POST /api/users` - Créer un utilisateur (ADMIN)
- `PUT /api/users/[id]` - Modifier un utilisateur (ADMIN)
- `DELETE /api/users/[id]` - Supprimer un utilisateur (ADMIN)

## Règles Métier

- Les mariages doivent être hétérosexuels selon le Code de la Famille de la RDC
- Un citoyen ne peut être engagé que dans un seul mariage actif (pas de bigamie)
- Un divorce ne peut être enregistré que pour un mariage existant sans divorce précédent
- Les officiers et administrateurs sont les seuls à pouvoir enregistrer les actes

## Sécurité

- Authentification JWT avec expiration de 8h
- Hachage des mots de passe avec bcrypt
- Protection des routes par middleware d'authentification
- Validation des données entrantes
- Soft delete pour les utilisateurs

## License

Ce projet est propriété de l'État congolais.
