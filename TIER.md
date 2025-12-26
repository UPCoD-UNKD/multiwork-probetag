# Functional Tier Status

This document tracks the implementation status of functional features across the Multivork ecosystem.

## 🟢 Backend API (`multiwork-backend`)
The backend is the most mature component, with core logic implemented.

| Feature Area | Functionality | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Auth** | User Registration | ✅ Done | `POST /api/auth/register` |
| **Auth** | User Login | ✅ Done | `POST /api/auth/login` (Returns JWT) |
| **Projects** | Create Project | ✅ Done | `POST /api/project/` |
| **Projects** | Update Project | ✅ Done | `PUT /api/project/{id}` |
| **Projects** | View Projects | ✅ Done | `GET /api/project/find/{skillId}` |
| **Comments** | Create Comment | ✅ Done | `POST /api/comment/` |
| **Comments** | Get Comment | ✅ Done | `GET /api/comment/{id}` |
| **Comments** | Add Project Comment | ✅ Done | `PATCH /api/project/{id}/comment` |
| **Projects** | Team Members | ✅ Done | `PATCH /api/project/member/{id}` |
| **Projects** | Recommendations | 🔴 TODO | `GET /api/project/find` (Returns "TODO") |
| **Users** | View Profile | ✅ Done | `GET /api/user/{id}` |
| **Users** | Update Profile | ✅ Done | `PUT /api/user` |
| **Users** | Current User | ✅ Done | `GET /api/user/user` |

**Data Model Completeness**:
*   ✅ `User`, `Project`, `Skill`, `Comment`
*   ✅ `SocialMedia` (User social links)
*   ✅ `Link` (Profile links)
*   ✅ `Icon` (Skill icons with image support)

---

## 🟡 Frontend Web App (`multiwork-frontend`)
The frontend has UI scaffolds, structured styles, and mock data.

| Screen / Feature | UI Implementation | Backend Integration | Notes |
| :--- | :--- | :--- | :--- |
| **Login** | ✅ Done | 🔴 TODO | `FormLogin` component ready |
| **Register** | 🔴 TODO | 🔴 TODO | Screen exists, form logic unchecked |
| **Home Feed** | ✅ Done | 🔴 TODO | Uses mock data (`data/projects.js`) |
| **Projects List** | ✅ Done | 🔴 TODO | Uses mock data (`data/projects.js`) |
| **Project Details** | 🟡 Partial | 🔴 TODO | Empty shell component (`Project.js`) |
| **Create Project** | ✅ Done | 🔴 TODO | Screen `CreateProject.js` & Form `NewProject.js` exist |
| **Profile** | 🟡 Partial | 🔴 TODO | Empty shell component (`Profile.js`) |
| **Teams** | 🟡 Partial | 🔴 TODO | UI exists but static |
| **Navigation** | ✅ Done | N/A | `Appbar`, `Tabbar` components implemented |

**Architecture Notes**:
*   ✅ Structured styles (`src/styles`)
*   ✅ Organized assets (`assets/png`, `assets/svg`)

---

## 🔴 Android App (`multiwork-app-android`)
The mobile application is in the initial setup phase.

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Project Setup** | ✅ Done | Basic Gradle structure exists |
| **Screens** | 🔴 TODO | No native screens implemented |
| **Logic** | 🔴 TODO | No business logic implemented |

## 📋 Next Priority Tasks (Functional)

1.  **Frontend Integration (Home/Projects)**: Connect `Home` and `Projects` screens to `GET /api/project/*` endpoints.
2.  **Frontend Integration (Create Project)**: Wire up `NewProject.js` form to `POST /api/project/`.
3.  **Frontend Auth**: Wire up `FormLogin` to `POST /api/auth/login`.
4.  **Complete Frontend Screens**: Flesh out `Profile.js` and `Project.js` (Details view).
5.  **Backend Recommendation**: Implement logic for `GET /api/project/find`.
