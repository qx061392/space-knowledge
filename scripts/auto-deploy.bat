@echo off
REM ==========================================
REM Space Knowledge - Auto Deploy
REM Upload + Submit Review + Auto Publish
REM
REM Prerequisites:
REM   1. WeChat DevTools installed
REM   2. DevTools CLI enabled (设置 -> 安全设置 -> 服务端口)
REM   3. Fill in APP_ID and APP_SECRET below
REM
REM Usage: double-click or schedule with Task Scheduler
REM ==========================================

REM === Config ===
set APP_ID=你的AppID
set APP_SECRET=你的AppSecret
set PROJECT_DIR=C:\your\project\path
set DEVTOOLS_CLI="C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
REM =============

echo.
echo ===================================
echo   Space Knowledge - Auto Deploy
echo ===================================
echo.

REM Step 1: Sync data from GitHub
echo [1/4] Syncing data from GitHub...
call "%~dp0sync-pull.bat" >nul 2>&1
if errorlevel 1 (
    echo   [SKIP] Sync failed, using local files
) else (
    echo   [OK] Data synced
)

REM Step 2: Upload code to WeChat
echo.
echo [2/4] Uploading code to WeChat...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localDateTime /value') do set "ldt=%%a"
set VERSION=%ldt:~0,8%
echo   Version: %VERSION%
%DEVTOOLS_CLI% upload --project "%PROJECT_DIR%" --v %VERSION% --desc "auto-update %VERSION%" 2>&1
if errorlevel 1 (
    echo   [FAILED] Upload failed
    echo   Make sure DevTools CLI is enabled
    pause
    exit /b 1
)
echo   [OK] Code uploaded

REM Step 3: Submit for review
echo.
echo [3/4] Submitting for review...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0submit-review.ps1" -AppId "%APP_ID%" -AppSecret "%APP_SECRET%"
if errorlevel 1 (
    echo   [FAILED] Submit review failed
    pause
    exit /b 1
)

REM Step 4: Poll and publish (background)
echo.
echo [4/4] Waiting for review approval and auto-publish...
echo   Review typically takes 1-7 hours
echo   This script will check every 10 minutes...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0poll-publish.ps1" -AppId "%APP_ID%" -AppSecret "%APP_SECRET%"

echo.
echo ===================================
echo   Deploy complete!
echo ===================================
pause
