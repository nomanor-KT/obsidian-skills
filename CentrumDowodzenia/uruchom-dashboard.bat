@echo off
title Centrum Dowodzenia — OSINT Dashboard
echo.
echo  ========================================
echo   CENTRUM DOWODZENIA — OSINT Dashboard
echo  ========================================
echo.
echo  Uruchamiam lokalny serwer...
echo  Dashboard otworzy sie w przegladarce.
echo  Nie zamykaj tego okna podczas pracy.
echo.
echo  Aby zakonczyc: nacisnij Ctrl+C lub zamknij okno.
echo  ========================================
echo.

cd /d "%~dp0"

REM Wczytaj URL upstream agenta (jesli skonfigurowany)
set "COPILOT_AGENT_URL="
if exist "copilot-upstream.url" (
    set /p COPILOT_AGENT_URL=<"copilot-upstream.url"
)

if /I "%COPILOT_AGENT_URL%"=="http://127.0.0.1:8080/api/copilot-agent/analyze" (
    echo [UWAGA] Upstream wskazuje na lokalny endpoint dashboardu i zostanie pominiety.
    set "COPILOT_AGENT_URL="
)

if /I "%COPILOT_AGENT_URL%"=="http://localhost:8080/api/copilot-agent/analyze" (
    echo [UWAGA] Upstream wskazuje na lokalny endpoint dashboardu i zostanie pominiety.
    set "COPILOT_AGENT_URL="
)

if not "%COPILOT_AGENT_URL%"=="" (
    echo [INFO] Aktywny upstream Copilot Agent: %COPILOT_AGENT_URL%
) else (
    echo [INFO] Brak upstream Copilot Agent - bedzie uzyty fallback lokalny.
)

REM Próbuj Python 3
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Znaleziono Python. Uruchamiam serwer aplikacji na porcie 8080...
    start "" "http://localhost:8080/centrum-dowodzenia.html"
    if not "%COPILOT_AGENT_URL%"=="" set "COPILOT_AGENT_URL=%COPILOT_AGENT_URL%"
    python copilot_agent_server.py
    goto :end
)

REM Próbuj Python jako py
where py >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Znaleziono Python (py). Uruchamiam serwer aplikacji na porcie 8080...
    start "" "http://localhost:8080/centrum-dowodzenia.html"
    if not "%COPILOT_AGENT_URL%"=="" set "COPILOT_AGENT_URL=%COPILOT_AGENT_URL%"
    py copilot_agent_server.py
    goto :end
)

REM Próbuj npx (Node.js)
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Znaleziono Node.js. Uruchamiam serwer na porcie 8080...
    start "" "http://localhost:8080/centrum-dowodzenia.html"
    npx -y http-server -p 8080 -c-1
    goto :end
)

REM Brak serwera — otwórz bezpośrednio (ograniczona funkcjonalność)
echo [UWAGA] Nie znaleziono Python ani Node.js.
echo.
echo Otwieram plik bezposrednio w przegladarce.
echo Dla pelnej funkcjonalnosci zainstaluj Python:
echo   https://www.python.org/downloads/
echo.
start "" "%~dp0centrum-dowodzenia.html"

:end
