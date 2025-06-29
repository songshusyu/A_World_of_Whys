package com.zhimiao.controller;

import com.zhimiao.model.Module;
import com.zhimiao.model.Chapter;
import com.zhimiao.model.ContentType;
import com.zhimiao.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/course")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    /**
     * 获取主题的4个版块
     * GET /api/course/topic-modules?topic=机器学习
     */
    @GetMapping("/topic-modules")
    public ResponseEntity<?> getTopicModules(@RequestParam String topic) {
        try {
            List<Module> modules = courseService.getTopicModules(topic);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", modules,
                    "message", "获取主题版块成功"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "获取主题版块失败: " + e.getMessage()));
        }
    }

    /**
     * 获取版块的4章5讲课程结构
     * GET /api/course/course-structure?moduleId=1
     */
    @GetMapping("/course-structure")
    public ResponseEntity<?> getCourseStructure(@RequestParam Long moduleId) {
        try {
            List<Chapter> chapters = courseService.getCourseStructure(moduleId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", chapters,
                    "message", "获取课程结构成功"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "获取课程结构失败: " + e.getMessage()));
        }
    }

    /**
     * 获取讲次的特定类型内容
     * GET /api/course/lecture-content?lectureId=1&type=COURSE
     */
    @GetMapping("/lecture-content")
    public ResponseEntity<?> getLectureContent(
            @RequestParam Long lectureId,
            @RequestParam String type) {
        try {
            ContentType contentType = ContentType.valueOf(type.toUpperCase());
            String content = courseService.getLectureContent(lectureId, contentType);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of(
                            "content", content,
                            "type", contentType.getDisplayName()),
                    "message", "获取讲次内容成功"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "无效的内容类型: " + type));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "获取讲次内容失败: " + e.getMessage()));
        }
    }
}
