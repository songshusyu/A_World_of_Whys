@echo off
echo 🌐 启动前端HTTP服务器...
echo 📁 当前目录: %CD%
echo.

REM 检查是否有Node.js和http-server
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到Node.js，尝试使用Python服务器...
    goto :python_server
)

REM 检查http-server是否安装
npx http-server --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 正在安装http-server...
    npm install -g http-server
)

echo ✅ 使用Node.js http-server启动...
echo 🔗 访问地址: http://localhost:3000
echo 🏠 主页面: http://localhost:3000/index.html
echo ⏹️  按 Ctrl+C 停止服务器
echo.
npx http-server . -p 3000 --cors -o
goto :end

:python_server
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到Python，无法启动HTTP服务器
    echo 💡 请安装Node.js或Python后重试
    goto :end
)

echo ✅ 使用Python HTTP服务器启动...
echo 🔗 访问地址: http://localhost:3000
echo 🏠 主页面: http://localhost:3000/index.html
echo ⏹️  按 Ctrl+C 停止服务器
echo.
python -m http.server 3000

:end
pause 