@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 20 or newer is required to run QuantumBridge.
  echo Install Node.js, then open this file again.
  pause
  exit /b 1
)
start "QuantumBridge Server" /min cmd /c "cd /d ""%~dp0"" && node api-server.mjs --serve-dist"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5173/"
echo QuantumBridge is running at http://localhost:5173/
echo Leave the minimized server window open while using the app.
