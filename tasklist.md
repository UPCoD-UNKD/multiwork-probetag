# Unfinished Tasks (TBD)

This list enumerates all pending tasks required to bring the Multivork functionalities to completion.

## 🟢 Backend Service (`multiwork-backend`)

1.  [ ] **Implement Recommendation Logic** (TBD)
    *   **Context**: `ProjectController.java` contains a stub for `GET /api/project/find`.
    *   **Task**: Implement the logic to recommend projects based on similarity or user skills.

## 🟡 Frontend Application (`multiwork-frontend`)

### Authentication
2.  [ ] **Integrate Login API** (TBD)
    *   **Context**: `src/components/forms/FormLogin.js`
    *   **Task**: wire `onSubmit` to call `POST /api/auth/login`, handle the JWT response, and store it in local storage/context.

3.  [ ] **Implement Registration Logic** (TBD)
    *   **Context**: `src/screens/Signup.js`
    *   **Task**: Create/Verify the signup form and connect it to `POST /api/auth/register`.

### Core Features
4.  [ ] **Connect Home Feed to API** (TBD)
    *   **Context**: `src/screens/Home.js`
    *   **Task**: Replace `data/projects.js` import with a `useEffect` hook to fetch data from `GET /api/project/find/{skillId}`.

5.  [ ] **Connect Projects List to API** (TBD)
    *   **Context**: `src/screens/Projects.js`
    *   **Task**: Replace mock data with real API calls to list all projects.

6.  [ ] **Connect Create Project Form to API** (TBD)
    *   **Context**: `src/components/forms/NewProject.js` (used in `CreateProject.js`)
    *   **Task**: Connect the existing form to `POST /api/project/` to create real projects.

7.  [ ] **Implement Project Details View** (TBD)
    *   **Context**: `src/screens/Project.js`
    *   **Task**: Currently an empty shell. Needs to fetch project details (`GET /api/project/{id}`) and display title, description, skills, and comments (`GET/POST /api/comment/*`).

8.  [ ] **Implement Profile View** (TBD)
    *   **Context**: `src/screens/Profile.js`
    *   **Task**: Currently an empty shell. Needs to fetch and display user profile data, including `SocialMedia` links and `Skills`.

9.  [ ] **Implement Team View** (TBD)
    *   **Context**: `src/screens/Teams.js`
    *   **Task**: Make the UI dynamic to show actual team members.

## 🔴 Multiwork Android App (`multiwork-app-android`)

10. [ ] **Implement Native Screens** (TBD)
    *   **Task**: Create Android layouts (XML/Compose) for Login, Home, and Project Details.

11. [ ] **Implement Business Logic** (TBD)
    *   **Task**: Integrate Retrofit or similar library to consume the Backend APIs.
