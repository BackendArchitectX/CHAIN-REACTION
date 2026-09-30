$ErrorActionPreference = "Stop"
Write-Host "[CHAIN//REACTION] Installing dependencies..."
npm install
Write-Host "[CHAIN//REACTION] Starting premium MVP..."
npm run dev
