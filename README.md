# 🏛️ Système de Gestion des Mariages et Divorces
## État Civil - Ville de Bukavu

Système de gestion civile numérique pour l'enregistrement des mariages et divorces, conforme au Code de la Famille de la République Démocratique du Congo.

---

## 📚 Documentation Complète

Ce projet dispose d'une documentation complète structurée pour différents publics :

| Guide | Public | Description |
|-------|--------|-------------|
| [📘 Guide Utilisateur](./GUIDE_UTILISATEUR.md) | Officiers, Administrateurs | Guide complet pour utiliser l'application au quotidien |
| [🛠️ Guide Développeur](./GUIDE_DEVELOPPEUR.md) | Développeurs | Installation, configuration, développement et contribution |
| [📋 Audit Technique](./.windsurf/plans/google-audit-report-235f5f.md) | Équipe technique | Rapport d'audit sécurité et qualité du code |

> 💡 **Conseil** : Nouveau sur le projet ? Commencez par le [Guide Utilisateur](./GUIDE_UTILISATEUR.md) pour comprendre le fonctionnement, puis consultez le [Guide Développeur](./GUIDE_DEVELOPPEUR.md) pour l'installation.

---

## 🎯 Vue d'Ensemble

### Objectifs du Système

- ✅ Digitaliser le registre d'état civil de Bukavu
- ✅ Garantir la conformité avec le Code de la Famille RDC
- ✅ Assurer la traçabilité de toutes les actions (audit)
- ✅ Sécuriser les données sensibles des citoyens
- ✅ Faciliter les recherches et les statistiques

### Fonctionnalités Principales

- 📋 **Gestion des Citoyens** : Enregistrement et consultation des fiches citoyens
- 💒 **Gestion des Mariages** : Déclaration et validation des actes de mariage
- ⚖️ **Gestion des Divorces** : Enregistrement des dissolutions de mariage
- 👥 **Gestion des Utilisateurs** : Administration des comptes et permissions
- 📊 **Rapports** : Statistiques et rapports périodiques
- 🔍 **Audit** : Journal complet de toutes les actions système

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou pnpm
- Git

### Installation en 5 minutes

```bash
# 1. Cloner le projet
git clone <repository-url>
cd systeme-de-gestion-des-mariages-et-divorce

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env

# 4. Initialiser la base de données
npx prisma generate
npx prisma db push

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Identifiants de Développement

| Rôle | Username | Mot de passe |
|------|----------|--------------|
| Administrateur | `admin` | `admin123` |
| Officier | `officier` | `officier123` |

> ⚠️ **Important** : Ces identifiants sont uniquement pour l'environnement de développement. Consultez le [Guide Développeur](./GUIDE_DEVELOPPEUR.md) pour la configuration en production.

---

## 🏗️ Architecture Technique

### Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 16.2.6 |
| Language | TypeScript | 5.7.3 |
| ORM | Prisma | 5.14.0 |
| Base de données (dev) | SQLite | - |
| Base de données (prod) | PostgreSQL | - |
| Authentification | JWT (jsonwebtoken) | 9.0.2 |
| Hachage | bcryptjs | 2.4.3 |
| Validation | Zod | 4.4.3 |
| Styling | Tailwind CSS | 4.3.3 |
| UI Components | shadcn/ui | - |

### Architecture en Couche

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)             │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Pages      │  │  Components  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         API Routes (Next.js)            │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Controllers │  │  Middleware  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Services Layer                  │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Business    │  │  Validation  │   │
│  │  Logic       │  │  Utilities   │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Repository Layer                │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Data Access │  │  Queries     │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Database (Prisma)               │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │  SQLite      │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
systeme-de-gestion-des-mariages-et-divorce/
├── app/                          # Application Next.js
│   ├── (dashboard)/              # Pages du dashboard (groupe de route)
│   │   ├── citizens/             # Gestion des citoyens
│   │   ├── marriages/            # Gestion des mariages
│   │   ├── divorces/             # Gestion des divorces
│   │   ├── users/                # Gestion des utilisateurs
│   │   ├── reports/              # Rapports et statistiques
│   │   ├── audit/                # Journal d'audit
│   │   └── dashboard/            # Page d'accueil
│   ├── api/                      # Routes API
│   │   ├── auth/                 # Authentification
│   │   │   └── login/            # Endpoint de connexion
│   │   ├── citizens/             # API citoyens
│   │   ├── marriages/            # API mariages
│   │   │   └── [id]/validate/   # Validation mariage
│   │   ├── divorces/             # API divorces
│   │   │   └── [id]/validate/   # Validation divorce
│   │   ├── users/                # API utilisateurs
│   │   └── audit/                # API audit logs
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts               # Actions d'authentification
│   │   └── citizen.ts            # Actions citoyens
│   ├── login/                    # Page de connexion
│   └── layout.tsx                # Layout principal
├── components/                    # Composants React
│   ├── layout/                   # Composants de layout
│   │   └── dashboard-layout.tsx  # Layout du dashboard
│   ├── shared/                   # Composants partagés
│   │   ├── data-table.tsx        # Tableau de données
│   │   └── modal.tsx            # Modal
│   └── ui/                       # Composants UI (shadcn)
├── lib/                          # Bibliothèques et utilitaires
│   ├── auth.ts                   # Fonctions d'authentification
│   ├── db.ts                     # Client Prisma
│   ├── middleware/               # Middleware
│   │   ├── auth.guard.ts         # Guard d'authentification
│   │   └── rate-limit.ts         # Rate limiting
│   ├── repositories/             # Couche d'accès aux données
│   │   ├── citizen.repository.ts
│   │   ├── marriage.repository.ts
│   │   ├── divorce.repository.ts
│   │   └── user.repository.ts
│   ├── services/                 # Logique métier
│   │   ├── auth.service.ts
│   │   ├── citizen.service.ts
│   │   ├── marriage.service.ts
│   │   └── divorce.service.ts
│   └── utils/                    # Utilitaires
│       ├── api-response.ts       # Réponses API standardisées
│       ├── jwt.ts                # Gestion JWT centralisée
│       └── validation.ts         # Validation des données
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Schéma de base de données
│   ├── seed.ts                   # Données de test
│   └── seed.js                   # Données de test (JS)
├── public/                       # Fichiers statiques
├── GUIDE_UTILISATEUR.md          # Guide pour les utilisateurs
├── GUIDE_DEVELOPPEUR.md          # Guide pour les développeurs
├── README.md                     # Ce fichier
├── package.json                  # Dépendances
├── tsconfig.json                 # Configuration TypeScript
└── .env.example                  # Variables d'environnement exemple
```

---

## 🔐 Sécurité

### Mesures de Sécurité Implémentées

- ✅ **Authentification JWT** avec expiration configurable
- ✅ **Hachage bcrypt** pour les mots de passe
- ✅ **Rate limiting** (5 tentatives / 15 minutes) sur le login
- ✅ **Protection des routes** par middleware d'authentification
- ✅ **Validation des données** avec Zod
- ✅ **Soft delete** pour préserver l'historique
- ✅ **Audit logging** pour traçabilité complète
- ✅ **Transactions** pour les opérations critiques
- ✅ **Validation âge minimum** (18 ans) pour les mariages
- ✅ **Protection contre la bigamie** via vérifications atomiques

### Rôles et Permissions

| Rôle | Citoyens | Mariages | Divorces | Utilisateurs | Audit |
|------|----------|----------|----------|--------------|-------|
| **ADMIN** | CRUD | CRUD | CRUD | CRUD | ✅ |
| **OFFICIER** | Read | CRUD | CRUD | ❌ | ❌ |

---

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion (rate limité)

### Citoyens
- `GET /api/citizens` - Liste des citoyens (ADMIN, OFFICIER)
- `POST /api/citizens` - Créer un citoyen (ADMIN)
- `GET /api/citizens/[id]` - Détails d'un citoyen (ADMIN, OFFICIER)
- `PUT /api/citizens/[id]` - Modifier un citoyen (ADMIN)
- `DELETE /api/citizens/[id]` - Supprimer un citoyen (ADMIN)

### Mariages
- `GET /api/marriages` - Liste des mariages (ADMIN, OFFICIER)
- `POST /api/marriages` - Créer un mariage (ADMIN, OFFICIER)
- `GET /api/marriages/[id]` - Détails d'un mariage (ADMIN, OFFICIER)
- `PUT /api/marriages/[id]` - Modifier un mariage (ADMIN, OFFICIER)
- `DELETE /api/marriages/[id]` - Supprimer un mariage (ADMIN)
- `POST /api/marriages/[id]/validate` - Valider un mariage (ADMIN, OFFICIER)

### Divorces
- `GET /api/divorces` - Liste des divorces (ADMIN, OFFICIER)
- `POST /api/divorces` - Créer un divorce (ADMIN, OFFICIER)
- `GET /api/divorces/[id]` - Détails d'un divorce (ADMIN, OFFICIER)
- `PUT /api/divorces/[id]` - Modifier un divorce (ADMIN, OFFICIER)
- `DELETE /api/divorces/[id]` - Supprimer un divorce (ADMIN)
- `POST /api/divorces/[id]/validate` - Valider un divorce (ADMIN, OFFICIER)

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (ADMIN)
- `POST /api/users` - Créer un utilisateur (ADMIN)
- `GET /api/users/[id]` - Détails d'un utilisateur (ADMIN)
- `PUT /api/users/[id]` - Modifier un utilisateur (ADMIN)
- `DELETE /api/users/[id]` - Supprimer un utilisateur (ADMIN)

### Audit
- `GET /api/audit` - Journal d'audit (ADMIN uniquement)

---

## ⚖️ Règles Métier

### Conformité au Code de la Famille RDC

- ✅ Les mariages doivent être hétérosexuels
- ✅ Âge minimum de 18 ans pour le mariage
- ✅ Un citoyen ne peut être engagé que dans un seul mariage actif (anti-bigamie)
- ✅ Un divorce ne peut être enregistré que pour un mariage existant sans divorce précédent
- ✅ Les actes validés sont immuables (non modifiables)
- ✅ Les dates futures sont interdites pour les événements passés

---

## 🛠️ Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Construit l'application pour la production |
| `npm start` | Lance l'application en production |
| `npm run lint` | Exécute le linter ESLint |
| `npx prisma generate` | Génère le client Prisma |
| `npx prisma db push` | Synchronise le schéma avec la base de données |
| `npx prisma studio` | Ouvre Prisma Studio pour visualiser la base |
| `npx prisma db seed` | Exécute le seed pour les données de test |

---

## 📈 Roadmap

### Version Actuelle : 1.0.0

### Fonctionnalités Futures (Roadmap)

- [ ] Export PDF des actes
- [ ] Recherche avancée avec filtres multiples
- [ ] Signatures numériques
- [ ] Notifications automatiques
- [ ] API publique pour les tiers autorisés
- [ ] Application mobile
- [ ] Intégration avec le système national d'identité
- [ ] Mode hors-ligne pour les zones sans internet

---

## 🤝 Contribution

Pour contribuer à ce projet, veuillez consulter le [Guide Développeur](./GUIDE_DEVELOPPEUR.md).

### Processus de Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 Support

### Documentation

- 📘 [Guide Utilisateur](./GUIDE_UTILISATEUR.md) - Pour les utilisateurs finaux
- 🛠️ [Guide Développeur](./GUIDE_DEVELOPPEUR.md) - Pour l'installation et le développement
- 📋 [Audit Technique](./.windsurf/plans/google-audit-report-235f5f.md) - Rapport de sécurité et qualité

### Signalement de Bugs

Pour signaler un bug ou proposer une amélioration :
1. Vérifiez si le problème existe déjà dans les issues
2. Créez une nouvelle issue avec un titre descriptif
3. Décrivez le problème en détail
4. Incluez des étapes pour reproduire
5. Joignez des captures d'écran si applicable

---

## 📜 License

Ce projet est propriété de l'État congolais. Tous droits réservés.

---

## 🙏 Remerciements

- Ministère de l'Intérieur et Sécurité de la RDC
- Mairie de Bukavu
- Équipe technique de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : 19 août 2026  
**Mainteneur par** : Équipe Technique de l'État Civil de Bukavu

