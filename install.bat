@echo off
chcp 65001 >nul
echo ==========================================
echo    🎬 QaraKino - 维语影视平台
echo    一键安装脚本
echo ==========================================
echo.

REM 检查 Node.js
echo [1/6] 检查 Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] Node.js 未安装!
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [成功] Node.js 已安装: %NODE_VERSION%

REM 检查 npm
echo.
echo [2/6] 检查 npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo [错误] npm 未安装!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [成功] npm 已安装: %NPM_VERSION%

REM 安装根依赖
echo.
echo [3/6] 安装根目录依赖...
call npm install
if errorlevel 1 (
    echo [错误] 根目录依赖安装失败
    pause
    exit /b 1
)
echo [成功] 根目录依赖安装成功

REM 安装后端依赖
echo.
echo [4/6] 安装后端依赖...
cd backend
call npm install
if errorlevel 1 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
echo [成功] 后端依赖安装成功
cd ..

REM 安装前端依赖
echo.
echo [5/6] 安装用户端依赖...
cd client
call npm install
if errorlevel 1 (
    echo [错误] 用户端依赖安装失败
    pause
    exit /b 1
)
echo [成功] 用户端依赖安装成功
cd ..

REM 安装管理后台依赖
echo.
echo [6/6] 安装管理后台依赖...
cd admin
call npm install
if errorlevel 1 (
    echo [错误] 管理后台依赖安装失败
    pause
    exit /b 1
)
echo [成功] 管理后台依赖安装成功
cd ..

echo.
echo ==========================================
echo 🎉 安装完成!
echo ==========================================
echo.
echo 快速启动命令:
echo   npm run dev          ^<-- 启动所有服务
echo.
echo 或分别启动:
echo   cd backend ^&^& npm run dev  ^<-- 后端 (端口 5000)
echo   cd client ^&^& npm run dev   ^<-- 用户端 (端口 3000)
echo   cd admin ^&^& npm run dev    ^<-- 管理后台 (端口 3001)
echo.
echo 访问地址:
echo   用户端:  http://localhost:3000
echo   管理后台: http://localhost:3001
echo   后端API: http://localhost:5000
echo.
echo ==========================================
pause
