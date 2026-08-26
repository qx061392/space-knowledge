@echo off
REM ==========================================
REM 航天知识库 - Windows自动同步脚本
REM 
REM 功能：从GitHub拉取最新的data/文件到本地项目
REM 用法：双击运行，或用任务计划程序定时运行
REM
REM 首次使用前，请修改下面的3个变量
REM ==========================================

REM ========== 配置区（请修改为你的信息） ==========
REM GitHub用户名
set GITHUB_OWNER=qx061392
REM 仓库名
set GITHUB_REPO=space-knowledge
REM 本地项目目录（微信开发者工具导入的项目路径）
set LOCAL_DIR=C:\path\to\your\project
REM ==========================================

echo.
echo ===================================
echo   航天知识库 - 自动同步
echo ===================================
echo.

REM 检查本地目录
if not exist "%LOCAL_DIR%\data" (
    echo [错误] 项目目录不存在: %LOCAL_DIR%\data
    echo 请修改脚本中的 LOCAL_DIR 变量
    pause
    exit /b 1
)

REM 下载4个数据文件
set FILES=data/knowledge.js data/knowledge-new.js data/quiz.js data/quiz-new.js
set BASE_URL=https://raw.githubusercontent.com/%GITHUB_OWNER%/%GITHUB_REPO%/main

for %%F in (%FILES%) do (
    echo 正在同步 %%F ...
    curl -sf "%BASE_URL%/%%F" -o "%LOCAL_DIR%\%%F"
    if errorlevel 1 (
        echo   [失败] %%F
    ) else (
        echo   [成功] %%F
    )
)

echo.
echo ===================================
echo   同步完成！
echo   微信开发者工具将自动重新编译
echo ===================================
echo.

REM 如果是双击运行，暂停让用户看到结果
echo 按任意键关闭窗口...
pause >nul
