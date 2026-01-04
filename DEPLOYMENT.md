# Deployment Guide (Production)

This guide describes how to deploy the MultiWork application to a production Linux VM (e.g., Ubuntu) using Git and Docker Compose.

## Prerequisites

- **Linux VM**: Ubuntu 20.04/22.04 LTS recommended.
- **Root/Sudo Access**: You need permission to install software.
- **Git Repository**: The project code must be pushed to a Git repository (GitHub/GitLab/etc.).

## 1. Initial Server Setup

Connect to your VM via SSH:
```bash
ssh user@your-server-ip
```

We have provided a script to automate the installation of Docker and Git.

1.  **Copy the `setup_vm.sh` script** to your server (or create it manually).
2.  **Run the script**:
    ```bash
    chmod +x setup_vm.sh
    ./setup_vm.sh
    ```
    *This will install Docker, Docker Compose, and Git.*

## 2. Clone the Repository

Clone your repository into the `/opt/multiwork` directory (or any directory you prefer).

```bash
cd /opt
sudo git clone https://github.com/YOUR_USER/YOUR_REPO.git multiwork
cd multiwork
```

*Note: If your repo is private, you may need to set up an SSH key or use a Personal Access Token.*

## 3. Configuration

You must create the `.env.production` file on the server. **NEVER commit production secrets to Git.**

1.  Copy the example file:
    ```bash
    cp .env.production.example .env.production
    ```
2.  Edit the file with your real production values:
    ```bash
    nano .env.production
    ```
    *Change `APP_JWT_SECRET`, database credentials, etc.*

## 4. First Start

Use the production compose file to start the application:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
*(If the command `docker compose` fails with an error like `unknown shorthand flag`, try using `docker-compose` (with a dash) instead: `docker-compose -f docker-compose.prod.yml ...`)*

Check the logs to ensure everything started correctly:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

## 5. Updates (Continuous Deployment)

To update the application after pushing changes to the `production` branch in Git, use the included `update.sh` script.

1.  **Make sure the script is executable**:
    ```bash
    chmod +x update.sh
    ```
2.  **Run the update**:
    ```bash
    ./update.sh
    ```

This script will:
1.  Pull the latest changes from Git.
2.  Rebuild the Docker images.
3.  Restart the containers with zero/minimal downtime (depending on configuration).
4.  Clean up old unused images.
