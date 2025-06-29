// A World of Whys - 主要JavaScript功能

class WhysApp {
    constructor() {
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
    }

    handleTopicClick(event, topic) {
        event.preventDefault();
        window.location.href = `pages/topic-modules.html?topic=${encodeURIComponent(topic)}`;
    }

    showSearchTips() {
        const searchTips = document.getElementById('searchTips');
        if (searchTips) {
            searchTips.style.display = 'block';
        }
    }

    showMessage(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // 3秒后自动关闭
            setTimeout(() => {
                alertDiv.classList.remove('show');
                setTimeout(() => alertDiv.remove(), 150);
            }, 3000);
        }
    }

    showWelcomeMessage() {
        // 检查是否已经显示过欢迎消息
        if (!localStorage.getItem('welcomeShown')) {
            this.showMessage('欢迎来到智喵学堂！开始探索知识的海洋吧！', 'success');
            localStorage.setItem('welcomeShown', 'true');
        }
    }
}

// 初始化应用
const whysApp = new WhysApp();
window.whysApp = whysApp; // 暴露给全局作用域

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