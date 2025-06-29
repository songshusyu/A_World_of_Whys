@echo off
chcp 65001
echo 开始验证备份...

:: 获取最新的备份文件
for /f "delims=" %%a in ('dir /b /od backup_*.zip') do set LATEST_BACKUP=%%a
if not defined LATEST_BACKUP (
    echo 未找到备份文件！
    echo 请确保备份文件（backup_*.zip）存在于当前目录。
    pause
    exit /b 1
)

:: 创建临时测试目录
set TEST_DIR=backup_test_%RANDOM%
echo 创建测试目录: %TEST_DIR%
mkdir "%TEST_DIR%"

:: 解压备份文件
echo 解压备份文件 %LATEST_BACKUP%...
powershell -Command "Expand-Archive -Path '%LATEST_BACKUP%' -DestinationPath '%TEST_DIR%' -Force"

:: 进入解压后的目录（去掉.zip后缀）
cd "%TEST_DIR%"
for /d %%d in (*) do cd %%d

:: 验证关键文件
echo.
echo 验证关键文件...
set ERROR_COUNT=0

:: 检查前端文件
if not exist "frontend\index.html" (
    echo [错误] 未找到 frontend\index.html
    set /a ERROR_COUNT+=1
) else (
    echo [成功] 找到 frontend\index.html
)

:: 检查后端文件
if not exist "backend\zhimiao-learning\target\zhimiao-learning-1.0.0-SNAPSHOT.jar" (
    echo [错误] 未找到后端JAR包
    set /a ERROR_COUNT+=1
) else (
    echo [成功] 找到后端JAR包
)

:: 检查数据库备份
if not exist "database_backup.sql" (
    echo [警告] 未找到数据库备份文件
    echo 请注意检查数据库备份是否成功
) else (
    echo [成功] 找到数据库备份文件
)

:: 检查配置文件
if not exist "backend\zhimiao-learning\src\main\resources\application.properties" (
    echo [错误] 未找到配置文件
    set /a ERROR_COUNT+=1
) else (
    echo [成功] 找到配置文件
)

:: 检查部署脚本
if not exist "deploy.bat" (
    echo [错误] 未找到部署脚本
    set /a ERROR_COUNT+=1
) else (
    echo [成功] 找到部署脚本
)

echo.
echo 测试数据库还原...
if exist "database_backup.sql" (
    echo 请输入MySQL root密码以测试数据库还原:
    mysql -u root -p zhimiao_db < database_backup.sql
    if errorlevel 1 (
        echo [警告] 数据库还原测试失败
        set /a ERROR_COUNT+=1
    ) else (
        echo [成功] 数据库还原测试成功
    )
)

:: 返回原目录
cd ..\..

:: 清理测试目录
echo.
echo 清理测试目录...
rmdir /s /q "%TEST_DIR%"

:: 显示验证结果
echo.
echo 验证完成！
if %ERROR_COUNT% gtr 0 (
    echo [警告] 发现 %ERROR_COUNT% 个问题，请检查上述错误信息。
) else (
    echo [成功] 备份验证通过！备份文件可以正常使用。
)

echo.
echo 建议的后续步骤：
echo 1. 在新环境中使用deploy.bat部署系统
echo 2. 访问 http://localhost:3000 测试前端
echo 3. 访问 http://localhost:8080/test 测试后端
echo.
echo 请按任意键退出...
pause > nul 