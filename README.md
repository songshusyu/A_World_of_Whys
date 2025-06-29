# 智喵学堂 (A World of Whys)

一个基于Spring Boot和Bootstrap的智能学习平台。

## 项目特点

- 现代化的用户界面
- 智能问答功能
- 课程管理系统
- Markdown笔记功能
  - 实时预览
  - 本地存储
  - 云端同步
  - 权限管理
- 学习进度追踪

## 技术栈

- 前端：Bootstrap 5, JavaScript, EasyMDE
- 后端：Spring Boot, JPA
- 数据库：MySQL
- AI集成：通义千问API

## 功能模块

### Markdown笔记功能

#### 后端实现
- `Note.java`: 笔记实体类，包含标题、内容、创建时间等字段
- `NoteRepository.java`: 数据访问接口，提供基本的CRUD操作
- `NoteService.java`: 业务逻辑层，处理笔记的增删改查
- `NoteController.java`: REST API接口，提供HTTP接口

#### 前端实现
- 使用EasyMDE作为Markdown编辑器
- 实时预览功能
- 笔记列表管理
- 本地存储支持

#### API接口
```java
GET /api/notes - 获取笔记列表
POST /api/notes - 创建新笔记
GET /api/notes/{id} - 获取特定笔记
PUT /api/notes/{id} - 更新笔记
DELETE /api/notes/{id} - 删除笔记
```

#### 数据库结构
```sql
CREATE TABLE notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 安全性
- 所有API都需要认证
- 笔记访问权限验证
- CORS配置已添加

#### 待优化功能
- [ ] 笔记分类功能
- [ ] 笔记分享功能
- [ ] 笔记导出功能
- [ ] 云端同步
- [ ] 富文本编辑功能

## 快速开始

1. 克隆仓库
```bash
git clone git@github.com:songshusyu/A_World_of_Whys.git
```

2. 配置数据库
```sql
# 运行 init.sql 脚本创建数据库
```

3. 启动后端
```bash
java -jar zhimiao-learning-1.0.0-SNAPSHOT.jar
```

4. 启动前端
```bash
python start-server.py
```

5. 访问系统
- 打开浏览器访问：http://localhost:3000
- 默认用户名：test
- 默认密码：123456

## 开发说明

### 分支说明
- master: 主分支，稳定版本
- develop: 开发分支
- feature/*: 新功能分支
- bugfix/*: 错误修复分支

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 其他修改

## 联系方式

- 作者：徐鹤松
- GitHub：https://github.com/songshusyu 