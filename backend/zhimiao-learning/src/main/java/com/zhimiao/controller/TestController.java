package com.zhimiao.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "后端服务运行正常！";
    }

    @GetMapping("/test")
    public String test() {
        return "数据库连接测试 - 配置成功！";
    }
}