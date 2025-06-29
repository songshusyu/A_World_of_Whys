package com.zhimiao.controller;

import com.zhimiao.service.QwenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/course")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private QwenService qwenService;

    /**
     * AI聊天接口
     * 
     * @param request 包含消息内容和讲次ID的请求体
     * @return AI回复
     */
    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        try {
            String message = (String) request.get("message");
            Object lectureIdObj = request.get("lectureId");

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("消息内容不能为空"));
            }

            // 构建AI提示词，加入学习助手的角色设定
            String prompt = buildChatPrompt(message, lectureIdObj);

            // 调用AI服务
            String aiResponse = qwenService.generateContent(prompt);

            // 检查AI响应是否包含错误信息
            if (aiResponse.contains("API调用失败") || aiResponse.contains("处理请求时发生错误")) {
                return ResponseEntity.status(503)
                        .body(createErrorResponse("AI服务暂时不可用，请稍后再试"));
            }

            // 返回成功响应
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reply", aiResponse);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("ChatController.chat error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(createErrorResponse("服务器内部错误"));
        }
    }

    /**
     * 构建聊天提示词
     */
    private String buildChatPrompt(String userMessage, Object lectureId) {
        StringBuilder prompt = new StringBuilder();

        // AI助手角色设定
        prompt.append("你是智喵学堂的AI学习助手，专门帮助学生深入理解课程内容。");
        prompt.append("请根据用户的问题，提供详细、准确、有教育意义的回答。");
        prompt.append("回答风格要友好、专业，适合学习者的水平。");

        // 如果有讲次ID，添加上下文信息
        if (lectureId != null) {
            prompt.append("用户正在学习讲次ID为 ").append(lectureId).append(" 的课程内容。");
        }

        prompt.append("\n\n用户问题：").append(userMessage);

        // 添加回答指引
        prompt.append("\n\n请提供：");
        prompt.append("1. 直接回答用户的问题");
        prompt.append("2. 如果合适，提供相关的例子或应用场景");
        prompt.append("3. 必要时给出进一步学习的建议");
        prompt.append("4. 保持回答的条理性和易懂性");

        return prompt.toString();
    }

    /**
     * 创建错误响应
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    /**
     * 健康检查接口
     */
    @GetMapping("/ai/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            String status = qwenService.checkApiStatus();

            Map<String, Object> response = new HashMap<>();
            response.put("status", status.contains("正常") ? "healthy" : "unhealthy");
            response.put("details", status);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "unhealthy");
            response.put("details", "健康检查失败: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.status(503).body(response);
        }
    }
}