/**
 * API服务类 - 处理与后端的所有通信
 * A World of Whys - 十万个为什么
 */
class ApiService {
    constructor() {
        // API基础配置
        this.baseURL = 'http://localhost:8080';
        this.timeout = 30000; // 30秒超时
        this.isLoading = false;
        
        // 默认请求头
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        console.log('ApiService initialized');
    }

    /**
     * 通用HTTP请求方法
     * @param {string} endpoint - API端点
     * @param {Object} options - 请求选项
     * @returns {Promise} 请求结果
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // 合并默认配置
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders },
            ...options
        };
        
        // 设置超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        config.signal = controller.signal;
        
        try {
            console.log(`API请求: ${config.method} ${url}`);
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // 解析响应数据
            const data = await response.json();
            console.log('API响应:', data);
            
            return {
                success: true,
                data: data,
                status: response.status
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API请求失败:', error);
            
            return {
                success: false,
                error: error.message,
                type: this.getErrorType(error)
            };
        }
    }

    /**
     * 获取错误类型
     * @param {Error} error - 错误对象
     * @returns {string} 错误类型
     */
    getErrorType(error) {
        if (error.name === 'AbortError') return 'timeout';
        if (error.message.includes('Failed to fetch')) return 'network';
        if (error.message.includes('HTTP')) return 'server';
        return 'unknown';
    }

    /**
     * 统一错误处理方法
     * @param {Object} errorResult - 错误结果对象
     * @returns {string} 用户友好的错误消息
     */
    handleError(errorResult) {
        const { error, type } = errorResult;
        
        switch (type) {
            case 'timeout':
                return '请求超时，请检查网络连接后重试';
            case 'network':
                return '网络连接失败，请检查网络设置';
            case 'server':
                return `服务器错误：${error}`;
            default:
                return `未知错误：${error}`;
        }
    }

    /**
     * 设置加载状态
     * @param {boolean} loading - 是否加载中
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        // 触发加载状态变化事件
        const event = new CustomEvent('apiLoadingChange', {
            detail: { isLoading: loading }
        });
        document.dispatchEvent(event);
    }

    /**
     * 检查后端API状态
     * @returns {Promise} API状态结果
     */
    async checkApiStatus() {
        this.setLoading(true);
        
        try {
            const result = await this.request('/api/status');
            return result;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 测试通义千问连接
     * @returns {Promise} 连接测试结果
     */
    async testQwenConnection() {
        this.setLoading(true);
        
        try {
            const result = await this.request('/api/test-qwen');
            return result;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 发送问题获取AI答案
     * @param {string} question - 用户问题
     * @returns {Promise} 问答结果
     */
    async askQuestion(question) {
        if (!question || question.trim() === '') {
            return {
                success: false,
                error: '问题不能为空',
                type: 'validation'
            };
        }

        // 防重复提交
        if (this.isLoading) {
            return {
                success: false,
                error: '请等待当前请求完成',
                type: 'duplicate'
            };
        }

        this.setLoading(true);
        
        try {
            const encodedQuestion = encodeURIComponent(question.trim());
            const result = await this.request(`/api/ask?q=${encodedQuestion}`);
            return result;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 获取AI模型信息
     * @returns {Promise} 模型信息结果
     */
    async getModelInfo() {
        this.setLoading(true);
        
        try {
            const result = await this.request('/api/model-info');
            return result;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 生成学习内容
     * @param {string} topic - 学习主题
     * @returns {Promise} 学习内容结果
     */
    async generateLearningContent(topic) {
        if (!topic || topic.trim() === '') {
            return {
                success: false,
                error: '学习主题不能为空',
                type: 'validation'
            };
        }

        // 防重复提交
        if (this.isLoading) {
            return {
                success: false,
                error: '请等待当前请求完成',
                type: 'duplicate'
            };
        }

        this.setLoading(true);
        
        try {
            const encodedTopic = encodeURIComponent(topic.trim());
            const result = await this.request(`/api/learn?topic=${encodedTopic}`);
            return result;
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 批量测试所有API端点
     * @returns {Promise} 测试结果
     */
    async testAllEndpoints() {
        console.log('开始测试所有API端点...');
        
        const tests = [
            { name: 'API状态检查', method: () => this.checkApiStatus() },
            { name: '通义千问连接测试', method: () => this.testQwenConnection() },
            { name: '模型信息获取', method: () => this.getModelInfo() }
        ];
        
        const results = [];
        
        for (const test of tests) {
            try {
                console.log(`测试: ${test.name}`);
                const result = await test.method();
                results.push({
                    name: test.name,
                    success: result.success,
                    data: result.success ? result.data : result.error
                });
            } catch (error) {
                results.push({
                    name: test.name,
                    success: false,
                    data: error.message
                });
            }
        }
        
        console.log('API测试完成:', results);
        return results;
    }
}

// 创建全局ApiService实例
const apiService = new ApiService();

// 监听加载状态变化
document.addEventListener('apiLoadingChange', (event) => {
    const { isLoading } = event.detail;
    console.log('API加载状态:', isLoading ? '加载中...' : '完成');
    
    // 可以在这里更新UI加载指示器
    const loadingElements = document.querySelectorAll('.api-loading');
    loadingElements.forEach(element => {
        element.style.display = isLoading ? 'block' : 'none';
    });
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, apiService };
}

console.log('API模块加载完成');