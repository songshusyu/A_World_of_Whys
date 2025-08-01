# A World of Whys 课程系统开发计划

## 项目概述
将现有的智能问答系统扩展为完整的课程学习平台，实现三个界面的渐进式学习体验：
1. **主页界面** (index.html) - 搜索入口和主题推荐
2. **主题版块页面** (topic-modules.html) - AI生成的4个学习版块选择
3. **课程详情页面** (course-detail.html) - 4章5讲结构 + 四种内容类型

## 技术架构
- **前端**: HTML + CSS + JavaScript (原生)
- **后端**: Spring Boot + MySQL
- **AI集成**: 基于现有问答API扩展
- **缓存**: 前端localStorage + 后端数据库

---

## 第一阶段：后端基础架构 (优先级：高)

### 1.1 数据模型创建
**时间估计**: 2天

#### 任务列表:
- [ ] 创建 `Topic.java` 实体类
- [ ] 创建 `Module.java` 实体类  
- [ ] 创建 `Chapter.java` 实体类
- [ ] 创建 `Lecture.java` 实体类
- [ ] 创建 `LectureContent.java` 实体类
- [ ] 创建 `UserProgress.java` 实体类
- [ ] 创建 `ContentType.java` 枚举类

#### 文件位置:
```
backend/zhimiao-learning/src/main/java/com/zhimiao/model/
├── Topic.java
├── Module.java
├── Chapter.java
├── Lecture.java
├── LectureContent.java
├── UserProgress.java
└── ContentType.java
```

### 1.2 数据访问层
**时间估计**: 1天

#### 任务列表:
- [ ] 创建 `TopicRepository.java`
- [ ] 创建 `ModuleRepository.java`
- [ ] 创建 `ChapterRepository.java`
- [ ] 创建 `LectureRepository.java`
- [ ] 创建 `LectureContentRepository.java`
- [ ] 创建 `UserProgressRepository.java`

### 1.3 服务层实现
**时间估计**: 3天

#### 任务列表:
- [ ] 创建 `AIPromptService.java` - AI提示词管理
- [ ] 创建 `CourseService.java` - 课程业务逻辑
- [ ] 创建 `ProgressService.java` - 学习进度管理
- [ ] 集成现有AI服务接口
- [ ] 实现JSON响应解析逻辑

### 1.4 控制器层
**时间估计**: 2天

#### 任务列表:
- [ ] 创建 `CourseController.java`
- [ ] 实现 `/api/course/topic-modules` 接口
- [ ] 实现 `/api/course/course-structure` 接口  
- [ ] 实现 `/api/course/lecture-content` 接口
- [ ] 实现 `/api/course/progress` 接口
- [ ] 配置CORS和异常处理

---

## 第二阶段：前端基础设施 (优先级：高)

### 2.1 依赖和工具准备
**时间估计**: 0.5天

#### 任务列表:
- [ ] 下载 `marked.min.js` (Markdown解析)
- [ ] 创建前端文件夹结构
- [ ] 准备图标资源

### 2.2 缓存和工具类
**时间估计**: 1天

#### 任务列表:
- [ ] 创建 `course-cache.js` - 本地存储管理
- [ ] 创建 `course-utils.js` - 工具函数
- [ ] 创建 `course-api-wrapper.js` - API封装

#### 功能要求:
- 24小时缓存过期机制
- 三层缓存结构(主题→版块→讲次)
- JSON解析和错误处理
- URL参数处理工具

---

## 第三阶段：主题版块页面 (优先级：中)

### 3.1 页面结构创建
**时间估计**: 1天

#### 任务列表:
- [ ] 创建 `pages/topic-modules.html`
- [ ] 设计4个版块的卡片布局
- [ ] 添加面包屑导航
- [ ] 实现响应式设计

### 3.2 页面逻辑实现
**时间估计**: 2天

#### 任务列表:
- [ ] 创建 `js/topic-modules.js`
- [ ] 实现API调用和数据渲染
- [ ] 添加加载状态和错误处理
- [ ] 绑定版块卡片点击事件

#### 功能要求:
- 从URL获取主题参数
- 调用后端API获取版块信息
- 动态渲染4个版块卡片
- 点击跳转到课程详情页

---

## 第四阶段：课程详情页面 (优先级：中)

### 4.1 页面布局创建
**时间估计**: 2天

#### 任务列表:
- [ ] 创建 `pages/course-detail.html`
- [ ] 实现左右分栏布局(30%:70%)
- [ ] 设计章节导航树形结构
- [ ] 创建三个内容标签页

### 4.2 页面控制器
**时间估计**: 3天

#### 任务列表:
- [ ] 创建 `js/course-detail.js`
- [ ] 实现课程结构API调用
- [ ] 渲染4章5讲的导航结构
- [ ] 实现讲次内容加载
- [ ] 添加标签页切换逻辑
- [ ] 实现进度跟踪功能

#### 功能要求:
- URL参数解析(主题、版块)
- 动态生成章节导航
- Markdown内容渲染
- 测试题目展示
- 学习进度保存

---

## 第五阶段：主页集成 (优先级：中)

### 5.1 搜索功能修改
**时间估计**: 1天

#### 任务列表:
- [ ] 修改主页搜索按钮逻辑
- [ ] 实现跳转到主题版块页面
- [ ] 修改主题推荐卡片点击事件
- [ ] 添加过渡动画效果

---

## 开发时间线

### 第1周: 后端基础架构
- 数据模型设计和实现
- 数据库配置和迁移
- 基础服务层开发

### 第2周: 后端API完成
- 控制器层实现
- AI服务集成
- API测试和调试

### 第3周: 前端页面开发
- 主题版块页面完成
- 课程详情页面基础布局
- 前端工具类和缓存系统

### 第4周: 功能集成和测试
- 课程详情页面完成
- 主页集成修改
- 端到端测试和bug修复

---

## 技术风险点

### 高风险:
1. **AI API集成复杂度** - AI返回格式可能不稳定
2. **JSON解析错误处理** - 需要robust的解析逻辑
3. **缓存一致性** - 前后端数据同步问题

### 中风险:
1. **数据库性能** - 大量课程数据的查询优化
2. **前端状态管理** - 复杂的页面间状态传递
3. **移动端适配** - 复杂布局的响应式设计

---

## 成功标准

### 功能完整性:
- [ ] 用户可以搜索主题并查看4个版块
- [ ] 用户可以选择版块并查看4章5讲结构
- [ ] 用户可以学习具体讲次的三种内容
- [ ] 系统能够保存和显示学习进度

### 性能要求:
- [ ] 页面加载时间 < 3秒
- [ ] API响应时间 < 5秒
- [ ] 缓存命中率 > 80%
- [ ] 移动端体验良好

---

## 下一步行动

### 立即开始 (第一步):
✅ **已完成**: 创建后端数据模型类
- [x] ✅ Topic.java 实体类 - 主题表，存储搜索的主题信息
- [x] ✅ Module.java 实体类 - 版块表，每个主题包含4个版块
- [x] ✅ Chapter.java 实体类 - 章节表，每个版块包含4个章节
- [x] ✅ Lecture.java 实体类 - 讲次表，每个章节包含5个讲次
- [x] ✅ LectureContent.java 实体类 - 讲次内容表，每个讲次包含4种内容类型
- [x] ✅ UserProgress.java 实体类 - 用户进度表，跟踪学习进度
- [x] ✅ ContentType.java 枚举类 - 内容类型：课程内容、简化版、测试、深入探索

### 第二步 (已完成):
✅ **已完成**: 创建Repository层、Service层和Controller层
- [x] ✅ 6个Repository接口 - 数据访问层，支持JPA查询和关联加载
- [x] ✅ AIPromptService - AI提示词生成服务，支持三层API提示词
- [x] ✅ CourseService - 核心业务服务，集成AI生成和数据持久化
- [x] ✅ CourseController - REST API控制器，提供三个核心接口
- [x] ✅ 编译测试通过 - 修复了Module类名冲突和方法调用问题

### 下一步:
1. 开始前端页面开发
2. 实现主题版块页面 (topic-modules.html)
3. 实现课程详情页面 (course-detail.html)

---

*最后更新: 2024年12月*
*项目状态: 规划阶段*

