@echo off
setlocal
cd /d "%~dp0"
title Portfolio Launcher

if not exist "package.json" goto no_package
where node >nul 2>nul
if errorlevel 1 goto no_node
where npm.cmd >nul 2>nul
if errorlevel 1 goto no_node

if exist "node_modules" goto start_server
echo Installing dependencies for the first run...
call npm.cmd ci
if errorlevel 1 goto failed

:start_server
echo Starting the portfolio on http://127.0.0.1:5175/ ...
start "Portfolio Server" cmd /k "cd /d ""%~dp0"" && npm.cmd run dev -- --host 127.0.0.1 --port 5175 --strictPort"
timeout /t 5 /nobreak >nul
start "" "http://127.0.0.1:5175/"

echo Keep the Portfolio Server window open while viewing the site.
pause
exit /b 0

:no_package
echo ERROR: Put this BAT beside package.json.
pause
exit /b 1

:no_node
echo ERROR: Install Node.js 22 LTS first.
pause
exit /b 1

:failed
echo ERROR: Dependency installation failed.
pause
exit /b 1
