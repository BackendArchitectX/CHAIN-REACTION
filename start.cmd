@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul || (
  echo [CHAIN//REACTION] STARTUP FAILED: Node.js 22 LTS is required.
  echo [CHAIN//REACTION] NEXT STEP: Install Node.js 22 LTS, reopen this launcher, and retry.
  if not defined CI pause
  exit /b 1
)

where npm >nul 2>nul || (
  echo [CHAIN//REACTION] STARTUP FAILED: npm 10.x is required.
  echo [CHAIN//REACTION] NEXT STEP: Install the supported Node.js 22 LTS environment and retry.
  if not defined CI pause
  exit /b 1
)

call npm start
set "exitCode=%errorlevel%"

if not "%exitCode%"=="0" (
  echo.
  echo [CHAIN//REACTION] Startup exited with code %exitCode%.
  echo [CHAIN//REACTION] Review the error above. You can also run: npm run doctor
  if not defined CI pause
)

exit /b %exitCode%
