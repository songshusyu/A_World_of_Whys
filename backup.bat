@echo off
chcp 65001
echo 正在创建备份...

:: 获取当前时间戳
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%_%datetime:~8,6%

:: 创建备份目录
set BACKUP_DIR=backup_%timestamp%
echo 创建备份目录: %BACKUP_DIR%
mkdir "%BACKUP_DIR%"

:: 备份整个项目代码
echo 备份项目代码...
xcopy /E /I /Y frontend %BACKUP_DIR%\frontend
xcopy /E /I /Y backend %BACKUP_DIR%\backend
copy *.md %BACKUP_DIR%\
copy *.bat %BACKUP_DIR%\

:: 备份数据库
echo 备份数据库...
echo 请输入MySQL root密码:
mysqldump -u root -p zhimiao_db > "%BACKUP_DIR%\database_backup.sql"
if errorlevel 1 (
    echo 数据库备份失败，继续其他文件的备份...
    echo 请稍后手动执行以下命令备份数据库：
    echo mysqldump -u root -p zhimiao_db ^> database_backup.sql
) else (
    echo 数据库备份成功！
)

:: 创建笔记功能相关文件的特别备份
echo 备份笔记功能相关文件...
mkdir "%BACKUP_DIR%\notes_feature"
copy "backend\zhimiao-learning\src\main\java\com\zhimiao\model\Note.java" "%BACKUP_DIR%\notes_feature\"
copy "backend\zhimiao-learning\src\main\java\com\zhimiao\repository\NoteRepository.java" "%BACKUP_DIR%\notes_feature\"
copy "backend\zhimiao-learning\src\main\java\com\zhimiao\service\NoteService.java" "%BACKUP_DIR%\notes_feature\"
copy "backend\zhimiao-learning\src\main\java\com\zhimiao\controller\NoteController.java" "%BACKUP_DIR%\notes_feature\"
copy "frontend\pages\notes.html" "%BACKUP_DIR%\notes_feature\"
copy "frontend\js\api.js" "%BACKUP_DIR%\notes_feature\"

:: 创建部署相关文件的备份
echo 备份部署文件...
mkdir "%BACKUP_DIR%\deploy"
copy deploy.bat "%BACKUP_DIR%\deploy\"
copy "软件安装说明书.md" "%BACKUP_DIR%\deploy\" 2>nul

:: 创建备份说明文件
echo 创建备份说明文件...
(
echo # 备份信息
echo 备份时间: %timestamp%
echo.
echo ## 备份内容
echo 1. 前端代码 ^(frontend/^)
echo 2. 后端代码 ^(backend/^)
echo 3. 数据库备份 ^(database_backup.sql^)
echo 4. 文档文件 ^(*.md^)
echo 5. 部署脚本 ^(*.bat^)
echo 6. 笔记功能特别备份 ^(notes_feature/^)
echo.
echo ## 笔记功能实现状态
echo - [x] 后端实现 ^(Note.java, NoteRepository.java, NoteService.java, NoteController.java^)
echo - [x] 前端实现 ^(notes.html, EasyMDE集成^)
echo - [x] API实现 ^(CRUD操作^)
echo - [x] 数据库表结构
echo - [x] 安全性配置
echo.
echo ## 待优化功能
echo - [ ] 笔记分类功能
echo - [ ] 笔记分享功能
echo - [ ] 笔记导出功能
echo - [ ] 云端同步
echo - [ ] 富文本编辑功能
echo.
echo ## 还原说明
echo 1. 还原代码：直接复制相应目录到工作区
echo 2. 还原数据库：
echo    mysql -u root -p zhimiao_db ^< database_backup.sql
) > "%BACKUP_DIR%\README.md"

:: 创建压缩文件
echo 创建压缩文件...
powershell -Command "Compress-Archive -Path '%BACKUP_DIR%' -DestinationPath '%BACKUP_DIR%.zip' -Force"

echo 备份完成！
echo 备份文件位置：%BACKUP_DIR%.zip
echo 您可以安全地保存这个备份文件。
echo.
echo 请按任意键退出...
pause > nul 