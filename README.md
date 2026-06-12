# 🎯 Vinted Multi-Sniper V2

Un outil de sniping de pointe et ultra-réactif conçu avec **Next.js 14**, **TypeScript** et **Tailwind CSS**. Il permet de surveiller en parallèle des dizaines de configurations de filtres différentes sur Vinted et d'envoyer instantanément les nouveautés sur ton tableau de bord et tes salons **Discord** sans aucune perte d'alerte.

---

## ✨ Fonctionnalités Clés

- **⚡ Surveillance Multi-Espaces Simultanée** : Créez autant d'onglets de recherche que vous le souhaitez. L'application interroge Vinted en arrière-plan pour chaque espace de manière indépendante.
- **🎛️ Filtres Avancés & Adaptatifs** :
  - Recherche par mots-clés précis.
  - Sélection fine par catégorie (Hommes, Femmes, Enfants).
  - **Arbre de tailles dynamique** : Les tailles s'adaptent selon la catégorie (affiche des pointures pour les baskets, des tailles américaines `W30` pour les jeans hommes, et du `S/M/L` pour le reste).
  - Tranche de prix complète (Prix Minimum et Prix Maximum).
  - Sélection multiple de l'état des articles (Neuf avec étiquette, Très bon état, etc.).
- **🧹 Nettoyage Instantané** : À chaque modification ou sauvegarde d'un filtre, le flux est nettoyé instantanément pour ne laisser place qu'aux résultats frais.
- **🔗 Intégration Discord Webhook Optimisée** :
  - Optionnelle par espace de recherche (vous pouvez envoyer le flux de l'Espace A sur un salon Discord, et l'Espace B sur un autre).
  - **Système Anti-Spam (Groupement par 10)** : L'API regroupe jusqu'à 10 articles par message pour éviter de saturer Discord.
  - **Gestion intelligente du Rate Limit (Erreur 429)** : Si Discord demande de ralentir, l'application se met en pause automatiquement le temps nécessaire et renvoie le paquet sans perdre un seul article.
- **🛡️ Mécanisme Anti-Anti-Bot** : Headers HTTP réalistes simulant un comportement humain pour minimiser les blocages (Erreurs `403 Forbidden`).

---

## 🛠️ Technologies Utilisées

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescript.org/)
- **Style** : [Tailwind CSS](https://tailwindcss.com/) (Thème Dark Mode moderne)
- **Notifications** : Discord Webhooks (Rich Embeds & Boutons d'action)

---

## 🚀 Installation et Démarrage

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v18+) installé sur votre machine.

### 2. Cloner le projet
```bash
git clone [https://github.com/votre-compte/vinted-multi-sniper.git](https://github.com/votre-compte/vinted-multi-sniper.git)
cd vinted-multi-sniper

npm install
# ou
yarn install
# ou
pnpm install

npm run dev
