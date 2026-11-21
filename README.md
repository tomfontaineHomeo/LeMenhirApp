# LeMenhirApp

Première ébauche de la webapp de l'école de kitesurf **Le Menhir Normandie Kite** (Cabourg) :
suivi des élèves, des cours et de la progression, côté élève et côté moniteurs.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Prisma](https://www.prisma.io) + **PostgreSQL** (hébergé sur [Supabase](https://supabase.com), plan gratuit)
- [Auth.js / NextAuth v5](https://authjs.dev) (Credentials + rôles)
- [Supabase Storage](https://supabase.com/docs/guides/storage) pour les photos des élèves
- Hébergement : [Vercel](https://vercel.com) (plan gratuit Hobby)

## Démarrer en local

```bash
npm install
cp .env.example .env   # puis remplir les variables (voir "Déploiement" ci-dessous)
npm run db:push        # crée les tables Postgres à partir du schéma
npm run db:seed        # crée les comptes de démo
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Comptes créés par le seed

| Rôle    | Email                          | Mot de passe     |
| ------- | ------------------------------ | ---------------- |
| Admin   | quentin@lemenhirapp.fr         | LeMenhir2026!    |
| Admin   | tom@lemenhirapp.fr              | LeMenhir2026!    |
| Élève   | demo.eleve@lemenhirapp.fr       | LeMenhir2026!    |

**À changer avant toute mise en ligne publique** (ou supprimer le compte démo élève).

## Ce que contient cette première version

- **Landing page** aux couleurs du Menhir (navy `#1B2A3F`, jaune `#FFF108`, bleu pâle `#D7E4EC`, police Quicksand)
- **Inscription élève** autonome (`/register`) → crée un compte + profil élève
- **Espace élève** (`/espace`) : niveau, progression (Découverte → Initiation → Navigation surveillée → Autonome → Perfectionnement), heures restantes, historique des cours, photos de session
- **Espace admin/moniteurs** (`/admin`) réservé aux comptes `ADMIN`/`INSTRUCTOR` :
  - liste et recherche des élèves
  - fiche élève détaillée : changement de niveau, ajout de packs d'heures, ajout de cours (discipline, durée, conditions, notes), upload de photo (dont photo de profil), notes de coaching
  - création de nouvel élève depuis le bureau de l'école

Les photos sont stockées sur Supabase Storage (bucket `photos`, public en lecture).

---

## Déploiement (Supabase + Vercel, gratuit)

Les comptes et projets Supabase/Vercel doivent être créés par vous (connexion GitHub incluse) —
je ne peux pas le faire à votre place. Voici la marche à suivre, étape par étape.

### 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New project** (plan Free).
2. Nom du projet : `lemenhirapp` (ou ce que vous voulez), choisir une région proche (`eu-west-3` Paris si disponible), définir un mot de passe de base de données (le garder précieusement).
3. Une fois le projet créé, aller dans **Project Settings → Database → Connection string**, onglet **Session pooler**. Copier l'URL, remplacer `[YOUR-PASSWORD]` par le mot de passe choisi à l'étape 2. C'est votre `DATABASE_URL`.
4. Aller dans **Project Settings → API** : copier **Project URL** (`SUPABASE_URL`) et la clé **service_role** (`SUPABASE_SERVICE_ROLE_KEY` — secrète, ne jamais l'exposer côté client).
5. Créer le bucket de stockage des photos : **Storage → New bucket** → nom `photos`, cocher **Public bucket**. (Ou via l'onglet **SQL Editor**, exécuter : `insert into storage.buckets (id, name, public) values ('photos', 'photos', true);`)

### 2. Préparer la base

En local, avec les variables ci-dessus dans `.env` :

```bash
npm run db:push
npm run db:seed
```

Cela crée les tables sur Supabase et les comptes de démo (à changer ensuite).

### 3. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **Add New → Project** → importer le dépôt GitHub `tomfontaineHomeo/LeMenhirApp` (connexion GitHub à autoriser si ce n'est pas déjà fait).
2. Choisir la branche à déployer (`main` une fois la PR mergée, ou la branche de travail pour prévisualiser).
3. Dans **Environment Variables**, ajouter :
   - `DATABASE_URL`
   - `AUTH_SECRET` (générer avec `openssl rand -base64 32` — **différent** de celui utilisé en local si vous voulez des sessions distinctes)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - (`AUTH_TRUST_HOST` n'est pas nécessaire sur Vercel, détecté automatiquement)
4. **Deploy**. Vercel build et déploie automatiquement à chaque push sur la branche choisie.

### Notes pour la suite

- Le pooler Supabase "Session pooler" convient très bien pour une v1 (faible trafic). Si le site grandit, on pourra séparer `DATABASE_URL` (pooled, port 6543) et une `DIRECT_URL` dédiée aux migrations.
- Pour l'instant le schéma est appliqué avec `prisma db push` (pas d'historique de migrations). Pour un vrai suivi de schéma en prod, on passera à `prisma migrate` quand le modèle de données se stabilisera.
- Le bucket `photos` est public en lecture (simple pour une v1) : à revoir si on veut restreindre l'accès aux photos (URLs signées) plus tard.

## Pistes pour la suite

- Vidéos de coaching par élève
- Messagerie / communauté LeMenhirApp
- Gestion des réservations et paiement en ligne
- Application mobile (App Store / Play Store) en réutilisant les mêmes routes API
