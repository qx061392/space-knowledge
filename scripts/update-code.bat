@echo off
set LOCAL_DIR=D:\your\project\path
set BASE_URL=https://raw.githubusercontent.com/qx061392/space-knowledge/main

echo ===================================
echo   Space Knowledge - Code Update
echo   (Cloud Integration)
echo ===================================
echo.

for %%F in (app.js app.json project.config.json ^
pages/index/index.js pages/index/index.wxml pages/index/index.wxss ^
pages/category/category.js ^
pages/category-list/category-list.js ^
pages/detail/detail.js ^
pages/search/search.js ^
pages/quiz/quiz.js ^
pages/migrate/migrate.js pages/migrate/migrate.json pages/migrate/migrate.wxml pages/migrate/migrate.wxss) do (
    echo Downloading %%F ...
    powershell -NoProfile -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/%%F' -OutFile '%LOCAL_DIR%\%%F' -UseBasicParsing -ErrorAction Stop; Write-Host '   [OK]' } catch { Write-Host '   [SKIP]' }"
)

echo.
echo ===================================
echo   Update Complete!
echo   Press Ctrl+B in DevTools to compile
echo ===================================
pause
