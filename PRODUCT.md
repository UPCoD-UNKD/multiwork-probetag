# Multivork Product Overview

Multivork is a comprehensive platform designed to help users manage and showcase their professional work and projects. The ecosystem consists of a robust backend service, a modern web frontend, and a mobile application initiative.

## Repository Structure

The product consists of three main repositories:

### 1. Backend Service ([`multiwork-backend`](https://github.com/UPCoD-UNKD/multiwork-backend))
The core API service handling business logic, data persistence, and authentication.

*   **Technology Stack**: Java 17, Spring Boot 3.0, Maven.
*   **Database**: PostgreSQL.
*   **Authentication**: Spring Security with OAuth2 and JWT (JSON Web Tokens).
*   **Documentation**: Swagger UI / OpenAPI integration.
*   **Key Features**:
    *   **User Management**: handling user profiles, skills, and social media links.
    *   **Project Portfolio**: APIs for creating, updating, and retrieving user projects.
    *   **Social Interaction**: Commenting system for projects.
    *   **DTOs & Mappers**: Structured data transfer objects for API responses.

### 2. Frontend Application ([`multiwork-frontend`](https://github.com/UPCoD-UNKD/multiwork-frontend))
A responsive web application for users to interact with the Multivork platform.

*   **Technology Stack**: React 18, Create React App.
*   **Styling**: SCSS (`node-sass`), Custom Design.
*   **Key Libraries**:
    *   `react-router-dom` (v6) for navigation.
    *   `react-hook-form` for form handling.
    *   `react-icons` for UI iconography.
*   **Structure**: Organized into `screens`, `components`, and `styles`.

### 3. Android Application ([`multiwork-app-android`](https://github.com/UPCoD-UNKD/multiwork-app-android))
A mobile client intiative for the Multivork platform.

*   **Status**: Initial setup / Template phase.
*   **Purpose**: To provide a native mobile experience for users.

## Core Data Model
The platform revolves around the following key entities:
*   **User**: The central actor in the system.
*   **Project**: Represents a piece of work or portfolio item created by a user.
*   **Skill**: Professional skills associated with a user.
*   **Comment**: Social interactions on projects.
*   **SocialMedia & Links**: External references for user profiles.
