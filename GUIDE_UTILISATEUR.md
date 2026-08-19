# 📘 Guide Utilisateur - Système de Gestion des Mariages et Divorces
## État Civil - Ville de Bukavu

---

## � Documentation Connexe

Ce guide fait partie d'une documentation complète :

| Guide | Lien |
|-------|------|
| 📖 [README](./README.md) | Vue d'ensemble du projet et architecture technique |
| 🛠️ [Guide Développeur](./GUIDE_DEVELOPPEUR.md) | Installation, configuration et développement |
| 📋 [Audit Technique](./.windsurf/plans/google-audit-report-235f5f.md) | Rapport de sécurité et qualité du code |

> 💡 **Conseil** : Si vous êtes développeur ou administrateur système, consultez le [Guide Développeur](./GUIDE_DEVELOPPEUR.md) pour l'installation et la configuration.

---

## �📋 Table des Matières

1. [Informations de Connexion](#informations-de-connexion)
2. [Approche par Compétences](#approche-par-compétences)
3. [Approche par Situation](#approche-par-situation)
4. [Guide Détaillé par Fonctionnalité](#guide-détaillé-par-fonctionnalité)
5. [Bonnes Pratiques et Sécurité](#bonnes-pratiques-et-sécurité)
6. [Dépannage](#dépannage)

---

## 🔐 Informations de Connexion

### Comptes Disponibles (Seed)

| Rôle | Nom d'utilisateur | Mot de passe | Permissions |
|------|-------------------|--------------|-------------|
| **Administrateur** | `admin` | `admin123` | Accès complet, gestion utilisateurs, audit, tous les registres |
| **Officier d'État Civil** | `officier` | `officier123` | Gestion citoyens, mariages, divorces, rapports |

> ⚠️ **Important** : Ces identifiants sont pour l'environnement de développement/démonstration. En production, chaque utilisateur aura ses propres identifiants uniques.

---

## 🎯 Approche par Compétences

### Niveau 1 : Débutant - Bases du Système

**Objectif** : Se connecter et naviguer dans l'interface

#### Compétence 1.1 : Connexion au Système
- ✅ Accéder à la page de connexion
- ✅ S'authentifier avec identifiants valides
- ✅ Comprendre l'interface du tableau de bord

**Étapes** :
1. Ouvrir le navigateur et aller sur `http://localhost:3000/login`
2. Entrer le nom d'utilisateur (`admin` ou `officier`)
3. Entrer le mot de passe correspondant
4. Cliquer sur "Se connecter"
5. Observer le tableau de bord qui s'affiche

#### Compétence 1.2 : Navigation dans l'Interface
- ✅ Utiliser le menu latéral
- ✅ Comprendre les différentes sections
- ✅ Se déconnecter correctement

**Étapes** :
1. Observer le menu latéral gauche
2. Cliquer sur "Vue d'ensemble" pour voir le dashboard
3. Explorer les autres sections : Citoyens, Mariages, Divorces
4. Cliquer sur "Se déconnecter" en bas du menu

---

### Niveau 2 : Intermédiaire - Gestion des Citoyens

**Objectif** : Créer et gérer les fiches citoyens

#### Compétence 2.1 : Création d'un Citoyen
- ✅ Remplir correctement le formulaire citoyen
- ✅ Valider les informations requises
- ✅ Comprendre les champs obligatoires

**Étapes** :
1. Aller dans la section "Citoyens"
2. Cliquer sur "Nouveau citoyen"
3. Remplir les champs :
   - **Numéro national** : Identifiant unique (ex: 123456789)
   - **Nom** : Nom de famille
   - **Post-nom** : Deuxième nom (culture congolaise)
   - **Prénom** : Prénom
   - **Date de naissance** : Date de naissance (pas dans le futur)
   - **Lieu de naissance** : Ville/village de naissance
   - **Sexe** : Homme (M) ou Femme (F)
   - **Profession** : Occupation actuelle
   - **Adresse actuelle** : Adresse de résidence
4. Cliquer sur "Enregistrer"

#### Compétence 2.2 : Recherche et Consultation
- ✅ Rechercher un citoyen par numéro national
- ✅ Consulter les détails d'un citoyen
- ✅ Comprendre la liste des citoyens

**Étapes** :
1. Dans la section Citoyens, utiliser la barre de recherche
2. Taper le numéro national ou nom
3. Observer les résultats filtrés en temps réel

---

### Niveau 3 : Avancé - Gestion des Mariages

**Objectif** : Enregistrer et valider les actes de mariage

#### Compétence 3.1 : Déclaration de Mariage
- ✅ Sélectionner les époux valides
- ✅ Vérifier les conditions de mariage
- ✅ Remplir l'acte de mariage

**Étapes** :
1. Aller dans la section "Registre des mariages"
2. Cliquer sur "Déclarer un mariage"
3. Sélectionner l'époux (doit être de sexe M)
4. Sélectionner l'épouse (doit être de sexe F)
5. Remplir :
   - **Numéro d'acte** : Référence unique du mariage
   - **Date de célébration** : Date du mariage (pas dans le futur)
   - **Lieu de célébration** : Où le mariage a eu lieu
   - **Régime matrimonial** : Choix parmi les options légales
6. Cliquer sur "Enregistrer"

> ⚠️ **Validation automatique** : Le système vérifie que :
> - Les deux époux ont au moins 18 ans
> - Ils ne sont pas déjà mariés (bigamie)
> - Ils sont de sexes différents

#### Compétence 3.2 : Validation d'un Mariage
- ✅ Comprendre le processus de validation
- ✅ Valider un mariage en attente
- ✅ Connaître les implications de la validation

**Étapes** :
1. Dans la liste des mariages, identifier ceux non validés
2. Cliquer sur le bouton de validation
3. Confirmer la validation
4. Observer que le mariage passe en statut "VALIDE"

> 🚫 **Important** : Un mariage validé ne peut plus être modifié.

---

### Niveau 4 : Expert - Gestion des Divorces et Administration

**Objectif** : Gérer les divorces et superviser le système

#### Compétence 4.1 : Enregistrement de Divorce
- ✅ Identifier le mariage concerné
- ✅ Enregistrer la décision de justice
- ✅ Comprendre l'impact sur le mariage

**Étapes** :
1. Aller dans la section "Registre des divorces"
2. Cliquer sur "Déclarer un divorce"
3. Sélectionner le mariage actif concerné
4. Remplir :
   - **Numéro d'acte de divorce** : Référence unique
   - **Date d'enregistrement** : Date d'enregistrement (pas dans le futur)
   - **Référence décision de justice** : Numéro de décision du tribunal
   - **Motif principal** : Raison du divorce
5. Cliquer sur "Enregistrer"

#### Compétence 4.2 : Gestion des Utilisateurs (Admin uniquement)
- ✅ Créer de nouveaux utilisateurs
- ✅ Gérer les rôles et permissions
- ✅ Désactiver des comptes

**Étapes** :
1. Se connecter en tant qu'administrateur
2. Aller dans la section "Utilisateurs"
3. Cliquer sur "Nouvel utilisateur"
4. Remplir les informations et choisir le rôle
5. Cliquer sur "Enregistrer"

#### Compétence 4.3 : Audit et Journal (Admin uniquement)
- ✅ Consulter le journal d'audit
- ✅ Comprendre les actions tracées
- ✅ Identifier les activités suspectes

**Étapes** :
1. Se connecter en tant qu'administrateur
2. Aller dans la section "Journal d'audit"
3. Observer les actions récentes
4. Filtrer par date ou utilisateur si nécessaire

---

## 🎬 Approche par Situation

### Situation 1 : Un Nouveau Citoyen Arrive à l'État Civil

**Contexte** : Une personne vient pour la première fois à l'état civil pour s'inscrire.

**Actions à effectuer** :
1. **Accueil** : Demander les documents d'identité
2. **Enregistrement** :
   - Aller dans "Citoyens"
   - Cliquer sur "Nouveau citoyen"
   - Saisir toutes les informations du document
   - Vérifier que la date de naissance est correcte
3. **Confirmation** : Enregistrer et confirmer avec le citoyen

**Points de vigilance** :
- ✅ Vérifier que le numéro national est unique
- ✅ S'assurer que la date de naissance n'est pas dans le futur
- ✅ Confirmer le sexe avec la personne

---

### Situation 2 : Un Couple Veut Se Marier

**Contexte** : Deux citoyens se présentent pour déclarer leur mariage.

**Actions à effectuer** :
1. **Vérification préliminaire** :
   - Vérifier que les deux citoyens existent dans le système
   - Confirmer qu'ils ont tous les deux au moins 18 ans
   - Vérifier qu'aucun n'est déjà marié
2. **Enregistrement** :
   - Aller dans "Registre des mariages"
   - Cliquer sur "Déclarer un mariage"
   - Sélectionner l'époux et l'épouse
   - Remplir les détails du mariage
3. **Validation** :
   - Une fois les documents vérifiés, valider le mariage
   - Remettre l'extrait de mariage

**Points de vigilance** :
- ✅ Le système bloque automatiquement les mariages de mineurs
- ✅ Le système empêche la bigamie
- ✅ Le mariage doit être hétérosexuel selon le Code de la Famille RDC

---

### Situation 3 : Un Couple Demande le Divorce

**Contexte** : Un couple marié présente une décision de justice pour divorce.

**Actions à effectuer** :
1. **Vérification des documents** :
   - Demander la décision de justice
   - Vérifier que le mariage existe bien
   - Confirmer qu'il n'y a pas déjà un divorce enregistré
2. **Enregistrement** :
   - Aller dans "Registre des divorces"
   - Cliquer sur "Déclarer un divorce"
   - Sélectionner le mariage concerné
   - Saisir la référence de la décision de justice
3. **Validation** :
   - Valider l'acte de divorce
   - Mettre à jour le statut du mariage

**Points de vigilance** :
- ✅ La référence de justice est obligatoire
- ✅ Le mariage doit être actif (pas déjà divorcé)
- ✅ Le divorce ne peut être annulé une fois validé

---

### Situation 4 : Une Erreur a été Comise dans un Acte

**Contexte** : Une erreur a été découverte dans un acte de mariage non encore validé.

**Actions à effectuer** :
1. **Identification** : Trouver l'acte dans le registre
2. **Modification** :
   - Cliquer sur le bouton "Modifier" (icône crayon)
   - Corriger les informations erronées
   - Enregistrer les modifications
3. **Validation** : Procéder à la validation après correction

**Points de vigilance** :
- ✅ La modification n'est possible que si l'acte n'est PAS validé
- ✅ Une fois validé, l'acte devient immuable
- ✅ Toute modification est tracée dans le journal d'audit

---

### Situation 5 : Trop de Tentatives de Connexion

**Contexte** : Un utilisateur ne peut plus se connecter après plusieurs tentatives échouées.

**Actions à effectuer** :
1. **Patienter** : Attendre 15 minutes (le système bloque temporairement)
2. **Vérification** : Confirmer que les identifiants sont corrects
3. **Contact admin** : Si le problème persiste, contacter l'administrateur

**Points de vigilance** :
- ✅ Le système limite à 5 tentatives par 15 minutes
- ✅ Cette protection empêche les attaques par force brute
- ✅ L'administrateur peut consulter les tentatives dans l'audit

---

## 📚 Guide Détaillé par Fonctionnalité

### 🔑 Connexion et Authentification

#### Se Connecter
1. Naviguer vers `/login`
2. Entrer les identifiants :
   - **Admin** : `admin` / `admin123`
   - **Officier** : `officier` / `officier123`
3. Cliquer sur "Se connecter"

#### Se Déconnecter
1. Cliquer sur l'icône utilisateur en haut à droite
2. Sélectionner "Se déconnecter"
3. Confirmation automatique et redirection vers login

#### Changer son Mot de Passe
1. Aller dans "Mon profil"
2. Cliquer sur "Changer le mot de passe"
3. Entrer l'ancien et le nouveau mot de passe
4. Confirmer

---

### 👥 Gestion des Citoyens

#### Créer un Citoyen
1. Section "Citoyens" → "Nouveau citoyen"
2. Remplir tous les champs obligatoires (*)
3. Cliquer sur "Enregistrer"

**Champs obligatoires** :
- Numéro national (5-40 caractères)
- Nom (2-80 caractères)
- Post-nom (2-80 caractères)
- Prénom (2-80 caractères)
- Date de naissance
- Lieu de naissance
- Sexe
- Profession
- Adresse actuelle

#### Rechercher un Citoyen
- Utiliser la barre de recherche en haut du tableau
- Rechercher par numéro national ou nom
- Résultats filtrés en temps réel

#### Supprimer un Citoyen
1. Cliquer sur l'icône corbeille
2. Confirmer la suppression
3. Le citoyen est marqué comme supprimé (soft delete)

---

### 💒 Gestion des Mariages

#### Déclarer un Mariage
1. Section "Registre des mariages" → "Déclarer un mariage"
2. Sélectionner l'époux (liste filtrée par sexe M)
3. Sélectionner l'épouse (liste filtrée par sexe F)
4. Remplir :
   - Numéro d'acte (minimum 3 caractères)
   - Date de célébration
   - Lieu de célébration
   - Régime matrimonial
5. Cliquer sur "Enregistrer"

**Validations automatiques** :
- ✅ Âge minimum 18 ans pour les deux époux
- ✅ Aucun des époux n'est déjà marié
- ✅ Les époux sont de sexes différents

#### Valider un Mariage
1. Cliquer sur le bouton de validation dans la liste
2. Confirmer la validation
3. Le statut passe à "VALIDE"

> ⚠️ **Irréversible** : Un mariage validé ne peut plus être modifié.

#### Modifier un Mariage
1. Cliquer sur l'icône crayon
2. Modifier les champs nécessaires
3. Enregistrer

> 🚫 **Condition** : Seulement possible si le mariage n'est PAS validé.

#### Imprimer un Acte de Mariage
1. Cliquer sur le bouton "Imprimer"
2. Le navigateur ouvre la boîte de dialogue d'impression

---

### ⚖️ Gestion des Divorces

#### Déclarer un Divorce
1. Section "Registre des divorces" → "Déclarer un divorce"
2. Sélectionner le mariage concerné (mariages actifs uniquement)
3. Remplir :
   - Numéro d'acte de divorce
   - Date d'enregistrement
   - Référence décision de justice
   - Motif principal
4. Cliquer sur "Enregistrer"

#### Valider un Divorce
1. Cliquer sur le bouton de validation
2. Confirmer
3. Le statut passe à "VALIDE"

> ⚠️ **Irréversible** : Un divorce validé ne peut plus être modifié.

#### Modifier un Divorce
1. Cliquer sur l'icône crayon
2. Modifier les champs nécessaires
3. Enregistrer

> 🚫 **Condition** : Seulement possible si le divorce n'est PAS validé.

---

### 📊 Rapports et Statistiques

#### Accéder aux Rapports
1. Section "Rapports"
2. Choisir le type de rapport souhaité
3. Filtrer par période si nécessaire

#### Types de Rapports Disponibles
- Mariages par période
- Divorces par période
- Statistiques démographiques
- Évolution des registres

---

### 🔧 Administration (Admin uniquement)

#### Gérer les Utilisateurs
1. Section "Utilisateurs"
2. "Nouvel utilisateur" pour créer
3. Actions : Modifier, Supprimer, Désactiver

#### Consulter le Journal d'Audit
1. Section "Journal d'audit"
2. Voir toutes les actions système
3. Filtrer par utilisateur ou date
4. Identifier les activités suspectes

**Informations tracées** :
- Qui a effectué l'action
- Quelle action (CRÉATION, MODIFICATION, VALIDATION, SUPPRESSION)
- Quand (date et heure)
- Sur quelle entité
- Résumé de l'action

---

## 🛡️ Bonnes Pratiques et Sécurité

### 🔐 Sécurité des Identifiants
- ✅ Ne jamais partager ses identifiants
- ✅ Changer régulièrement son mot de passe
- ✅ Se déconnecter après chaque session
- ✅ Verrouiller son ordinateur quand on s'absente

### ✅ Exactitude des Données
- ✅ Vérifier toutes les informations avant enregistrement
- ✅ Confirmer avec les citoyens les données saisies
- ✅ Corriger les erreurs avant validation
- ✅ Garder les documents justificatifs

### 📝 Traçabilité
- ✅ Toutes les actions sont enregistrées dans l'audit
- ✅ L'audit permet de retracer l'historique
- ✅ En cas d'erreur, consulter le journal
- ✅ L'administrateur supervise toutes les activités

### ⚠️ Limitations du Système
- 🚫 Pas de modification d'actes validés
- 🚫 Pas de dates futures pour les événements passés
- 🚫 Pas de mariages pour les mineurs (<18 ans)
- 🚫 Pas de bigamie (un seul mariage actif)
- 🚫 Taux limite de connexion (5 tentatives / 15 min)

---

## 🔧 Dépannage

### Problème : Impossible de se connecter

**Causes possibles** :
1. Identifiants incorrects
2. Trop de tentatives (rate limit)
3. Compte désactivé

**Solutions** :
1. Vérifier le nom d'utilisateur et mot de passe
2. Attendre 15 minutes si trop de tentatives
3. Contacter l'administrateur si le compte est désactivé

---

### Problème : Impossible de créer un mariage

**Causes possibles** :
1. Un des époux est mineur
2. Un des époux est déjà marié
3. Les époux sont du même sexe
4. Citoyen introuvable

**Solutions** :
1. Vérifier l'âge des deux époux (minimum 18 ans)
2. Vérifier s'il y a un divorce enregistré
3. Confirmer le sexe des deux époux
4. Créer d'abord les fiches citoyens

---

### Problème : Impossible de modifier un acte

**Cause** : L'acte est déjà validé

**Solution** : Les actes validés sont immuables par conception. Si une erreur est découverte après validation, contacter l'administrateur pour une procédure exceptionnelle.

---

### Problème : Date future refusée

**Cause** : Le système empêche les dates futures pour les événements passés

**Solution** : Vérifier la date saisie et corriger si nécessaire

---

### Problème : Message "Trop de tentatives"

**Cause** : Rate limiting activé après 5 tentatives échouées

**Solution** : Attendre 15 minutes avant de réessayer

---

## 📞 Support et Contact

### En cas de problème technique
1. Consulter ce guide
2. Vérifier le journal d'audit (si admin)
3. Contacter l'administrateur système

### Pour les questions juridiques
- Consulter le Code de la Famille de la RDC
- Contacter les services juridiques compétents

---

## 📖 Glossaire

| Terme | Définition |
|-------|------------|
| **Acte** | Document officiel enregistré (mariage, divorce) |
| **Bigamie** | Fait d'être marié à plusieurs personnes en même temps |
| **Régime matrimonial** :** | Règles régissant les biens dans le mariage |
| **Soft delete** :** | Suppression logique (données conservées mais marquées) |
| **Validation** :** | Action de confirmer et rendre définitif un acte |
| **Audit** :** | Journal de toutes les actions effectuées dans le système |
| **Rate limiting** :** | Limite du nombre de tentatives de connexion |

---

## 🎓 Certification des Compétences

### Checklist de Progression

#### Niveau Débutant ☐
- [ ] Je peux me connecter au système
- [ ] Je connais les différents rôles
- [ ] Je peux naviguer dans l'interface
- [ ] Je peux me déconnecter correctement

#### Niveau Intermédiaire ☐
- [ ] Je peux créer un citoyen
- [ ] Je peux rechercher un citoyen
- [ ] Je comprends les champs obligatoires
- [ ] Je peux corriger une erreur de saisie

#### Niveau Avancé ☐
- [ ] Je peux déclarer un mariage
- [ ] Je comprends les validations automatiques
- [ ] Je peux valider un mariage
- [ ] Je peux enregistrer un divorce
- [ ] Je connais les implications de la validation

#### Niveau Expert ☐
- [ ] Je peux gérer les utilisateurs (admin)
- [ ] Je peux consulter et interpréter l'audit
- [ ] Je peux résoudre les problèmes courants
- [ ] Je peux former de nouveaux utilisateurs

---

**Version du guide** : 1.0  
**Date de mise à jour** : 19 août 2026  
**Système** : Système de Gestion des Mariages et Divorces - État Civil Bukavu

---

*Ce guide a été conçu pour être pédagogique et progressif. N'hésitez pas à le consulter régulièrement et à demander de l'aide à votre superviseur en cas de doute.*
