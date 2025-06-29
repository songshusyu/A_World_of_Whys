package com.zhimiao.controller;

import com.zhimiao.service.QwenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApiTestController {

    @Autowired
    private QwenService qwenService;

    /**
     * 检查API状态 - 返回JSON格式
     */
    @GetMapping("/api/status")
    public ResponseEntity<Map<String, Object>> checkApiStatus() {
        try {
            String status = qwenService.checkApiStatus();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", status);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "检查API状态时发生错误: " + e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 测试通义千问API连接 - 返回JSON格式
     */
    @GetMapping("/api/test-qwen")
    public ResponseEntity<Map<String, Object>> testQwen() {
        try {
            String result = qwenService.testConnection();
            Map<String, Object> response = new HashMap<>();

            if (result.contains("API调用失败") || result.contains("处理请求时发生错误")) {
                response.put("success", false);
                response.put("error", result);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            response.put("success", true);
            response.put("message", "通义千问API测试成功！");
            response.put("model_response", result);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "测试API时发生错误: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 通过URL参数发送问题到通义千问API - 返回JSON格式
     */
    @GetMapping("/api/ask")
    public ResponseEntity<Map<String, Object>> askQuestion(@RequestParam String q) {
        try {
            if (q == null || q.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "问题参数不能为空");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String answer = qwenService.generateContent(q);
            Map<String, Object> response = new HashMap<>();

            if (answer.contains("API调用失败") || answer.contains("处理请求时发生错误")) {
                response.put("success", false);
                response.put("error", answer);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            response.put("success", true);
            response.put("answer", answer);
            response.put("question", q);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "处理问题时发生错误: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 通过POST请求发送问题到通义千问API
     */
    @PostMapping("/api/ask")
    public ResponseEntity<String> askQuestionPost(@RequestBody String question) {
        try {
            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("请提供有效的问题");
            }

            String answer = qwenService.generateContent(question.trim());
            if (answer.contains("API调用失败") || answer.contains("处理请求时发生错误")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(answer);
            }
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("处理问题时发生错误: " + e.getMessage());
        }
    }

    /**
     * 获取模型信息
     */
    @GetMapping("/api/model-info")
    public ResponseEntity<String> getModelInfo() {
        try {
            String info = qwenService.getModelInfo();
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("获取模型信息时发生错误: " + e.getMessage());
        }
    }

    /**
     * 生成学习内容
     */
    @GetMapping("/api/learn")
    public ResponseEntity<String> generateLearningContent(@RequestParam String topic) {
        try {
            if (topic == null || topic.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("学习主题参数不能为空");
            }

            String content = qwenService.generateLearningContent(topic);
            if (content.contains("API调用失败") || content.contains("处理请求时发生错误")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(content);
            }
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("生成学习内容时发生错误: " + e.getMessage());
        }
    }
}