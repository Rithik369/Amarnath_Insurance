@echo off
setlocal EnableDelayedExpansion
title RML Insurances - Website
cd /d "%~dp0"

echo.
echo   ==================================================
echo      RML Insurances website
echo      First run downloads what it needs (5-10 min).
echo      Later runs start in a few seconds.
echo   ==================================================
echo.

set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
if exist "%~dp0.tools\node\node.exe" set "PATH=%~dp0.tools\node;%PATH%"

rem ---- 1. Node.js (Angular needs 22.22.3+, 24.15+ or 26+) ----
call :check_node
if "%NODE_OK%"=="1" goto :node_ready
echo [1/4] Node.js not found - downloading a private copy for this folder...
set "PSModulePath="
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\get-node.ps1"
if errorlevel 1 goto :fail_node
set "PATH=%~dp0.tools\node;%PATH%"
call :check_node
if not "%NODE_OK%"=="1" goto :fail_node
:node_ready
for /f %%v in ('node -v') do echo [1/4] Node.js %%v ready.

rem ---- 2. Packages (only when missing or package-lock.json changed) ----
if not exist "node_modules\.package-lock.json" goto :install
node -e "const f=require('fs');process.exit(f.statSync('package-lock.json').mtimeMs>f.statSync('node_modules/.package-lock.json').mtimeMs?1:0)"
if errorlevel 1 goto :install
echo [2/4] Packages already installed.
goto :build
:install
echo [2/4] Installing website packages - please wait...
call npm ci --no-audit --no-fund --no-update-notifier --loglevel=error
if errorlevel 1 goto :fail_install

rem ---- 3. Build (every time, so any edits are included) ----
:build
echo [3/4] Building the website...
call npm run build --silent --no-update-notifier
if errorlevel 1 goto :fail_build

rem ---- 4. Start ----
echo [4/4] Starting...
node server.cjs --open
echo.
echo The website has stopped.
pause
exit /b 0

:check_node
set "NODE_OK=0"
node -e "const [a,b,c]=process.versions.node.split('.').map(Number);process.exit((a===22&&(b>22||(b===22&&c>=3)))||(a===24&&b>=15)||a>=26?0:1)" >nul 2>nul
if not errorlevel 1 set "NODE_OK=1"
exit /b 0

:fail_node
echo.
echo   ERROR: Could not set up Node.js.
echo   - Check the internet connection and run START-WEBSITE.bat again, or
echo   - Install "Node.js LTS" from https://nodejs.org and run this file again.
pause
exit /b 1

:fail_install
echo.
echo   ERROR: Package installation failed. Check the internet connection and try again.
pause
exit /b 1

:fail_build
echo.
echo   ERROR: The website could not be built. If you edited files in "src", undo the last change.
pause
exit /b 1
