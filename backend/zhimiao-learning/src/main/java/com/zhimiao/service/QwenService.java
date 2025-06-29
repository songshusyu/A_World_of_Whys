package com.zhimiao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import reactor.core.publisher.Mono;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class QwenService {

    @Value("${qwen.api.key}")
    private String apiKey;

    @Value("${qwen.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public QwenService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 调用通义千问API生成内容
     * 
     * @param prompt 用户输入的提示词
     * @return API响应结果
     */
    public String generateContent(String prompt) {
        try {
            // 构建请求体
            Map<String, Object> requestBody = buildRequestBody(prompt);

            // 发送请求并获取响应
            String response = webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("User-Agent", "zhimiao-learning/1.0")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 解析响应
            return parseResponse(response);

        } catch (WebClientResponseException e) {
            String errorBody = "";
            try {
                errorBody = e.getResponseBodyAsString();
            } catch (Exception ex) {
                errorBody = "无法获取错误详情";
            }
            return "API调用失败: " + e.getMessage() + " (状态码: " + e.getStatusCode() + ") 错误详情: " + errorBody;
        } catch (Exception e) {
            return "处理请求时发生错误: " + e.getMessage();
        }
    }

    /**
     * 构建通义千问API请求体
     */
    private Map<String, Object> buildRequestBody(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();

            // 设置模型
            requestBody.put("model", "qwen-max");

            // 构建消息列表
            List<Map<String, String>> messages = new ArrayList<>();

            // 系统消息
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "你是智喵学堂的AI助手，专门帮助用户学习各种知识。请用中文回答问题，提供详细、准确、有用的解答。");
            messages.add(systemMessage);

            // 用户消息
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);

            requestBody.put("messages", messages);

            // 设置参数
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);
            requestBody.put("stream", false);
            requestBody.put("enable_thinking", false);

            return requestBody;

        } catch (Exception e) {
            throw new RuntimeException("构建请求体失败", e);
        }
    }

    /**
     * 解析通义千问API响应
     */
    private String parseResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);

            // 检查是否有错误
            if (jsonNode.has("error")) {
                JsonNode error = jsonNode.get("error");
                String errorMessage = error.has("message") ? error.get("message").asText() : "未知错误";
                String errorType = error.has("type") ? error.get("type").asText() : "unknown";
                return "API返回错误: " + errorType + " - " + errorMessage;
            }

            // 解析正常响应
            JsonNode choices = jsonNode.get("choices");
            if (choices != null && choices.isArray() && choices.size() > 0) {
                JsonNode firstChoice = choices.get(0);
                JsonNode message = firstChoice.get("message");
                if (message != null) {
                    JsonNode content = message.get("content");
                    if (content != null) {
                        return content.asText();
                    }
                }
            }

            return "API响应格式异常: " + response;

        } catch (Exception e) {
            return "解析响应失败: " + e.getMessage() + " 原始响应: " + response;
        }
    }

    /**
     * 测试API连接
     */
    public String testConnection() {
        return generateContent("你好，我是智喵学堂的用户，请确认你是通义千问模型，并简单介绍一下你的能力。");
    }

    /**
     * 获取当前使用的模型信息
     */
    public String getModelInfo() {
        return "当前使用模型: qwen-max (通义千问最强版本)";
    }

    /**
     * 生成学习内容
     * 
     * @param topic 学习主题
     * @return 学习内容
     */
    public String generateLearningContent(String topic) {
        String prompt = "作为智喵学堂的AI助手，请为用户详细介绍以下学习主题：" + topic +
                "。请提供：1. 基本概念解释 2. 核心要点 3. 实际应用 4. 学习建议。请用中文回答，内容要准确、易懂、有条理。";
        return generateContent(prompt);
    }

    /**
     * 检查API状态
     */
    public String checkApiStatus() {
        try {
            String testResponse = generateContent("测试");
            if (testResponse.contains("API调用失败") || testResponse.contains("处理请求时发生错误")) {
                return "API状态: 异常 - " + testResponse;
            } else {
                return "API状态: 正常";
            }
        } catch (Exception e) {
            return "API状态: 异常 - " + e.getMessage();
        }
    }
}