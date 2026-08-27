@echo off
REM ==========================================
REM Space Knowledge - Data Sync Script
REM
REM Download latest data files from GitHub
REM to your local WeChat mini program project.
REM
REM First time: edit LOCAL_DIR below
REM ==========================================

REM === Config: change this to your project path ===
set LOCAL_DIR=D:\your\project\path
REM =============================================

set GITHUB_OWNER=qx061392
set GITHUB_REPO=space-knowledge
set BASE_URL=https://raw.githubusercontent.com/%GITHUB_OWNER%/%GITHUB_REPO%/main

echo.
echo ===================================
echo   Space Knowledge - Data Sync
echo ===================================
echo.

if not exist "%LOCAL_DIR%\data" (
    echo [ERROR] Path not found: %LOCAL_DIR%\data
    echo Please edit LOCAL_DIR in this file.
    echo.
    pause
    exit /b 1
)

for %%F in (data/knowledge.js data/quiz.js) do (
    echo Downloading %%F ...
    powershell -NoProfile -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/%%F' -OutFile '%LOCAL_DIR%\%%F' -UseBasicParsing; Write-Host '   [OK]' } catch { Write-Host '   [FAILED]' }"
)

echo.
echo ===================================
echo   Sync complete!
echo   WeChat DevTools will auto-compile.
echo ===================================
echo.
pause
