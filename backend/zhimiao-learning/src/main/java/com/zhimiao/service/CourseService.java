package com.zhimiao.service;

import com.zhimiao.model.Topic;
import com.zhimiao.model.Module;
import com.zhimiao.model.Chapter;
import com.zhimiao.model.Lecture;
import com.zhimiao.model.LectureContent;
import com.zhimiao.model.ContentType;
import com.zhimiao.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private LectureContentRepository lectureContentRepository;

    @Autowired
    private AIPromptService aiPromptService;

    @Autowired
    private QwenService qwenService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 清理AI响应中的非JSON内容
     */
    private String cleanJsonResponse(String response) {
        if (response == null || response.trim().isEmpty()) {
            throw new RuntimeException("AI响应为空");
        }

        // 查找JSON开始和结束位置
        int jsonStart = response.indexOf('{');
        int jsonEnd = response.lastIndexOf('}');

        if (jsonStart == -1 || jsonEnd == -1 || jsonStart >= jsonEnd) {
            throw new RuntimeException("AI响应中未找到有效的JSON格式: " + response);
        }

        return response.substring(jsonStart, jsonEnd + 1);
    }

    /**
     * 生成默认的主题版块（备用方案）
     */
    private List<Module> createDefaultModules(Topic topic) {
        String[] defaultTitles = { "基础理论", "实践应用", "深入分析", "前沿探索" };
        String[] defaultDescriptions = {
                "掌握基础概念和核心理论知识",
                "通过实际案例学习具体应用",
                "深入分析相关技术和方法",
                "探索最新发展和未来趋势"
        };
        String[] defaultIcons = { "book", "tools", "graph-up", "rocket" };

        for (int i = 0; i < 4; i++) {
            Module module = new Module(
                    defaultTitles[i],
                    defaultDescriptions[i],
                    defaultIcons[i],
                    i + 1);
            module.setTopic(topic);
            moduleRepository.save(module);
        }

        return moduleRepository.findByTopicIdOrderByOrderIndex(topic.getId());
    }

    /**
     * 生成默认的课程结构（备用方案）
     */
    private List<Chapter> createDefaultCourseStructure(Module module) {
        System.out.println("开始为模块 " + module.getId() + " 创建默认课程结构");

        String[] chapterTitles = { "第一章：基础入门", "第二章：核心概念", "第三章：实践应用", "第四章：高级技巧" };
        String[][] lectureTitles = {
                { "第1讲：基本介绍", "第2讲：历史发展", "第3讲：核心特点", "第4讲：应用领域", "第5讲：学习方法" },
                { "第1讲：基本原理", "第2讲：重要概念", "第3讲：理论基础", "第4讲：关键技术", "第5讲：系统架构" },
                { "第1讲：实际案例", "第2讲：项目实战", "第3讲：问题解决", "第4讲：最佳实践", "第5讲：经验总结" },
                { "第1讲：高级特性", "第2讲：性能优化", "第3讲：扩展应用", "第4讲：前沿趋势", "第5讲：未来发展" }
        };

        List<Chapter> createdChapters = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            Chapter chapter = new Chapter(chapterTitles[i], i + 1, i + 1);
            chapter.setModule(module);
            chapter = chapterRepository.save(chapter);
            System.out.println("创建章节: " + chapter.getTitle() + " (ID: " + chapter.getId() + ")");

            List<Lecture> chapterLectures = new ArrayList<>();
            for (int j = 0; j < 5; j++) {
                Lecture lecture = new Lecture(lectureTitles[i][j], j + 1, j + 1);
                lecture.setChapter(chapter);
                lecture = lectureRepository.save(lecture);
                chapterLectures.add(lecture);
                System.out.println("  创建讲次: " + lecture.getTitle() + " (ID: " + lecture.getId() + ")");
            }

            // 手动设置讲次列表，确保数据完整
            chapter.setLectures(chapterLectures);
            createdChapters.add(chapter);
        }

        System.out.println("默认课程结构创建完成，共创建 " + createdChapters.size() + " 个章节");

        // 再次查询确保获取完整数据
        List<Chapter> finalChapters = chapterRepository.findByModuleIdWithLectures(module.getId());
        System.out.println("最终查询到 " + finalChapters.size() + " 个章节");
        for (Chapter chapter : finalChapters) {
            System.out.println("章节: " + chapter.getTitle() + ", 讲次数量: " +
                    (chapter.getLectures() != null ? chapter.getLectures().size() : "null"));
        }

        return finalChapters;
    }

    /**
     * 获取或创建主题的4个版块
     */
    public List<Module> getTopicModules(String topicName) throws Exception {
        // 1. 查找或创建主题
        Topic topic = topicRepository.findByName(topicName)
                .orElseGet(() -> {
                    Topic newTopic = new Topic(topicName, "AI生成的" + topicName + "学习主题");
                    return topicRepository.save(newTopic);
                });

        // 2. 检查是否已有版块
        List<Module> existingModules = moduleRepository.findByTopicIdOrderByOrderIndex(topic.getId());
        if (!existingModules.isEmpty()) {
            return existingModules;
        }

        // 3. 通过AI生成版块
        try {
            String prompt = aiPromptService.generateTopicModulesPrompt(topicName);
            String aiResponse = qwenService.generateContent(prompt);

            System.out.println("AI响应原文: " + aiResponse);

            // 4. 解析AI响应并保存
            // 尝试清理响应中的非JSON内容
            String cleanedResponse = cleanJsonResponse(aiResponse);
            System.out.println("清理后的响应: " + cleanedResponse);

            JsonNode moduleData = objectMapper.readTree(cleanedResponse);
            JsonNode modulesArray = moduleData.get("modules");

            if (modulesArray != null && modulesArray.isArray() && modulesArray.size() == 4) {
                for (int i = 0; i < modulesArray.size(); i++) {
                    JsonNode moduleNode = modulesArray.get(i);
                    Module module = new Module(
                            moduleNode.get("title").asText(),
                            moduleNode.get("description").asText(),
                            moduleNode.get("icon").asText(),
                            i + 1);
                    module.setTopic(topic);
                    moduleRepository.save(module);
                }
                return moduleRepository.findByTopicIdOrderByOrderIndex(topic.getId());
            } else {
                System.out.println("AI响应格式不正确，使用默认版块");
                return createDefaultModules(topic);
            }
        } catch (Exception e) {
            System.out.println("AI生成失败，使用默认版块: " + e.getMessage());
            return createDefaultModules(topic);
        }
    }

    /**
     * 获取或创建版块的4章5讲结构
     */
    public List<Chapter> getCourseStructure(Long moduleId) throws Exception {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("版块不存在"));

        // 1. 检查是否已有章节
        List<Chapter> existingChapters = chapterRepository.findByModuleIdWithLectures(moduleId);
        if (!existingChapters.isEmpty()) {
            return existingChapters;
        }

        // 2. 通过AI生成课程结构
        try {
            String prompt = aiPromptService.generateCourseStructurePrompt(
                    module.getTopic().getName(),
                    module.getTitle());
            String aiResponse = qwenService.generateContent(prompt);

            System.out.println("课程结构AI响应原文: " + aiResponse);

            // 3. 解析AI响应并保存
            String cleanedResponse = cleanJsonResponse(aiResponse);
            System.out.println("课程结构清理后响应: " + cleanedResponse);

            JsonNode structureData = objectMapper.readTree(cleanedResponse);
            JsonNode chaptersArray = structureData.get("chapters");

            if (chaptersArray != null && chaptersArray.isArray() && chaptersArray.size() == 4) {
                System.out.println("AI生成课程结构成功，开始保存数据");

                for (int i = 0; i < chaptersArray.size(); i++) {
                    JsonNode chapterNode = chaptersArray.get(i);
                    Chapter chapter = new Chapter(
                            chapterNode.get("title").asText(),
                            i + 1,
                            i + 1);
                    chapter.setModule(module);
                    chapter = chapterRepository.save(chapter);
                    System.out.println("AI创建章节: " + chapter.getTitle() + " (ID: " + chapter.getId() + ")");

                    // 创建讲次
                    JsonNode lecturesArray = chapterNode.get("lectures");
                    if (lecturesArray != null && lecturesArray.isArray()) {
                        List<Lecture> chapterLectures = new ArrayList<>();
                        for (int j = 0; j < lecturesArray.size(); j++) {
                            JsonNode lectureNode = lecturesArray.get(j);
                            Lecture lecture = new Lecture(
                                    lectureNode.get("title").asText(),
                                    j + 1,
                                    j + 1);
                            lecture.setChapter(chapter);
                            lecture = lectureRepository.save(lecture);
                            chapterLectures.add(lecture);
                            System.out.println("  AI创建讲次: " + lecture.getTitle() + " (ID: " + lecture.getId() + ")");
                        }
                        // 手动设置讲次列表
                        chapter.setLectures(chapterLectures);
                    }
                }

                // 再次查询确保获取完整数据
                List<Chapter> finalChapters = chapterRepository.findByModuleIdWithLectures(moduleId);
                System.out.println("AI生成结构最终查询到 " + finalChapters.size() + " 个章节");
                for (Chapter chapter : finalChapters) {
                    System.out.println("AI章节: " + chapter.getTitle() + ", 讲次数量: " +
                            (chapter.getLectures() != null ? chapter.getLectures().size() : "null"));
                }

                return finalChapters;
            } else {
                System.out.println("AI课程结构响应格式不正确，使用默认结构");
                return createDefaultCourseStructure(module);
            }
        } catch (Exception e) {
            System.out.println("AI生成课程结构失败，使用默认结构: " + e.getMessage());
            return createDefaultCourseStructure(module);
        }
    }

    /**
     * 获取或创建讲次的四种内容
     */
    public String getLectureContent(Long lectureId, ContentType contentType) throws Exception {
        // 1. 检查是否已有内容
        Optional<LectureContent> existingContent = lectureContentRepository
                .findByLectureIdAndType(lectureId, contentType);
        if (existingContent.isPresent()) {
            return existingContent.get().getContent();
        }

        // 2. 获取讲次信息
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new RuntimeException("讲次不存在"));

        Chapter chapter = lecture.getChapter();
        Module module = chapter.getModule();
        Topic topic = module.getTopic();

        // 3. 通过AI生成内容
        String prompt = aiPromptService.generateLectureContentPrompt(
                topic.getName(),
                module.getTitle(),
                chapter.getTitle(),
                lecture.getTitle(),
                contentType.name().toLowerCase());

        String aiResponse = qwenService.generateContent(prompt);

        // 4. 保存内容
        LectureContent lectureContent = new LectureContent(contentType, aiResponse);
        lectureContent.setLecture(lecture);
        lectureContentRepository.save(lectureContent);

        return aiResponse;
    }
}
