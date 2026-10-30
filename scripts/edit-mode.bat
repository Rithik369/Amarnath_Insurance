@echo off
title RML Insurances - Edit mode (live preview)
cd /d "%~dp0.."
set "PATH=%SystemRoot%\System32;%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
if exist "%CD%\.tools\node\node.exe" set "PATH=%CD%\.tools\node;%PATH%"

node -v >nul 2>nul || (echo Run START-WEBSITE.bat once first. & pause & exit /b 1)
if not exist "node_modules\.package-lock.json" (echo Run START-WEBSITE.bat once first. & pause & exit /b 1)

echo Edit files in the "src" folder - the browser refreshes automatically.
echo Close this window when done, then run START-WEBSITE.bat to publish the changes.
call npm start -- --open
pause
