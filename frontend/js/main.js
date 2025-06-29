// A World of Whys - 主要JavaScript功能

class WhysApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeMessage();
    }

    bindEvents() {
        // 搜索功能
        const searchInput = document.getElementById('mainSearchInput');
        const searchBtn = document.getElementById('mainSearchBtn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value.trim() : '';
                if (query) {
                    // 跳转到主题版块页面
                    window.location.href = `pages/topic-modules.html?topic=${encodeURIComponent(query)}`;
                } else {
                    this.showMessage('请输入您想学习的主题', 'warning');
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        // 跳转到主题版块页面
                        window.location.href = `pages/topic-modules.html?topic=${encodeURIComponent(query)}`;
                    } else {
                        this.showMessage('请输入您想学习的主题', 'warning');
                    }
                }
            });

            // 输入提示
            searchInput.addEventListener('focus', () => {
                this.showSearchTips();
            });
        }

        // 主题点击事件
        const topicItems = document.querySelectorAll('.topic-item');
        topicItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const topic = item.getAttribute('data-topic');
                this.handleTopicClick(event, topic);
            });
        });

        // 导航链接点击事件
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('pages/')) {
                    e.preventDefault();
                    this.showComingSoon(link.textContent);
                }
            });
        });
    }
    /**
     * 处理搜索请求
     * @param {string} query - 搜索查询
     */
    async handleSearch(query) {
        if (!query || query.trim() === '') {
            this.showMessage('请输入您的问题', 'warning');
            return;
        }

        const trimmedQuery = query.trim();
        console.log('开始搜索:', trimmedQuery);

        // 显示加载状态
        this.showLoading(true);
        this.showMessage('正在思考您的问题...', 'info');

        try {
            // 调用API获取答案
            const result = await apiService.askQuestion(trimmedQuery);
            
            if (result.success) {
                // 成功获取答案
                this.showMessage('获取答案成功！', 'success');
                this.displayAnswer(result.data, trimmedQuery);
            } else {
                // API调用失败
                const errorMsg = apiService.handleError(result);
                this.showMessage(errorMsg, 'danger');
                console.error('API调用失败:', result);
            }
        } catch (error) {
            // 意外错误
            console.error('搜索过程中发生错误:', error);
            this.showMessage('搜索过程中发生意外错误，请稍后重试', 'danger');
        } finally {
            // 隐藏加载状态
            this.showLoading(false);
        }
    }

    /**
     * 显示答案内容
     * @param {Object} data - API返回的数据
     * @param {string} question - 原始问题
     */
    displayAnswer(data, question) {
        // 创建答案显示区域
        let answerSection = document.getElementById('answerSection');
        
        if (!answerSection) {
            answerSection = document.createElement('section');
            answerSection.id = 'answerSection';
            answerSection.className = 'answer-section mt-5';
            
            // 插入到搜索区域后面
            const searchSection = document.querySelector('.search-section');
            searchSection.parentNode.insertBefore(answerSection, searchSection.nextSibling);
        }

        // 构建答案HTML
        answerSection.innerHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="answer-card">
                            <div class="answer-header">
                                <h3><i class="bi bi-chat-dots-fill"></i> 您的问题</h3>
                                <p class="question-text">${this.escapeHtml(question)}</p>
                            </div>
                            <div class="answer-content">
                                <h4><i class="bi bi-robot"></i> AI助手回答</h4>
                                <div class="answer-text">
                                    ${this.formatAnswer(data)}
                                </div>
                            </div>
                            <div class="answer-actions">
                                <button class="btn btn-outline-primary btn-sm" onclick="whysApp.copyAnswer()">
                                    <i class="bi bi-clipboard"></i> 复制答案
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="whysApp.newSearch()">
                                    <i class="bi bi-arrow-clockwise"></i> 新的搜索
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 滚动到答案区域
        answerSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * 格式化答案内容
     * @param {Object} data - API返回的数据
     * @returns {string} 格式化后的HTML
     */
    formatAnswer(data) {
        let text = '';
        
        // 根据后端返回的数据结构进行格式化
        if (typeof data === 'string') {
            text = data;
        } else if (data && data.answer) {
            text = data.answer;
        } else if (data && data.content) {
            text = data.content;
        } else {
            text = JSON.stringify(data);
        }
        
        // 处理Markdown格式并转换为HTML
        return this.parseMarkdown(text);
    }

    /**
     * 简单的Markdown解析器
     * @param {string} text - Markdown文本
     * @returns {string} HTML格式的文本
     */
    parseMarkdown(text) {
        if (!text) return '';
        
        // 转义基本HTML字符，但保留换行
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // 处理各种Markdown语法
        html = html
            // 标题（# ## ###）
            .replace(/^### (.*$)/gm, '<h5>$1</h5>')
            .replace(/^## (.*$)/gm, '<h4>$1</h4>')
            .replace(/^# (.*$)/gm, '<h3>$1</h3>')
            
            // 粗体 **text** 或 __text__
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            
            // 斜体 *text* 或 _text_
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            
            // 代码块 ```code```
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            
            // 行内代码 `code`
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            
            // 链接 [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            
            // 无序列表项（以 - 或 * 开头）
            .replace(/^[\s]*[-*]\s+(.+)$/gm, '<li>$1</li>')
            
            // 有序列表项（以数字开头）
            .replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>')
            
            // 分割线
            .replace(/^[\s]*---[\s]*$/gm, '<hr>')
            .replace(/^[\s]*\*\*\*[\s]*$/gm, '<hr>')
            
            // 换行处理
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // 包装列表项
        html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
            // 检查是否是有序列表（包含数字）
            const isOrdered = /^\d+\./.test(text.match(/^\s*\d+\.\s+/m)?.[0] || '');
            const listTag = isOrdered ? 'ol' : 'ul';
            return `<${listTag}>${match}</${listTag}>`;
        });

        // 包装段落
        if (!html.includes('<p>') && !html.includes('<h') && !html.includes('<ul>') && !html.includes('<ol>')) {
            html = `<p>${html}</p>`;
        } else if (!html.startsWith('<')) {
            html = `<p>${html}`;
        }
        if (!html.endsWith('</p>') && !html.endsWith('>')) {
            html = `${html}</p>`;
        }

        return html;
    }

    /**
     * HTML转义
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 复制答案到剪贴板
     */
    async copyAnswer() {
        const answerText = document.querySelector('.answer-text');
        if (answerText) {
            try {
                await navigator.clipboard.writeText(answerText.textContent);
                this.showMessage('答案已复制到剪贴板', 'success');
            } catch (error) {
                console.error('复制失败:', error);
                this.showMessage('复制失败，请手动选择文本复制', 'warning');
            }
        }
    }

    /**
     * 开始新的搜索
     */
    newSearch() {
        // 清空搜索框
        const searchInput = document.getElementById('mainSearchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }

        // 隐藏答案区域
        const answerSection = document.getElementById('answerSection');
        if (answerSection) {
            answerSection.style.display = 'none';
        }

        this.showMessage('请输入新的问题', 'info');
    }

    /**
     * 显示/隐藏加载状态
     * @param {boolean} show - 是否显示加载状态
     */
    showLoading(show) {
        const searchBtn = document.getElementById('mainSearchBtn');
        const searchInput = document.getElementById('mainSearchInput');
        
        if (show) {
            searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>思考中...';
            searchBtn.disabled = true;
            searchInput.disabled = true;
        } else {
            searchBtn.innerHTML = '<i class="bi bi-search"></i> 开始学习';
            searchBtn.disabled = false;
            searchInput.disabled = false;
        }
    }

    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, danger, info)
     */
    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMessage = document.querySelector('.alert-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建新的消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show alert-message`;
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // 插入到搜索区域前面
        const searchSection = document.querySelector('.search-section');
        searchSection.parentNode.insertBefore(messageDiv, searchSection);

        // 5秒后自动移除
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    handleTopicClick(event, topic) {
        // 添加点击效果
        if (event && event.currentTarget) {
            const element = event.currentTarget;
            element.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (element && element.style) {
                    element.style.transform = '';
                }
                // 跳转到主题版块页面
                window.location.href = `pages/topic-modules.html?topic=${encodeURIComponent(topic)}`;
            }, 150);
        } else {
            // 直接跳转
            window.location.href = `pages/topic-modules.html?topic=${encodeURIComponent(topic)}`;
        }
    }

    showSearchLoading() {
        const searchBtn = document.getElementById('mainSearchBtn');
        const originalText = searchBtn.innerHTML;
        
        searchBtn.innerHTML = '<span class="loading-spinner"></span> 搜索中...';
        searchBtn.disabled = true;

        // 恢复按钮状态
        setTimeout(() => {
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
        }, 1000);
    }

    redirectToAsk(question) {
        // 这里将来会跳转到问答页面
        // 现在先显示一个提示
        this.showAlert(`正在为您搜索: "${question}"`, 'info');
        console.log('搜索问题:', question);
    }

    showSearchTips() {
        const tips = [
            '💡 试试问: "什么是人工智能?"',
            '🔍 试试问: "如何学习编程?"',
            '🌟 试试问: "宇宙有多大?"',
            '📚 试试问: "历史上最重要的发明是什么?"'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const searchInput = document.getElementById('mainSearchInput');
        
        if (searchInput.placeholder === '请输入你的问题...') {
            searchInput.placeholder = randomTip;
            
            setTimeout(() => {
                searchInput.placeholder = '请输入你的问题...';
            }, 3000);
        }
    }

    showAlert(message, type = 'info') {
        // 创建提示框
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // 自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    showComingSoon(feature) {
        this.showAlert(`${feature} 功能即将上线，敬请期待！`, 'info');
    }

    showWelcomeMessage() {
        console.log('🐱 欢迎来到 A World of Whys!');
        console.log('🚀 新一代交互式知识学习引擎已启动');
        
        // 检查是否是首次访问
        if (!localStorage.getItem('whys_visited')) {
            setTimeout(() => {
                this.showAlert('欢迎来到 A World of Whys! 🎉', 'success');
                localStorage.setItem('whys_visited', 'true');
            }, 1000);
        }
    }
}

// 页面加载完成后初始化应用
let whysApp;
document.addEventListener('DOMContentLoaded', () => {
    whysApp = new WhysApp();
});

// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});