@echo off
set LOCAL_DIR=D:\your\project\path
set GITHUB_OWNER=qx061392
set GITHUB_REPO=space-knowledge
set BASE_URL=https://raw.githubusercontent.com/%GITHUB_OWNER%/%GITHUB_REPO%/main

echo ===================================
echo   Space Knowledge - Full Sync
echo ===================================

for %%F in (app.js app.json project.config.json sitemap.json ^
data/knowledge.js data/quiz.js ^
pages/index/index.js pages/index/index.wxml pages/index/index.wxss pages/index/index.json ^
pages/category/category.js pages/category/category.wxml pages/category/category.wxss pages/category/category.json ^
pages/category-list/category-list.js pages/category-list/category-list.wxml pages/category-list/category-list.wxss pages/category-list/category-list.json ^
pages/detail/detail.js pages/detail/detail.wxml pages/detail/detail.wxss pages/detail/detail.json ^
pages/search/search.js pages/search/search.wxml pages/search/search.wxss pages/search/search.json ^
pages/quiz/quiz.js pages/quiz/quiz.wxml pages/quiz/quiz.wxss pages/quiz/quiz.json ^
pages/quiz-result/quiz-result.js pages/quiz-result/quiz-result.wxml pages/quiz-result/quiz-result.wxss pages/quiz-result/quiz-result.json ^
pages/favorites/favorites.js pages/favorites/favorites.wxml pages/favorites/favorites.wxss pages/favorites/favorites.json ^
pages/migrate/migrate.js pages/migrate/migrate.wxml pages/migrate/migrate.wxss pages/migrate/migrate.json ^
custom-tab-bar/index.js custom-tab-bar/index.wxml custom-tab-bar/index.wxss custom-tab-bar/index.json ^
components/knowledge-card/knowledge-card.js components/knowledge-card/knowledge-card.wxml components/knowledge-card/knowledge-card.wxss components/knowledge-card/knowledge-card.json ^
utils/util.js utils/storage.js) do (
    echo Downloading %%F ...
    powershell -NoProfile -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/%%F' -OutFile '%LOCAL_DIR%\%%F' -UseBasicParsing -ErrorAction Stop } catch { Write-Host '   [SKIP]' }" 2>nul
)

echo.
echo ===================================
echo   Full Sync Complete!
echo ===================================
echo.
echo Next steps:
echo   1. Open WeChat DevTools
echo   2. Press Ctrl+B to compile
echo   3. Scroll to bottom of index page
echo   4. Click cloud data migrate
echo ===================================
pause
