# MultiWork Project

This project consists of a Java (Spring Boot) backend, a React frontend, and Nginx for routing.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for manual execution)
- Node.js & npm (for manual execution)

### 🐳 Running with Docker (Recommended)
1. Ensure Docker is running.
2. Run the specialized script for local startup:
   ```bash
   ./start-local.ps1  # For PowerShell
   # OR
   ./start-local.bat  # For Windows Batch
   ```
3. The application will be available at `http://localhost:3000`.

### 🛠 Manual Execution
#### Backend
```bash
cd multiwork-backend
./mvnw spring-boot:run
```
#### Frontend
```bash
cd multiwork-frontend
npm install
npm start
```

## 🏗 Production Deployment

### ☁️ Azure / Cloud VM Setup
To prepare a fresh Ubuntu VM for deployment:
1. Run `setup_vm.sh`:
   ```bash
   chmod +x setup_vm.sh
   ./setup_vm.sh
   ```
2. Use `docker-compose.prod.yml` for the production stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

### 🔄 Updates
To pull the latest changes and restart the production containers:
```bash
./update.sh
```

## 📂 Project Structure
- `multiwork-backend/`: Spring Boot application.
- `multiwork-frontend/`: React application.
- `nginx/`: Nginx configurations for local and production.
- `.env.production.example`: Template for production environment variables.

## 📝 Utility Scripts
- `check_db.sh`: Check database connectivity.
- `debug_permissions.sh`: Fix permission issues in the container.
- `fast-deploy.ps1`: Quick deployment script for local testing.
