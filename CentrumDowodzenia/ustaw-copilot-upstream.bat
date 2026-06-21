@echo off
cd /d "%~dp0"

echo.
echo ========================================
echo  KONFIGURACJA UPSTREAM COPILOT AGENT
echo ========================================
echo.
echo Podaj pelny URL endpointu API agenta,
echo np: http://127.0.0.1:5000/api/copilot-agent/analyze
echo.

set /p URL=URL: 

if "%URL%"=="" (
  echo.
  echo [BLAD] URL nie moze byc pusty.
  goto :end
)

echo %URL%>copilot-upstream.url

echo.
echo [OK] Zapisano konfiguracje do pliku: copilot-upstream.url
echo [OK] Przy nastepnym starcie dashboardu upstream bedzie aktywny.
echo.

:end
pause
