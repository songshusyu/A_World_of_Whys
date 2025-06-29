@echo off
setlocal enabledelayedexpansion

REM Set MySQL Path
set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 9.3\bin"

REM Set SQL File Path
set "SQL_FILE=%~dp0backend\zhimiao-learning\src\main\resources\db\notes_table.sql"

echo Using MySQL Path: !MYSQL_PATH!
echo Executing SQL script...

REM Execute SQL script with character set parameter
"!MYSQL_PATH!\mysql" -u root -p --default-character-set=utf8mb4 zhimiao_db < "%SQL_FILE%"

if !ERRORLEVEL! EQU 0 (
    echo SQL script executed successfully!
) else (
    echo SQL script execution failed. Please check the error message.
)

pause 