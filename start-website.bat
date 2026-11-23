@echo off
title Chroma-Ator Website Server
cd /d "%~dp0"
echo ===================================================
echo   Starting Chroma-Ator Corporate Website
echo   http://localhost:5000
echo ===================================================
timeout /t 2 /nobreak >nul
start "" "http://localhost:5000"
"C:\Users\welcome\node\node-v20.18.0-win-x64\node.exe" server.js
pause
