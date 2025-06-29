#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class WhysRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # 处理根路径
        if self.path == '/':
            self.path = '/index.html'
        # 处理没有扩展名的路径（假设是页面路由）
        elif '.' not in os.path.basename(self.path):
            self.path = '/index.html'
        
        try:
            return super().do_GET()
        except Exception as e:
            self.send_error(404, str(e))

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

def start_server(port=3000):
    # 切换到frontend目录
    frontend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(frontend_dir)
    
    try:
        with socketserver.TCPServer(("", port), WhysRequestHandler) as httpd:
            print(f"🚀 前端服务器启动成功!")
            print(f"📍 地址: http://localhost:{port}")
            print(f"📁 目录: {frontend_dir}")
            print(f"🌐 请在浏览器中打开: http://localhost:{port}")
            print(f"⏹️  按 Ctrl+C 停止服务器")
            print("-" * 50)
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
    except OSError as e:
        if e.errno == 48 or e.errno == 10048:  # Address already in use
            print(f"❌ 端口 {port} 已被占用，尝试使用端口 {port + 1}")
            start_server(port + 1)
        else:
            print(f"❌ 启动服务器失败: {e}")

if __name__ == "__main__":
    port = 3000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("端口号必须是数字")
            sys.exit(1)
    
    start_server(port) 