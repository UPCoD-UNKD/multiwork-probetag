# MultiWork Fast Deploy Script
# Usage: .\fast-deploy.ps1 "Your commit message"

param (
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

# 1. Commit and Push
Write-Host ">>> Committing and Pushing to deploy-prod branch..." -ForegroundColor Cyan
git add .
git commit -m $CommitMessage
git push origin deploy-prod

# 2. Server Update (Optional / Manual reminder)
Write-Host "`n>>> Code pushed! Now run this on your Azure VM:" -ForegroundColor Green
Write-Host "cd ~/MWProject && ./update.sh" -ForegroundColor Yellow

# Tip: If you have SSH keys set up, you can automate this:
# ssh <user>@<vm-ip> "cd ~/MWProject && ./update.sh"
