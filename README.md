# Task Manager - Fullstack Collaborative Application

Une application de gestion de tâches collaborative performante, responsive et en temps réel.

## 🚀 Fonctionnalités
- **Authentification complète** (Sanctum).
- **CRUD Tâches** : Création, Edition, Suppression, Assignation.
- **Tableau de Bord** : Vue Liste (responsive) et Vue Kanban.
- **Temps Réel** : Mises à jour instantanées via Laravel Reverb (WebSockets).
- **Système de Commentaires** : Collaboration directe sur chaque tâche.
- **Design Premium** : Interface mobile-first avec Tailwind CSS et DaisyUI.

---

## 🛠️ Installation

### 1. Backend (Laravel API)
```bash
cd back
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
```

**Démarrer les services backend :**
```bash
# Terminal 1 : Serveur API
compose run dev

# Terminal 2 : Serveur de Socket (Temps Réel)
php artisan reverb:start

```

### 2. Frontend (React)
```bash
cd front
npm install
npm run dev
```
Définir les variables d'environnement dans le fichier .env en respectant le format du fichier .env.example

L'application sera accessible sur `http://localhost:3000`.

---

## 🧪 Tests

### Backend (PHPUnit)
```bash
cd back
php artisan test
```
*Couverture : Modèles, API Endpoints, Broadcasting, Policies.*

### Frontend (Jest)
```bash
cd front
npm test
```
*Couverture : Composants UI, Hooks custom, Mocks API.*

---

## 📚 Documentation API

Retrouvez la documentation technique complète dans le dossier `docs/` :
- 📄 **[Spécification OpenAPI (Swagger)](./docs/api_spec.yaml)**
- 📮 **[Collection Postman](./docs/postman_collection.json)** (Importez le fichier dans Postman et utilisez la variable `base_url`).

### Résumé des Endpoints

| Méthode | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Inscription d'un nouvel utilisateur | ❌ |
| `POST` | `/login` | Connexion et obtention du token | ❌ |
| `GET` | `/tasks` | Liste des tâches (filtres dispos) | ✅ |
| `POST` | `/tasks` | Créer une nouvelle tâche | ✅ |
| `GET` | `/tasks/{id}` | Détails d'une tâche et commentaires | ✅ |
| `PUT` | `/tasks/{id}` | Modifier une tâche | ✅ |
| `DELETE` | `/tasks/{id}` | Supprimer une tâche | ✅ |
| `POST` | `/tasks/{id}/comments` | Ajouter un commentaire | ✅ |
| `DELETE` | `/tasks/{id}/comments/{cid}` | Supprimer un commentaire | ✅ |

---

## 🔑 Identifiants de Test (Seed)
- **Admin** : `admin@test.com` / `password`
- **User** : `rabe@test.com` / `password`
