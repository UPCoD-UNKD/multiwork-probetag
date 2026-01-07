# MultiWork Fast Deploy Script
# Usage: .\fast-deploy.ps1 "Your commit message"

param (
    [Parameter(Mandatory = $true)]
    [string]$CommitMessage
)

# 1. Commit on prod
Write-Host ">>> Committing changes on prod..." -ForegroundColor Cyan
git add .
git commit -m $CommitMessage
git push origin prod

# 2. Sync to deploy-prod and Push
Write-Host "`n>>> Syncing to deploy-prod and Pushing..." -ForegroundColor Cyan
git checkout deploy-prod
git merge prod -m "Merge prod into deploy-prod for deployment"
git push origin deploy-prod

# 3. Back to prod
git checkout prod

# 2. Server Update (Optional / Manual reminder)
Write-Host "`n>>> Code pushed! Now run this on your Azure VM:" -ForegroundColor Green
Write-Host "cd ~/MWProject && ./update.sh" -ForegroundColor Yellow

# Tip: If you have SSH keys set up, you can automate this:
# ssh <user>@<vm-ip> "cd ~/MWProject && ./update.sh"
