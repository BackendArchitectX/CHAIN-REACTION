$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw '[CHAIN//REACTION] Node.js 22 LTS is required.'
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw '[CHAIN//REACTION] npm is required.'
}

npm start
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
