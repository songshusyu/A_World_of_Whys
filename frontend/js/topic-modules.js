/**
 * Topic Modules 页面JavaScript
 * 负责加载和显示主题的学习版块
 */

// API配置
const API_BASE_URL = 'http://localhost:8080/api/course';

// 缓存配置 
const CACHE_KEY_PREFIX = 'zhimiao_modules_';
const CACHE_EXPIRY_HOURS = 24;

// 页面状态
let currentTopic = '';
let currentModules = [];

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取主题名称
    const urlParams = new URLSearchParams(window.location.search);
    currentTopic = urlParams.get('topic') || '机器学习';
    
    // 更新页面标题
    updatePageTitle(currentTopic);
    
    // 加载主题版块
    loadTopicModules();
});

/**
 * 更新页面标题
 */
function updatePageTitle(topic) {
    document.getElementById('topicTitle').textContent = `${topic} - 学习版块`;
    document.title = `${topic} - 学习版块 - A World of Whys`;
}

/**
 * 加载主题版块
 */
async function loadTopicModules() {
    try {
        showLoadingState();
        
        // 检查缓存
        const cachedData = getCachedModules(currentTopic);
        if (cachedData) {
            currentModules = cachedData;
            displayModules(currentModules);
            return;
        }
        
        // 调用API
        const response = await fetch(`${API_BASE_URL}/topic-modules?topic=${encodeURIComponent(currentTopic)}`);
        
        if (!response.ok) {
            // 尝试获取错误详情
            let errorDetail = '';
            try {
                const errorData = await response.json();
                errorDetail = errorData.message || errorData.error || '';
            } catch (e) {
                errorDetail = await response.text();
            }
            throw new Error(`API请求失败: ${response.status} ${response.statusText}\n详情: ${errorDetail}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        if (data.success && data.data) {
            currentModules = data.data;
            
            // 缓存数据
            setCachedModules(currentTopic, currentModules);
            
            // 显示版块
            displayModules(currentModules);
        } else {
            throw new Error(data.message || '获取版块数据失败');
        }
        
    } catch (error) {
        console.error('加载主题版块失败:', error);
        showErrorState(error.message);
    }
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    document.getElementById('loadingState').classList.remove('d-none');
    document.getElementById('errorState').classList.add('d-none');
    document.getElementById('modulesGrid').classList.add('d-none');
}

/**
 * 显示错误状态
 */
function showErrorState(message) {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('errorState').classList.remove('d-none');
    document.getElementById('modulesGrid').classList.add('d-none');
    
    document.getElementById('errorMessage').textContent = message;
}

/**
 * 显示版块
 */
function displayModules(modules) {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('errorState').classList.add('d-none');
    document.getElementById('modulesGrid').classList.remove('d-none');
    
    const gridContainer = document.querySelector('#modulesGrid .row');
    gridContainer.innerHTML = '';
    
    modules.forEach((module, index) => {
        const moduleCard = createModuleCard(module, index);
        gridContainer.appendChild(moduleCard);
    });
}

/**
 * 创建版块卡片
 */
function createModuleCard(module, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 col-md-6';
    
    const iconMapping = {
        'book': '📚',
        'tools': '🛠️', 
        'graph-up': '📈',
        'rocket': '🚀',
        'lightbulb': '💡',
        'gear': '⚙️',
        'trophy': '🏆',
        'target': '🎯'
    };
    
    const iconEmoji = iconMapping[module.icon] || '📚';
    
    col.innerHTML = `
        <div class="module-card" data-icon="${module.icon}" data-module-id="${module.id}">
            <div class="module-icon">${iconEmoji}</div>
            <h3 class="module-title">${module.title}</h3>
            <p class="module-description">${module.description}</p>
            <div class="module-action">
                <button class="btn btn-primary" onclick="enterCourse(${module.id}, '${module.title}')">
                    <i class="bi bi-play-circle"></i> 开始学习
                </button>
            </div>
        </div>
    `;
    
    return col;
}

/**
 * 进入课程详情页面
 */
function enterCourse(moduleId, moduleTitle) {
    // 保存当前状态到sessionStorage
    sessionStorage.setItem('currentTopic', currentTopic);
    sessionStorage.setItem('currentModuleId', moduleId);
    sessionStorage.setItem('currentModuleTitle', moduleTitle);
    
    // 跳转到课程详情页面
    window.location.href = `course-detail.html?moduleId=${moduleId}&topic=${encodeURIComponent(currentTopic)}&moduleTitle=${encodeURIComponent(moduleTitle)}`;
}

/**
 * 缓存相关函数
 */
function getCachedModules(topic) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + encodeURIComponent(topic);
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const data = JSON.parse(cached);
            const now = new Date().getTime();
            const expiry = data.timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
            
            if (now < expiry) {
                console.log('使用缓存的版块数据');
                return data.modules;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('读取缓存失败:', error);
    }
    
    return null;
}

function setCachedModules(topic, modules) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + encodeURIComponent(topic);
        const data = {
            modules: modules,
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        console.log('版块数据已缓存');
    } catch (error) {
        console.error('缓存数据失败:', error);
    }
}

/**
 * 清理过期缓存
 */
function cleanExpiredCache() {
    try {
        const keys = Object.keys(localStorage);
        const now = new Date().getTime();
        
        keys.forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const expiry = data.timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
                    
                    if (now >= expiry) {
                        localStorage.removeItem(key);
                        console.log('清理过期缓存:', key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('清理缓存失败:', error);
    }
}

/**
 * 重新生成版块（点击重试按钮时调用）
 */
function retryLoadModules() {
    // 清除当前主题的缓存
    const cacheKey = CACHE_KEY_PREFIX + encodeURIComponent(currentTopic);
    localStorage.removeItem(cacheKey);
    
    // 重新加载
    loadTopicModules();
}

// 确保函数在全局范围内可用
window.retryLoadModules = retryLoadModules;

// 页面卸载时清理过期缓存
window.addEventListener('beforeunload', cleanExpiredCache);
