package com.zhimiao.service;

import org.springframework.stereotype.Service;

@Service
public class AIPromptService {

    /**
     * 生成主题分解的提示词
     */
    public String generateTopicModulesPrompt(String topic) {
        return String.format("""
                请将"%s"这个主题分解为4个不同的学习版块，每个版块都要有独特的学习角度。

                要求：
                1. 返回严格的JSON格式，不要任何额外的文字说明
                2. 每个版块包含title（标题）、description（描述）、icon（图标名）
                3. 4个版块要涵盖：基础理论、实践应用、深入分析、前沿探索等不同维度
                4. description要简洁明了，40字以内
                5. icon使用Bootstrap图标名称（如"book", "tools", "graph-up", "rocket"）

                JSON格式示例：
                {
                  "modules": [
                    {
                      "title": "版块标题",
                      "description": "版块描述",
                      "icon": "book"
                    }
                  ]
                }
                """, topic);
    }

    /**
     * 生成课程结构的提示词
     */
    public String generateCourseStructurePrompt(String topic, String moduleTitle) {
        return String.format("""
                请为"%s"主题下的"%s"版块设计4章5讲的课程结构。

                要求：
                1. 返回严格的JSON格式，不要任何额外的文字说明
                2. 必须是4个章节，每个章节包含5个讲次
                3. 章节要循序渐进，从基础到高级
                4. 每个讲次标题要简洁明确，20字以内
                5. 章节和讲次都要有明确的学习目标

                JSON格式示例：
                {
                  "chapters": [
                    {
                      "title": "第一章：章节标题",
                      "lectures": [
                        {"title": "第1讲：讲次标题"},
                        {"title": "第2讲：讲次标题"},
                        {"title": "第3讲：讲次标题"},
                        {"title": "第4讲：讲次标题"},
                        {"title": "第5讲：讲次标题"}
                      ]
                    }
                  ]
                }
                """, topic, moduleTitle);
    }

    /**
     * 生成讲次内容的提示词
     */
    public String generateLectureContentPrompt(String topic, String moduleTitle,
            String chapterTitle, String lectureTitle,
            String contentType) {
        String typeDescription = switch (contentType.toLowerCase()) {
            case "course" -> "完整的课程教学内容，包含详细解释、示例和要点总结";
            case "simplified" -> "适合初学者的简化版内容，用通俗易懂的语言解释核心概念";
            case "test" -> "知识点测试题目，包含选择题、判断题或简答题，附带答案解析";
            case "advanced" -> "高级内容和扩展知识，深入探讨相关理论和前沿发展";
            default -> "标准课程内容";
        };

        return String.format("""
                请为以下课程生成%s：

                主题：%s
                版块：%s
                章节：%s
                讲次：%s

                内容类型：%s

                要求：
                1. 返回Markdown格式的内容，结构清晰
                2. 内容要丰富详实，符合该讲次的学习目标
                3. 如果是测试内容，要包含题目和标准答案
                4. 如果是简化内容，要用简单易懂的语言
                5. 如果是高级内容，要有深度和广度
                6. 内容长度适中，大约800-1500字

                直接返回Markdown内容，不要JSON包装：
                """, typeDescription, topic, moduleTitle, chapterTitle, lectureTitle, typeDescription);
    }
}