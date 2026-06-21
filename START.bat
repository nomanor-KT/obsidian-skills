@echo off
title SeaTrack v3 - Uruchamianie...
echo.
echo  ==============================
echo   SeaTrack v3 - Start
echo  ==============================
echo.

:: Sprawdz czy Node.js jest zainstalowany
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] Node.js nie jest zainstalowany!
    echo Pobierz ze strony: https://nodejs.org (wersja LTS)
    pause
    exit /b 1
)

echo [1/3] Instalowanie zaleznosci (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [BLAD] npm install nie powiodl sie.
    pause
    exit /b 1
)

echo.
echo [2/3] Uruchamianie serwera API (port 8787)...
start "SeaTrack API" cmd /k "node server/index.js"

timeout /t 2 /nobreak >nul

echo [3/3] Uruchamianie frontendu (port 5173)...
start "SeaTrack Frontend" cmd /k "npx vite"

timeout /t 3 /nobreak >nul

echo.
echo  ==============================
echo   Aplikacja gotowa!
echo   Otworz: http://localhost:5173
echo  ==============================
echo.
start http://localhost:5173

pause
