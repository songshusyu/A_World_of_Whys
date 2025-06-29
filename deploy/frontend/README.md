# A World of Whys - 前端使用说明

## 🚀 快速开始

### 1. 启动服务
```bash
# 在frontend目录下
python start-server.py
```

### 2. 访问页面
- **主页面**：http://localhost:3000/index.html
- **Markdown测试页面**：http://localhost:3000/test-markdown.html
- **API测试页面**：http://localhost:3000/test-api-fix.html

## 📝 Markdown支持

现在AI回答支持完整的Markdown格式，包括：

### ✅ 支持的语法
- `# ## ###` - 标题（h3, h4, h5）
- `**粗体**` - 粗体文本
- `*斜体*` - 斜体文本
- `代码` - 行内代码
- ` ```代码块``` ` - 代码块
- `- 列表项` - 无序列表
- `1. 列表项` - 有序列表
- `[链接](URL)` - 超链接
- `---` - 分割线
- 段落和换行

### 🎨 样式特色
- 标题有颜色区分和下划线
- 代码块有深色主题
- 列表有正确的缩进和符号
- 链接有悬停效果
- 分割线有渐变效果

## 🧪 测试页面功能

### Markdown测试页面
- 实时预览Markdown渲染效果
- 包含完整的示例文本
- 可以测试各种Markdown语法

### API测试页面
- 测试后端API连接
- 验证JSON响应格式
- 实时显示API调用结果

## 🔧 技术实现

### Markdown解析器
- 纯JavaScript实现
- 正则表达式处理
- HTML安全转义
- 支持嵌套语法

### CSS样式系统
- CSS变量定义颜色
- 响应式设计
- 深色代码主题
- 优雅的交互效果

## 📋 使用示例

```javascript
// 在JavaScript中调用Markdown解析
const whysApp = new WhysApp();
const htmlResult = whysApp.parseMarkdown('# 标题\n**粗体文本**');
```

## 🛠️ 故障排除

如果Markdown不能正确显示：
1. 检查浏览器控制台是否有JavaScript错误
2. 确认CSS样式文件正确加载
3. 访问测试页面验证功能
4. 检查前端HTTP服务器是否正常运行

## 📊 性能优化

- Markdown解析在客户端进行，减少服务器负载
- CSS使用硬件加速的动画
- 图片和字体使用CDN加载
- 代码分割和懒加载优化 