# 🚀 StudySync

Application web de gestion de travail étudiant permettant de :

- gérer des tâches personnelles
- gérer des projets de groupe
- organiser un planning étudiant
- prioriser automatiquement les tâches

---

# 🧱 Stack Technique

## Frontend

- React
- Tailwind CSS
- React Router

## Backend

- Node.js
- Express

## Base de données

- PostgreSQL
- Prisma ORM

---

# 📁 Structure du Projet

```plaintext
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── prisma/
│
│
├── database/

```

# 🧠 Convention de nommage

## Variables

Les variables doivent être :

- en anglais
- en camelCase
- sans underscore

### ✅ Bon exemple

```js
const listeTaches = [];
const utilisateurConnecte = {};
const dateLimite = new Date();
```

### ❌ Mauvais exemple

```js
const liste_taches = [];
const UserData = {};
const DATE = "";
```

---

# 🧠 Fonctions

Les fonctions doivent :

- être en français
- utiliser camelCase
- commencer par un verbe

### ✅ Bon exemple

```js
function recupererTaches() {}

function creerUtilisateur() {}

function calculerPriorite() {}
```

---

# ⚛️ Composants React

Les composants React doivent :

- commencer par une majuscule
- avoir un nom explicite

### ✅ Bon exemple

```jsx
function CarteTache() {}

function BarreNavigation() {}
```

---

# 📂 Dossiers

Les dossiers doivent être :

- en minuscule
- sans espace
- sans underscore

### ✅ Bon exemple

```plaintext
components/
pages/
services/
```

---

# 📄 Fichiers

Les fichiers doivent :

- être en camelCase
- avoir un nom clair

### ✅ Bon exemple

```plaintext
serviceTache.js
calculPriorite.js
```

---
