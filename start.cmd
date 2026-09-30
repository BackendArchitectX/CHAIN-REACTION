@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo [CHAIN//REACTION] Node.js 22 LTS is required.
  exit /b 1
)
where npm >nul 2>nul || (
  echo [CHAIN//REACTION] npm is required.
  exit /b 1
)
call npm start
exit /b %errorlevel%
