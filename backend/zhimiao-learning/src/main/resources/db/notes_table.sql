-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建笔记表
CREATE TABLE IF NOT EXISTS notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 添加测试数据
INSERT INTO notes (user_id, title, content) VALUES 
(1, '欢迎使用智喵笔记', '# 欢迎使用智喵笔记！\n\n这是您的第一篇笔记。您可以使用Markdown语法来编写笔记。\n\n## Markdown基础语法\n\n### 标题\n使用#号表示标题层级\n\n### 列表\n- 无序列表项1\n- 无序列表项2\n\n1. 有序列表项1\n2. 有序列表项2\n\n### 强调\n*斜体文本* 或 _斜体文本_\n**粗体文本** 或 __粗体文本__\n\n### 链接和图片\n[链接文本](URL)\n![图片描述](图片URL)\n\n### 代码\n```python\nprint("Hello, World!")\n```\n\n### 表格\n| 表头1 | 表头2 |\n|-------|--------|\n| 内容1 | 内容2 |\n\n祝您使用愉快！'),
(1, '学习计划', '# 本周学习计划\n\n## 待完成任务\n- [ ] 复习Java基础\n- [ ] 完成Spring Boot项目\n- [ ] 学习Docker基础\n\n## 已完成任务\n- [x] 搭建开发环境\n- [x] 完成Git培训\n\n## 学习资源\n1. Spring Boot官方文档\n2. Docker入门教程\n3. Java核心技术视频\n\n## 时间安排\n| 时间 | 任务 |\n|------|------|\n| 上午 | Java基础 |\n| 下午 | Spring Boot |\n| 晚上 | Docker |\n\n## 注意事项\n1. 每天记录学习笔记\n2. 及时复习\n3. 做好时间管理');

SET FOREIGN_KEY_CHECKS = 1; 