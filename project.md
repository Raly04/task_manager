# **TEST**

Ce test simule un projet fullstack : un système de gestion de tâches (Task Manager) avec backend Laravel API et frontend React.

## **Contexte du Projet**

Développez une application de gestion de tâches collaborative.

- **Backend :** API RESTful Laravel (headless) avec authentification, CRUD tâches, assignation utilisateurs.
    
- **Frontend :** App React SPA consommant l'API, avec liste/filtres/recherche, formulaire création/édition, dashboard.
    
- Utilisez Laravel 11+ et React 18+. Fournissez un repo Git propre avec README (installation, tests, API docs via Swagger ou Postman)
        

## **Planning des 8 Heures**

|**Heure**|**Tâche Principale**|**Objectifs Évalués**|
|---|---|---|
|1|Setup + Modèle/DB|Bases Laravel, Eloquent, migrations|
|2|API CRUD + Auth|Contrôleurs, routes, sécurité (Sanctum/JWT)|
|3|Tests Backend|PHPUnit, bonnes pratiques tests laravel+1|
|4|Setup React + Liste Tâches|Hooks (useState/useEffect), fetch API|
|5|CRUD Frontend + Formulaires|Custom hooks, validation (React Hook Form/Zod), optimisations (useMemo)|
|6|Fonctionnalités Avancées|Filtres/recherche (debounce), assignation tâches, rôles|
|7|Tests Frontend + Polish|Jest/RTL, responsive (Tailwind), perf (React.memo)|
|8|Refactoring + Docs|Clean code, DRY, Git commits atomiques, README bloginnovazione+1|

---

## **Spécifications Détaillées**

### **Backend Laravel (Heures 1-3)**

- **Setup :** `composer create-project laravel/laravel task-api`. ==BD SQLite== (facile à tester).
    
- **Modèles/Relations :**
    
    - User (id, name, email, role: admin/user).
        
    - Task (id, title, description, status: todo/in-progress/done, priority: low/medium/high, assigned_to: User id, created_by: User id, due_date).
        
    - Relations : belongsTo User (assigned/creator), hasMany Comments (bonus).
        
- **Migrations/Seeders :** 5 users, 20 tâches variées.
    
- **API Routes (API prefix, Sanctum auth) :**
    
    - GET `/tasks` (index, ?status=done&search=title&assigned_to=1) – pagination 10.
        
    - POST `/tasks` (create, validation: title req, due_date future).
        
    - GET/PUT/DELETE `/tasks/{id}`.
        
    - POST `/login/register/logout`.
        
- **Bonnes Pratiques :** Resources pour JSON, Policies pour auth (admin édite tout), Request validation, Eloquent scopes.
    
- **Tests :** 80% coverage – unit (modèles), feature (API endpoints, auth fail).
    

---

### **Frontend React (Heures 4-6)**

- **Setup :** `npx create-react-app task-frontend --template typescript` ou Vite. Axios/Fetch, Tailwind CSS.
    
- **Composants :**
    
    - **Dashboard :** Liste tâches (table), filtres (status/priority), recherche debounce.
        
    - **TaskForm :** Create/Edit, validation client (Zod ou Yup), assign user dropdown.
        
    - **Auth :** Login/Register, protected routes (Context ou Redux Toolkit query).
        
- **Gestion État :** Context API + custom hooks (useTasks, useAuth). useEffect fetch, useCallback handlers.
    
- **Avancé :** Drag-drop status (react-beautiful-dnd bonus), realtime (Pusher bonus), error handling/toasts.
    
- **Responsive :** Mobile-first.
    

---

### **Intégration et Polish (Heures 7-8)**

- **Connexion :** CORS Laravel → React (localhost:8000/:3000). Tokens localStorage.
    
- **Tests :** Jest pour composants (render, user events), mocks API.
    
- **Perf/Sécurité :** Lazy loading routes, sanitization inputs, no console.logs.
    
- **Code Quality :** ESLint/Prettier, commits clairs (« feat: add task CRUD »).
    

---

## **Critères d'Évaluation (Non fournis au candidat)**

- **Bases (30%) :** Syntaxe, erreurs évitées, DB/relations justes.
    
- **Codage (40%) :** Clean code, DRY, noms variables, erreurs gérées.
    
- **Bonnes Pratiques (30%) :** Tests, auth sécurisée, hooks optimisés, docs.moldstud+1
    

**Livraison :** Zip repo Git + Loom 10min démo (runs/tests). Note >80% = embauchable.