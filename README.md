# Task Manager - Application Collaboration

Système de gestion de tâches collaboratif avec Backend Laravel (API) et Frontend React.

## 🚀 Technologies

- **Backend** : Laravel 11, SQLite, Sanctum (Auth)
- **Frontend** : React 18 (Vite), TypeScript, Tailwind CSS, DaisyUI, Sonner (Toasts)
- **Qualité** : PHPUnit (Backend), Jest + React Testing Library (Frontend), ESLint

---

## 🛠️ Installation

### 1. Backend (Laravel)
```bash
cd back
composer install
cp .env.example .env
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```
*L'API sera disponible sur `http://localhost:8000`*

### 2. Frontend (React)
```bash
cd front
npm install
npm run dev
```
*Le frontend sera disponible sur `http://localhost:5173`*

---

## 🧪 Tests

### Backend
```bash
cd back
php artisan test
```

### Frontend
```bash
cd front
npm test
```

---

## 📖 API Documentation

### Authentification
- `POST /api/register` : Création de compte
- `POST /api/login` : Connexion
- `POST /api/logout` : Déconnexion (nécessite Token)

### Tâches
- `GET /api/tasks` : Liste paginée (Filtres: `status`, `priority`, `assigned_to`, `search`)
- `POST /api/tasks` : Créer une tâche
- `GET /api/tasks/{id}` : Détails d'une tâche
- `PUT /api/tasks/{id}` : Modifier (Admin, Créateur ou Assigné)
- `DELETE /api/tasks/{id}` : Supprimer (Admin, Créateur ou Assigné)

---

## 🔑 Identifiants de test (Seeder)
- **Admin** : `admin@test.com` / `password`
- **Utilisateur (Ny Aina)** : `nyaina@test.com` / `password`

---

## ✨ Fonctionnalités implémentées
- [x] Authentification complète avec Sanctum.
- [x] CRUD complet des tâches avec validation (Zod au front, FormRequest au back).
- [x] Gestion des rôles (Admin/User).
- [x] Permissions fines (Assigné peut modifier sa tâche).
- [x] Recherche avec Debounce et filtrage avancé.
- [x] UI Premium (DaisyUI, Mode sombre supporté, Animations de chargement).
- [x] Lazy loading des routes.
- [x] Modal de confirmation pour les actions destructives.
- [x] Tests unitaires et fonctionnels (Back & Front).
