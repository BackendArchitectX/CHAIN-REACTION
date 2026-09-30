$ErrorActionPreference = "Stop"
Write-Host "[CHAIN//REACTION] Installing/verifying dependencies..." -ForegroundColor Cyan
npm install
Write-Host "[CHAIN//REACTION] Starting CITY//01..." -ForegroundColor Green
npm run dev
