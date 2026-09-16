# Maison Fritz — site web

Site immobilier dynamique : Next.js + base de données MySQL, avec un espace
d'administration pour gérer vous-même les propriétés, les agents, le blog,
les offres d'emploi et les demandes reçues — sans toucher au code.

## Comment c'est construit

- **Next.js** (React) pour les pages
- **MySQL** pour les données (compatible avec le plugin "MySQL" de Railway,
  comme pour CongoToit — pas de Prisma, connexion directe via `mysql2`)
- **Espace admin** protégé par mot de passe sur `/admin`
- Les photos se collent en URL (comme pour CongoToit : uploadez sur
  Cloudinary, collez le lien dans le formulaire admin)

## Tester en local (optionnel)

Vous n'êtes pas obligé de faire ça — vous pouvez directement déployer sur
Railway (étapes plus bas). Mais si vous voulez voir le site tourner sur
votre ordinateur avant :

1. `npm install`
2. Copiez `.env.example` en `.env.local` et remplissez les valeurs
   (il vous faut un serveur MySQL — local ou distant)
3. `npm run seed` — crée les tables et ajoute des données d'exemple
4. `npm run dev` — ouvrez http://localhost:3000

## Déployer sur Railway (comme CongoToit)

1. **Créer le dépôt GitHub**
   Le projet est déjà initialisé en Git localement. Créez un nouveau dépôt
   vide sur GitHub (ex. `maison-fritz-site`), puis :
   ```
   git add -A
   git commit -m "Site Maison Fritz"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/maison-fritz-site.git
   git push -u origin main
   ```

2. **Créer le projet Railway**
   Sur railway.app : New Project → Deploy from GitHub repo → sélectionnez
   `maison-fritz-site`.

3. **Ajouter une base de données MySQL**
   Dans le même projet Railway : + New → Database → Add MySQL.
   (Exactement comme pour CongoToit.)

4. **Relier la base au service web**
   Dans les variables d'environnement du service du site (pas la base),
   ajoutez une référence vers les variables de la base MySQL — Railway
   vous propose normalement `${{MySQL.MYSQLHOST}}`, `${{MySQL.MYSQLPORT}}`,
   `${{MySQL.MYSQLUSER}}`, `${{MySQL.MYSQLPASSWORD}}`,
   `${{MySQL.MYSQLDATABASE}}` dans l'autocomplétion. Ajoutez-les sous les
   mêmes noms (`MYSQLHOST`, `MYSQLPORT`, etc.) au service du site.

5. **Ajouter les deux autres variables, sur le service du site**
   - `ADMIN_PASSWORD` — le mot de passe pour vous connecter à `/admin`
   - `ADMIN_SESSION_SECRET` — une chaîne aléatoire longue (32+ caractères)

6. **Initialiser la base de données**
   Une fois le premier déploiement terminé, ouvrez l'onglet "Shell" (ou
   "Run a command") du service sur Railway, et lancez :
   ```
   npm run seed
   ```
   Ça crée les tables et ajoute quelques exemples de propriétés, agents,
   etc. — vous les remplacerez ensuite par les vrais depuis `/admin`.
   (Si vous préférez partir sans données d'exemple, videz les blocs
   `INSERT` dans `scripts/seed.ts` avant de lancer la commande — le
   script crée quand même les tables.)

7. **C'est en ligne**
   Railway vous donne une URL du type
   `maison-fritz-site-production.up.railway.app`. Connectez-vous sur
   `/admin` avec le mot de passe défini à l'étape 5, et remplacez les
   exemples par vos vraies propriétés, agents, articles et offres d'emploi.

## Utiliser l'espace admin

Rendez-vous sur `/admin`, connectez-vous avec `ADMIN_PASSWORD`. Depuis le
tableau de bord :

- **Propriétés** — créer/modifier/supprimer un bien, cocher Exclusive /
  Newly Built / Frontline Beach / Propriété vedette, coller les photos
  (une URL Cloudinary par ligne)
- **Agents** — créer les profils qui apparaissent sur `/team`
- **Blog** — publier des articles
- **Offres d'emploi** — gérer les annonces sur `/careers`
- **Demandes reçues** — tous les messages envoyés via les formulaires du
  site (contact, demande sur un bien, candidature, "Sell with us")

## Pour aller plus loin avec Claude Code

Le code est structuré simplement pour que Claude Code (une fois installé
sur un ordinateur compatible, ou via GitHub Codespaces) puisse facilement
faire des ajustements : `src/app/` pour les pages, `src/lib/queries/` pour
les requêtes à la base, `src/lib/actions/` pour tout ce qui écrit dans la
base (formulaires et admin).
