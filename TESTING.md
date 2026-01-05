# Local Testing & Development Workflow

To safely test changes before pushing to production, follow this workflow.

## 1. Local Development Stack
Use the root `docker-compose.yml` for local testing. This uses an H2 database (file-based) so it doesn't touch your production Azure DB.

### Command to start:
```powershell
docker compose up --build
```
- **Backend**: http://localhost:8080 (Proxied)
- **Frontend**: http://localhost:3000 (Development mode) or http://localhost:80 (via Nginx)
- **Nginx**: http://localhost:80

## 2. Testing Your Changes
1. **Developer Proxy**: During `npm start`, the frontend uses `src/setupProxy.js`. It redirects `/api` to `localhost:8080`.
2. **Nginx Proxy**: If you want to test the *exact* production entry point, access `http://localhost`.

## 3. Safe Push Workflow
Once you are happy with the changes locally:
1. Run `.\fast-deploy.ps1 "Commit message"` to push to the `prod` branch.
2. Go to the Azure VM.
3. Run `./update.sh`.

## 4. Debugging Production
If something breaks in production:
1. Check the backend logs: `docker compose -f docker-compose.prod.yml logs -f backend`
2. Check the browser console (F12) for network errors.
