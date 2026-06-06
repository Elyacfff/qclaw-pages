@echo off
REM QaraKino - Quick Start Script (Windows)
REM Usage: start.bat [port]

set PORT=%1
if "%PORT%"=="" set PORT=3000

echo ========================================
echo   QaraKino Starting...
echo   Port: %PORT%
echo ========================================

REM Install dependencies if needed
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

REM Start server
set PORT=%PORT%
node server.js
