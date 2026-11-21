# LeMenhirApp

Première ébauche de la webapp de l'école de kitesurf **Le Menhir Normandie Kite** (Cabourg) :
suivi des élèves, des cours et de la progression, côté élève et côté moniteurs.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Prisma](https://www.prisma.io) + SQLite (dev) — migration facile vers Postgres pour la prod
- [Auth.js / NextAuth v5](https://authjs.dev) (Credentials + rôles)

## Démarrer en local

```bash
npm install
cp .env.example .env   # puis générer un AUTH_SECRET (voir plus bas)
npm run db:push        # crée la base SQLite à partir du schéma
npm run db:seed        # crée les comptes de démo
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Générer un `AUTH_SECRET` :

```bash
openssl rand -base64 32
```

## Comptes créés par le seed

| Rôle    | Email                          | Mot de passe     |
| ------- | ------------------------------ | ---------------- |
| Admin   | quentin@lemenhirapp.fr         | LeMenhir2026!    |
| Admin   | tom@lemenhirapp.fr              | LeMenhir2026!    |
| Élève   | demo.eleve@lemenhirapp.fr       | LeMenhir2026!    |

**À changer avant toute mise en ligne publique.**

## Ce que contient cette première version

- **Landing page** aux couleurs du Menhir (navy `#1B2A3F`, jaune `#FFF108`, bleu pâle `#D7E4EC`, police Quicksand)
- **Inscription élève** autonome (`/register`) → crée un compte + profil élève
- **Espace élève** (`/espace`) : niveau, progression (Découverte → Initiation → Navigation surveillée → Autonome → Perfectionnement), heures restantes, historique des cours, photos de session
- **Espace admin/moniteurs** (`/admin`) réservé aux comptes `ADMIN`/`INSTRUCTOR` :
  - liste et recherche des élèves
  - fiche élève détaillée : changement de niveau, ajout de packs d'heures, ajout de cours (discipline, durée, conditions, notes), upload de photo (dont photo de profil), notes de coaching
  - création de nouvel élève depuis le bureau de l'école

Les photos sont stockées localement dans `public/uploads` pour ce premier jet — à remplacer par un stockage externe (S3, Cloudinary...) avant la mise en production.

## Pistes pour la suite

- Vidéos de coaching par élève
- Messagerie / communauté LeMenhirApp
- Gestion des réservations et paiement en ligne
- Application mobile (App Store / Play Store) en réutilisant les mêmes routes API
