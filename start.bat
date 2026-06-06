@echo off
chcp 65001 >nul
title QaraKino

echo ==========================================
echo    🎬 QaraKino - 启动服务
echo ==========================================
echo.

REM 检查 Node.js
echo [检查] Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] Node.js 未安装!
    echo 请先运行: install.bat
    pause
    exit /b 1
)
echo [成功] Node.js 已就绪

REM 检查依赖是否安装
if not exist "node_modules" (
    echo.
    echo [提示] 依赖未安装，正在自动安装...
    call install.bat
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查各个模块
for %%d in (backend client admin) do (
    if not exist "%%d\node_modules" (
        echo.
        echo [提示] %%d 依赖未安装，正在安装...
        cd %%d
        call npm install
        cd ..
    )
)

echo.
echo ==========================================
echo 🚀 正在启动所有服务...
echo ==========================================
echo.
echo 📡 后端服务:   http://localhost:5000
echo 🎬 用户端:     http://localhost:3000
echo ⚙️  管理后台:   http://localhost:3001
echo.
echo 按 Ctrl+C 停止所有服务
echo ==========================================
echo.

npm run dev
pause
