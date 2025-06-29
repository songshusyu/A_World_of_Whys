-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhimiao_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE zhimiao_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建主题表
CREATE TABLE IF NOT EXISTS topics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建模块表
CREATE TABLE IF NOT EXISTS modules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    topic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- 创建章节表
CREATE TABLE IF NOT EXISTS chapters (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);

-- 创建课程表
CREATE TABLE IF NOT EXISTS lectures (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    chapter_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- 创建课程内容表
CREATE TABLE IF NOT EXISTS lecture_contents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lecture_id BIGINT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- 创建用户进度表
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    lecture_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    progress INT DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

-- 创建笔记表
CREATE TABLE IF NOT EXISTS notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入测试用户
INSERT INTO users (username, password, email) VALUES 
('test', '$2a$10$8/jkHf7vKk9yH0X6doE.8.Yk5vf8Ak9RlF9YwvQY.n0YuFnNX.Aqe', 'test@example.com');

-- 插入示例主题
INSERT INTO topics (name, description) VALUES 
('计算机基础', '计算机科学与技术的基础知识'),
('编程语言', '主流编程语言的学习');

-- 插入示例模块
INSERT INTO modules (topic_id, name, description, sequence) VALUES 
(1, '计算机组成原理', '了解计算机的基本组成和工作原理', 1),
(1, '操作系统', '学习操作系统的基本概念和原理', 2),
(2, 'Java基础', 'Java编程语言的基础知识', 1),
(2, 'Python入门', 'Python编程语言入门', 2);

-- 插入示例章节
INSERT INTO chapters (module_id, name, description, sequence) VALUES 
(1, '计算机硬件基础', '了解计算机硬件的基本组成', 1),
(1, 'CPU工作原理', '深入理解CPU的工作方式', 2),
(2, '进程管理', '学习操作系统的进程管理机制', 1),
(2, '内存管理', '理解操作系统的内存管理方式', 2);

-- 插入示例课程
INSERT INTO lectures (chapter_id, title, description, sequence) VALUES 
(1, '计算机硬件组成', '介绍计算机的主要硬件组成部分', 1),
(1, '输入输出设备', '学习计算机的输入输出设备', 2),
(2, 'CPU结构', '了解CPU的基本结构', 1),
(2, '指令执行过程', '学习CPU执行指令的过程', 2);

-- 插入示例课程内容
INSERT INTO lecture_contents (lecture_id, content_type, content) VALUES 
(1, 'TEXT', '计算机的主要硬件包括：CPU、内存、主板、硬盘等'),
(1, 'TEXT', '每个组件都有其特定的功能和作用'),
(2, 'TEXT', '输入设备包括键盘、鼠标等'),
(2, 'TEXT', '输出设备包括显示器、打印机等');

-- 插入示例用户进度
INSERT INTO user_progress (user_id, lecture_id, status, progress) VALUES 
(1, 1, 'COMPLETED', 100),
(1, 2, 'IN_PROGRESS', 50);

-- 插入示例笔记
INSERT INTO notes (user_id, title, content) VALUES 
(1, '计算机硬件笔记', '# 计算机硬件基础\n\n## 主要组成部分\n1. CPU\n2. 内存\n3. 主板\n4. 硬盘\n\n## 重要概念\n- 总线\n- 时钟频率\n- 缓存'),
(1, '学习计划', '# 本周学习计划\n\n- [ ] 完成计算机硬件章节\n- [ ] 复习CPU工作原理\n- [ ] 做课后练习'); 