$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw '[CHAIN//REACTION] STARTUP FAILED: Node.js 22 LTS is required. Install Node.js 22 LTS, reopen PowerShell, and retry.'
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw '[CHAIN//REACTION] STARTUP FAILED: npm 10.x is required. Install the supported Node.js 22 LTS environment and retry.'
}

npm start
if ($LASTEXITCODE -ne 0) {
    Write-Error "[CHAIN//REACTION] Startup exited with code $LASTEXITCODE. Review the error above or run 'npm run doctor' for detailed repository diagnostics."
    exit $LASTEXITCODE
}
