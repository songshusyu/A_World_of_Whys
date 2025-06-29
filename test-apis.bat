@echo off
echo 🧪 智喵学堂API测试脚本
echo.

echo 🔍 检查后端服务状态...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/course/topic-modules?topic=机器学习' -UseBasicParsing -TimeoutSec 5; Write-Host '✅ 后端API正常 - 状态码:' $response.StatusCode; $response.Content } catch { Write-Host '❌ 后端API连接失败:' $_.Exception.Message }"

echo.
echo 🔍 检查前端服务状态...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5; Write-Host '✅ 前端服务正常 - 状态码:' $response.StatusCode } catch { Write-Host '❌ 前端服务连接失败:' $_.Exception.Message }"

echo.
echo 📊 端口占用情况...
netstat -an | findstr ":8080"
netstat -an | findstr ":3000"

echo.
pause 