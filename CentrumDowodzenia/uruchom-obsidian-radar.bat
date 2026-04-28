@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0obsidian-radar.ps1" %*
endlocal
