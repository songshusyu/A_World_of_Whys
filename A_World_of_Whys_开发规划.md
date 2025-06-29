# A World of Whys (十万个为什么) - 开发规划文档

## 📋 项目概述

**项目名称**: A World of Whys (十万个为什么)  
**项目定位**: 新一代交互式知识学习引擎  
**用户群体**: 学生群体 + 通用学习者  
**设计风格**: 蓝白色调，仿照智喵学堂界面风格  
**技术栈**: HTML5 + CSS3 + JavaScript + Bootstrap + Spring Boot + MySQL

---

## 🎯 阶段一：前端基础架构搭建

### 📁 1.1 项目目录结构创建

#### 具体步骤：
1. 在项目根目录创建 `frontend` 文件夹
2. 创建以下目录结构：

```
frontend/
├── index.html              # 主页
├── css/
│   ├── bootstrap.min.css   # Bootstrap 5.3框架
│   ├── style.css          # 自定义样式
│   └── components.css     # 组件样式
├── js/
│   ├── bootstrap.min.js   # Bootstrap脚本
│   ├── main.js           # 主要逻辑
│   └── api.js            # API调用封装
├── images/               # 图片资源
│   ├── logo.png         # 项目Logo
│   └── icons/           # 图标文件
└── pages/               # 其他页面
    ├── ask.html         # 问答页面
    ├── learn.html       # 学习页面
    └── about.html       # 关于页面
```

#### 测试方法：
- [ ] 检查所有文件夹是否创建成功
- [ ] 验证目录结构是否符合规划
- [ ] 确认文件路径引用正确

---

### 🎨 1.2 Bootstrap框架集成

#### 具体步骤：
1. 下载Bootstrap 5.3.0版本
2. 将CSS和JS文件放入对应目录
3. 在HTML中正确引用Bootstrap文件

#### 代码示例：
```html
<!-- Bootstrap CSS -->
<link href="css/bootstrap.min.css" rel="stylesheet">
<!-- 自定义CSS -->
<link href="css/style.css" rel="stylesheet">

<!-- Bootstrap JS -->
<script src="js/bootstrap.min.js"></script>
```

#### 测试方法：
- [ ] 创建测试HTML页面
- [ ] 验证Bootstrap组件正常显示
- [ ] 检查响应式布局是否工作
- [ ] 测试Bootstrap JavaScript功能

**测试代码**：
```html
<!-- 测试按钮 -->
<button class="btn btn-primary">Bootstrap测试按钮</button>
<!-- 测试网格 -->
<div class="container">
  <div class="row">
    <div class="col-md-6">左列</div>
    <div class="col-md-6">右列</div>
  </div>
</div>
```

---

### 🏠 1.3 主页面开发 (index.html)

#### 具体步骤：
1. 创建HTML基础结构
2. 实现顶部导航栏
3. 添加中央搜索区域
4. 创建推荐主题卡片
5. 添加页脚信息

#### 页面结构：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A World of Whys - 十万个为什么</title>
    <!-- CSS引用 -->
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar">...</nav>
    
    <!-- 主要内容区 -->
    <main class="container">
        <!-- 标题区域 -->
        <section class="hero-section">...</section>
        
        <!-- 搜索区域 -->
        <section class="search-section">...</section>
        
        <!-- 推荐主题 -->
        <section class="topics-section">...</section>
    </main>
    
    <!-- 页脚 -->
    <footer>...</footer>
    
    <!-- JavaScript引用 -->
</body>
</html>
```

#### 测试方法：
- [ ] 在浏览器中打开页面，检查布局
- [ ] 测试响应式设计（手机、平板、桌面）
- [ ] 验证所有链接和按钮可点击
- [ ] 检查文字内容显示正确
- [ ] 测试搜索框交互功能

**具体测试步骤**：
1. 用Chrome开发者工具切换设备视图
2. 测试不同屏幕尺寸下的显示效果
3. 验证导航菜单在移动端的折叠功能

---

## 🎨 阶段二：样式系统开发

### 🌈 2.1 颜色系统定义

#### 具体步骤：
1. 在 `style.css` 中定义CSS变量
2. 创建颜色类
3. 应用到各个组件

#### 代码实现：
```css
:root {
    /* 主色调 */
    --primary-color: #6366f1;
    --primary-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    
    /* 辅助色 */
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    
    /* 背景色 */
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-light: #e2e8f0;
    
    /* 文字色 */
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-light: #9ca3af;
}
```

#### 测试方法：
- [ ] 创建颜色测试页面
- [ ] 验证所有颜色变量正确定义
- [ ] 检查颜色对比度是否符合可访问性标准
- [ ] 测试深色模式兼容性

**测试代码**：
```html
<div class="color-test">
    <div style="background: var(--primary-color);">主色</div>
    <div style="background: var(--secondary-color);">辅助色</div>
    <div style="background: var(--success-color);">成功色</div>
</div>
```

---

### 🎯 2.2 核心组件样式

#### 具体步骤：
1. 设计搜索框样式
2. 创建卡片组件
3. 设计按钮样式
4. 实现导航栏样式

#### 搜索框样式：
```css
.search-container {
    background: var(--bg-secondary);
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    margin: 2rem 0;
}

.search-input {
    border: 2px solid var(--bg-light);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    width: 100%;
    max-width: 600px;
    transition: all 0.3s ease;
}

.search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

#### 卡片组件样式：
```css
.topic-card {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.topic-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

#### 测试方法：
- [ ] 测试搜索框聚焦效果
- [ ] 验证卡片悬停动画
- [ ] 检查按钮点击反馈
- [ ] 测试组件在不同浏览器的兼容性

**测试步骤**：
1. 鼠标悬停测试所有交互元素
2. 键盘导航测试（Tab键）
3. 触摸设备测试（如果有的话）

---

## 💻 阶段三：JavaScript功能开发

### 🔌 3.1 API调用模块

#### 具体步骤：
1. 创建 `api.js` 文件
2. 封装HTTP请求方法
3. 实现错误处理
4. 添加加载状态管理

#### 代码实现：
```javascript
class WhysAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.timeout = 10000; // 10秒超时
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }
    
    async askQuestion(question) {
        return await this.request(`/ask?q=${encodeURIComponent(question)}`);
    }
    
    async getTopics() {
        return await this.request('/topics');
    }
    
    async checkStatus() {
        return await this.request('/status');
    }
}
```

#### 测试方法：
- [ ] 测试API连接状态
- [ ] 验证问答功能
- [ ] 测试错误处理机制
- [ ] 检查超时处理

**测试代码**：
```javascript
// 测试API连接
async function testAPI() {
    const api = new WhysAPI();
    
    try {
        // 测试状态检查
        const status = await api.checkStatus();
        console.log('API状态:', status);
        
        // 测试问答功能
        const answer = await api.askQuestion('什么是人工智能？');
        console.log('AI回答:', answer);
        
    } catch (error) {
        console.error('测试失败:', error);
    }
}
```

---

### 🎭 3.2 用户交互功能

#### 具体步骤：
1. 实现搜索功能
2. 添加实时输入提示
3. 创建问答对话界面
4. 实现主题推荐点击

#### 搜索功能实现：
```javascript
class SearchManager {
    constructor() {
        this.api = new WhysAPI();
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.resultsContainer = document.getElementById('results');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // 搜索按钮点击
        this.searchButton.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // 回车键搜索
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // 实时输入提示（防抖）
        this.searchInput.addEventListener('input', 
            this.debounce(() => this.showSuggestions(), 300)
        );
    }
    
    async handleSearch() {
        const question = this.searchInput.value.trim();
        if (!question) return;
        
        this.showLoading();
        
        try {
            const answer = await this.api.askQuestion(question);
            this.displayAnswer(question, answer);
        } catch (error) {
            this.showError('搜索失败，请稍后重试');
        }
    }
    
    showLoading() {
        this.resultsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>AI正在思考中...</p>
            </div>
        `;
    }
    
    displayAnswer(question, answer) {
        this.resultsContainer.innerHTML = `
            <div class="qa-result">
                <div class="question">
                    <strong>问：</strong>${question}
                </div>
                <div class="answer">
                    <strong>答：</strong>${answer}
                </div>
            </div>
        `;
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
```

#### 测试方法：
- [ ] 测试搜索框输入和提交
- [ ] 验证回车键搜索功能
- [ ] 测试加载状态显示
- [ ] 检查错误处理显示
- [ ] 验证防抖功能

**测试步骤**：
1. 输入问题并点击搜索按钮
2. 输入问题并按回车键
3. 输入无效内容测试错误处理
4. 快速连续输入测试防抖效果

---

## 🔗 阶段四：前后端集成

### 🌐 4.1 后端API适配

#### 具体步骤：
1. 更新后端控制器支持前端需求
2. 添加CORS配置
3. 优化API响应格式
4. 添加前端静态资源服务

#### 后端配置更新：
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
```

#### 新增控制器：
```java
@RestController
@RequestMapping("/api/whys")
public class WhysController {
    
    @Autowired
    private QwenService qwenService;
    
    @GetMapping("/topics")
    public ResponseEntity<List<String>> getRecommendedTopics() {
        List<String> topics = Arrays.asList(
            "人工智能", "机器学习", "量子计算", "生物技术",
            "太空探索", "环境科学", "历史文化", "文学艺术"
        );
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSearchSuggestions(@RequestParam String query) {
        // 实现搜索建议逻辑
        return ResponseEntity.ok(suggestions);
    }
}
```

#### 测试方法：
- [ ] 测试CORS配置是否生效
- [ ] 验证静态资源访问
- [ ] 测试新增API端点
- [ ] 检查API响应格式

**测试命令**：
```bash
# 测试CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS http://localhost:8080/api/ask

# 测试主题API
curl http://localhost:8080/api/whys/topics
```

---

### 📱 4.2 响应式设计优化

#### 具体步骤：
1. 添加移动端适配CSS
2. 优化触摸交互
3. 调整字体大小和间距
4. 测试不同设备兼容性

#### 移动端样式：
```css
/* 移动端适配 */
@media (max-width: 768px) {
    .search-container {
        padding: 2rem 1rem;
    }
    
    .search-input {
        font-size: 16px; /* 防止iOS缩放 */
    }
    
    .topic-card {
        margin-bottom: 1rem;
    }
    
    .navbar-brand {
        font-size: 1.2rem;
    }
}

/* 触摸设备优化 */
@media (hover: none) {
    .topic-card:hover {
        transform: none;
    }
    
    .topic-card:active {
        transform: scale(0.98);
    }
}
```

#### 测试方法：
- [ ] 在不同设备上测试布局
- [ ] 验证触摸交互体验
- [ ] 检查文字可读性
- [ ] 测试横竖屏切换

**测试设备列表**：
- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1200px+)

---

## 🧪 阶段五：综合测试

### ✅ 5.1 功能测试清单

#### 基础功能测试：
- [ ] 页面加载速度测试
- [ ] 搜索功能完整性测试
- [ ] API调用稳定性测试
- [ ] 错误处理机制测试
- [ ] 用户交互体验测试

#### 兼容性测试：
- [ ] Chrome浏览器测试
- [ ] Firefox浏览器测试
- [ ] Safari浏览器测试
- [ ] Edge浏览器测试
- [ ] 移动端浏览器测试

#### 性能测试：
- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 5秒
- [ ] 内存使用情况检查
- [ ] 网络请求优化验证

### 🐛 5.2 问题记录和修复

#### 问题记录模板：
```
问题ID: BUG-001
发现时间: 2024-XX-XX
问题描述: [详细描述问题]
重现步骤: 
1. [步骤1]
2. [步骤2]
3. [步骤3]
预期结果: [应该发生什么]
实际结果: [实际发生了什么]
严重程度: [高/中/低]
修复状态: [待修复/修复中/已修复]
修复方案: [修复方法描述]
```

---

## 📊 项目进度跟踪

### 📅 开发时间线

| 阶段 | 任务          | 预计时间 | 实际时间 | 状态 |
| ---- | ------------- | -------- | -------- | ---- |
| 1.1  | 项目结构搭建  | 0.5天    |          | ⏳    |
| 1.2  | Bootstrap集成 | 0.5天    |          | ⏳    |
| 1.3  | 主页面开发    | 1天      |          | ⏳    |
| 2.1  | 颜色系统定义  | 0.5天    |          | ⏳    |
| 2.2  | 核心组件样式  | 1天      |          | ⏳    |
| 3.1  | API调用模块   | 1天      |          | ⏳    |
| 3.2  | 用户交互功能  | 1天      |          | ⏳    |
| 4.1  | 后端API适配   | 0.5天    |          | ⏳    |
| 4.2  | 响应式优化    | 0.5天    |          | ⏳    |
| 5.1  | 综合测试      | 1天      |          | ⏳    |

### 🎯 里程碑检查点

- [ ] **里程碑1**: 基础页面结构完成
- [ ] **里程碑2**: 样式系统完整实现
- [ ] **里程碑3**: JavaScript功能全部就绪
- [ ] **里程碑4**: 前后端成功集成
- [ ] **里程碑5**: 项目完整测试通过

---

## 🚀 部署准备

### 📦 打包和部署

#### 前端部署步骤：
1. 将前端文件复制到Spring Boot的 `src/main/resources/static` 目录
2. 更新API调用路径为相对路径
3. 压缩CSS和JavaScript文件
4. 优化图片资源

#### 后端部署配置：
```properties
# application.properties
server.port=8080
spring.web.resources.static-locations=classpath:/static/
spring.mvc.static-path-pattern=/**
```

#### 测试部署：
- [ ] 本地打包测试
- [ ] 生产环境部署测试
- [ ] 域名访问测试
- [ ] HTTPS配置测试

---

## 📝 文档和维护

### 📚 用户文档

#### 用户使用指南：
1. 如何提问
2. 搜索技巧
3. 主题浏览方法
4. 常见问题解答

#### 开发文档：
1. 项目架构说明
2. API接口文档
3. 样式指南
4. 部署指南

### 🔧 维护计划

#### 定期维护任务：
- [ ] 每周性能监控
- [ ] 每月安全更新
- [ ] 季度功能优化
- [ ] 年度技术升级

---

## 🎉 项目完成标准

### ✅ 完成标准检查清单

#### 功能完整性：
- [ ] 所有计划功能已实现
- [ ] 用户体验流畅
- [ ] 错误处理完善
- [ ] 性能指标达标

#### 代码质量：
- [ ] 代码规范统一
- [ ] 注释完整清晰
- [ ] 无严重Bug
- [ ] 安全性验证通过

#### 文档完整性：
- [ ] 用户文档完整
- [ ] 开发文档齐全
- [ ] 部署文档详细
- [ ] 维护指南明确

---

**项目开始时间**: [待填写]  
**预计完成时间**: [待填写]  
**实际完成时间**: [待填写]  

**开发团队**: [团队成员]  
**项目负责人**: [负责人姓名]  

---

*本文档将随着项目进展持续更新，确保开发过程的透明度和可追踪性。* 