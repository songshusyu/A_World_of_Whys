
package com.zhimiao.model;

public enum ContentType {
    COURSE("课程内容"),
    SIMPLIFIED("简化版"),
    TEST("测试"),
    ADVANCED("深入探索");

    private final String displayName;

    ContentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
