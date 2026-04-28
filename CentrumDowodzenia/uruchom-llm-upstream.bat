@echo off
cd /d "%~dp0"

echo.
echo ========================================
echo  LLM UPSTREAM (OPENAI-COMPATIBLE)
echo ========================================
echo.

if exist "llm-upstream.env" (
  for /f "usebackq tokens=1,* delims==" %%A in ("llm-upstream.env") do (
    if /I not "%%A"=="" if /I not "%%A:~0,1"=="#" set "%%A=%%B"
  )
)

if "%LLM_API_KEY%"=="" (
  echo [BLAD] Brak LLM_API_KEY.
  echo Utworz plik llm-upstream.env na podstawie llm-upstream.env.example
  echo albo ustaw zmienna srodowiskowa LLM_API_KEY.
  goto :end
)

if "%LLM_API_BASE%"=="" set "LLM_API_BASE=https://api.openai.com/v1"
if "%LLM_MODEL%"=="" set "LLM_MODEL=gpt-4.1-mini"

echo [OK] Start upstream na porcie 5000
python llm_upstream_server.py

:end
pause
