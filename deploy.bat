@echo off
echo 正在创建部署目录...
mkdir deploy 2>nul

echo 复制必要文件...
copy backend\zhimiao-learning\target\zhimiao-learning-1.0.0-SNAPSHOT.jar deploy\
copy backend\zhimiao-learning\src\main\resources\init.sql deploy\
copy backend\zhimiao-learning\src\main\resources\application.properties deploy\
xcopy /E /I frontend deploy\frontend

echo 创建启动脚本...
(
echo @echo off
echo echo 启动后端服务...
echo start java -jar zhimiao-learning-1.0.0-SNAPSHOT.jar
echo echo 等待后端服务启动...
echo timeout /t 10
echo echo 启动前端服务...
echo cd frontend
echo python start-server.py
) > deploy\start.bat

echo 创建README...
(
echo # 智喵学堂快速启动指南
echo.
echo 1. 确保已安装以下软件：
echo    - JDK 17或更高版本
echo    - MySQL 8.0或更高版本
echo    - Python 3.8或更高版本
echo.
echo 2. 配置MySQL：
echo    - 运行init.sql脚本创建数据库
echo.
echo 3. 启动服务：
echo    - 双击start.bat启动所有服务
echo.
echo 4. 访问系统：
echo    - 打开浏览器访问：http://localhost:3000
echo    - 默认用户名：test
echo    - 默认密码：123456
) > deploy\README.txt

echo 部署包已准备完成！
echo 部署文件位于deploy目录下。
echo.
echo 请按任意键退出...
pause > nul 