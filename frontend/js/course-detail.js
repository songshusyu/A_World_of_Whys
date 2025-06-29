/**
 * Course Detail 页面JavaScript
 * 负责加载和显示课程结构、章节、讲次和内容
 */

// API配置
const API_BASE_URL = 'http://localhost:8080/api/course';

// 缓存配置
const CACHE_KEY_PREFIX = 'zhimiao_course_';
const CACHE_EXPIRY_HOURS = 24;

// 页面状态
let currentTopic = '';
let currentModuleId = '';
let currentModuleTitle = '';
let currentCourseStructure = [];
let currentLectureId = '';
let currentLectureContents = {};

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取信息
    const urlParams = new URLSearchParams(window.location.search);
    currentTopic = urlParams.get('topic') || sessionStorage.getItem('currentTopic') || '机器学习';
    currentModuleId = urlParams.get('moduleId') || sessionStorage.getItem('currentModuleId');
    currentModuleTitle = urlParams.get('moduleTitle') || sessionStorage.getItem('currentModuleTitle') || '学习模块';
    
    if (!currentModuleId) {
        showError('缺少模块信息，请从主题版块页面进入');
        return;
    }
    
    // 更新页面标题和面包屑导航
    updatePageInfo();
    
    // 加载课程结构
    loadCourseStructure();
    
    // 绑定内容类型切换事件
    bindContentTypeEvents();
});

/**
 * 更新页面信息
 */
function updatePageInfo() {
    document.getElementById('courseTitle').textContent = currentModuleTitle;
    document.title = `${currentModuleTitle} - 课程详情 - A World of Whys`;
    
    // 更新面包屑导航
    const topicBreadcrumb = document.getElementById('topicBreadcrumb');
    topicBreadcrumb.textContent = `${currentTopic} - 版块`;
    topicBreadcrumb.href = `topic-modules.html?topic=${encodeURIComponent(currentTopic)}`;
    
    document.getElementById('moduleBreadcrumb').textContent = currentModuleTitle;
}

/**
 * 加载课程结构
 */
async function loadCourseStructure() {
    try {
        showChaptersLoading();
        
        // 调试：检查模块ID
        console.log('当前模块ID:', currentModuleId);
        
        // 检查缓存
        const cachedData = getCachedCourseStructure(currentModuleId);
        if (cachedData) {
            console.log('使用缓存的课程结构数据:', cachedData);
            currentCourseStructure = cachedData;
            displayCourseStructure(currentCourseStructure);
            return;
        }
        
        // 调用API
        const response = await fetch(`${API_BASE_URL}/course-structure?moduleId=${currentModuleId}`);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            console.log('API返回的课程结构数据:', data.data);
            currentCourseStructure = data.data;
            
            // 缓存数据
            setCachedCourseStructure(currentModuleId, currentCourseStructure);
            
            // 显示课程结构
            displayCourseStructure(currentCourseStructure);
        } else {
            console.error('API响应数据无效:', data);
            throw new Error(data.message || '获取课程结构失败');
        }
        
    } catch (error) {
        console.error('加载课程结构失败:', error);
        showChaptersError(error.message);
    }
}

/**
 * 显示章节加载状态
 */
function showChaptersLoading() {
    document.getElementById('chaptersLoading').classList.remove('d-none');
    document.getElementById('chaptersError').classList.add('d-none');
    document.getElementById('chaptersList').classList.add('d-none');
}

/**
 * 显示章节错误状态
 */
function showChaptersError(message) {
    document.getElementById('chaptersLoading').classList.add('d-none');
    document.getElementById('chaptersError').classList.remove('d-none');
    document.getElementById('chaptersList').classList.add('d-none');
    
    const errorMsg = document.querySelector('#chaptersError .alert p');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
}

/**
 * 显示课程结构
 */
function displayCourseStructure(chapters) {
    console.log('displayCourseStructure 被调用，chapters:', chapters);
    console.log('chapters 类型:', typeof chapters);
    console.log('chapters 是数组吗:', Array.isArray(chapters));
    
    document.getElementById('chaptersLoading').classList.add('d-none');
    document.getElementById('chaptersError').classList.add('d-none');
    document.getElementById('chaptersList').classList.remove('d-none');
    
    const chaptersList = document.getElementById('chaptersList');
    chaptersList.innerHTML = '';
    
    // 安全检查chapters数组
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
        console.log('章节数据无效或为空');
        chaptersList.innerHTML = '<div class="alert alert-info">暂无章节数据</div>';
        return;
    }
    
    console.log('开始创建章节元素，共', chapters.length, '个章节');
    
    chapters.forEach((chapter, chapterIndex) => {
        console.log(`处理第${chapterIndex + 1}个章节:`, chapter);
        if (chapter && typeof chapter === 'object') {
            try {
                const chapterElement = createChapterElement(chapter, chapterIndex);
                chaptersList.appendChild(chapterElement);
                console.log(`第${chapterIndex + 1}个章节创建成功`);
            } catch (error) {
                console.error(`创建第${chapterIndex + 1}个章节时出错:`, error);
                console.error('出错的章节数据:', chapter);
            }
        } else {
            console.warn(`第${chapterIndex + 1}个章节数据无效:`, chapter);
        }
    });
}

/**
 * 创建章节元素
 */
function createChapterElement(chapter, chapterIndex) {
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-item';
    chapterDiv.setAttribute('data-chapter-id', chapter.id);
    
    // 安全检查lectures数组
    console.log('createChapterElement - chapter:', chapter);
    console.log('createChapterElement - chapter.lectures:', chapter.lectures);
    
    const lectures = chapter.lectures || [];
    console.log('createChapterElement - lectures after safety check:', lectures);
    
    chapterDiv.innerHTML = `
        <div class="chapter-header" onclick="toggleChapter(${chapterIndex})">
            <h5 class="chapter-title">第${chapterIndex + 1}章 - ${chapter.title || '未命名章节'}</h5>
            <i class="bi bi-chevron-down chapter-toggle"></i>
        </div>
        <ul class="lectures-list">
            ${(() => {
                // 如果lectures为null或undefined，创建5个默认讲次
                if (!lectures || lectures === null) {
                    console.log(`章节${chapterIndex + 1}的讲次数据为null，创建默认讲次`);
                    const defaultLectures = [];
                    for (let i = 0; i < 5; i++) {
                        defaultLectures.push({
                            id: null,
                            title: `第${i + 1}讲`,
                            isPlaceholder: true
                        });
                    }
                    lectures = defaultLectures;
                }
                
                return Array.isArray(lectures) && lectures.length > 0 ? lectures.map((lecture, lectureIndex) => {
                    console.log(`创建讲次${lectureIndex + 1}:`, lecture);
                    if (lecture && lecture.id && !lecture.isPlaceholder) {
                        return `
                        <li class="lecture-item" data-lecture-id="${lecture.id}" 
                            onclick="selectLecture(${lecture.id}, '${lecture.title || '第' + (lectureIndex + 1) + '讲'}', ${chapterIndex + 1}, ${lectureIndex + 1})">
                            <span class="lecture-number">${lectureIndex + 1}</span>
                            <span class="lecture-title">${lecture.title || '第' + (lectureIndex + 1) + '讲'}</span>
                        </li>
                        `;
                    } else {
                        // 如果讲次数据不完整或是占位符，创建重新生成按钮
                        return `
                        <li class="lecture-item lecture-placeholder" data-chapter-index="${chapterIndex}" data-lecture-index="${lectureIndex}">
                            <span class="lecture-number">${lectureIndex + 1}</span>
                            <span class="lecture-title text-muted">第${lectureIndex + 1}讲 - 
                                <button class="btn btn-sm btn-outline-primary" onclick="regenerateChapterContent(${chapterIndex})">
                                    重新生成内容
                                </button>
                            </span>
                        </li>
                        `;
                    }
                }).join('') : '<li class="text-muted p-2">暂无讲次数据</li>';
            })()}
        </ul>
    `;
    
    return chapterDiv;
}

/**
 * 切换章节展开/收起
 */
function toggleChapter(chapterIndex) {
    const chapterItems = document.querySelectorAll('.chapter-item');
    const currentChapter = chapterItems[chapterIndex];
    
    if (currentChapter) {
        currentChapter.classList.toggle('expanded');
    }
}

/**
 * 选择讲次
 */
function selectLecture(lectureId, lectureTitle, chapterNum, lectureNum) {
    console.log('选择讲次:', {lectureId, lectureTitle, chapterNum, lectureNum});
    
    // 验证讲次ID
    if (!lectureId || lectureId === 'undefined') {
        console.error('无效的讲次ID:', lectureId);
        showError('讲次数据无效，请刷新页面重试');
        return;
    }
    
    // 更新当前讲次ID
    currentLectureId = lectureId;
    
    // 更新UI状态
    updateLectureSelection(lectureId);
    updateLectureInfo(lectureTitle, chapterNum, lectureNum);
    
    // 显示讲次内容区域
    showLectureDisplay();
    
    // 清空之前的内容
    clearAllContentAreas();
    
    // 加载默认内容类型（课程内容）
    loadLectureContent('COURSE');
}

/**
 * 清空所有内容区域
 */
function clearAllContentAreas() {
    const contentAreas = ['contentText', 'simplifiedText', 'testText', 'exploreText'];
    contentAreas.forEach(areaId => {
        const element = document.getElementById(areaId);
        if (element) {
            element.innerHTML = '<p class="text-muted">请选择上方的内容类型...</p>';
        }
    });
}

/**
 * 重新生成章节内容
 */
async function regenerateChapterContent(chapterIndex) {
    console.log('重新生成章节内容:', chapterIndex);
    
    if (!currentModuleId) {
        showError('当前模块ID不存在，无法重新生成内容');
        return;
    }
    
    try {
        // 显示加载状态
        showLoadingMessage('正在重新生成章节内容，请稍候...');
        
        // 清除缓存的课程结构
        const cacheKey = `course_structure_${currentModuleId}`;
        localStorage.removeItem(cacheKey);
        
        // 重新加载课程结构
        await loadCourseStructure();
        
        showSuccessMessage('章节内容重新生成成功！');
        
    } catch (error) {
        console.error('重新生成章节内容失败:', error);
        showError('重新生成失败: ' + error.message);
    }
}

/**
 * 显示加载消息
 */
function showLoadingMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info';
    alertDiv.innerHTML = `<i class="bi bi-arrow-clockwise"></i> ${message}`;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
}

/**
 * 显示成功消息
 */
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `<i class="bi bi-check-circle"></i> ${message}`;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
}

/**
 * 更新讲次选中状态
 */
function updateLectureSelection(lectureId) {
    // 清除所有active状态
    document.querySelectorAll('.lecture-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前选中状态
    const selectedItem = document.querySelector(`[data-lecture-id="${lectureId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
}

/**
 * 更新讲次信息
 */
function updateLectureInfo(lectureTitle, chapterNum, lectureNum) {
    document.getElementById('lectureTitle').textContent = lectureTitle;
    document.getElementById('chapterBadge').textContent = `第${chapterNum}章`;
    document.getElementById('lectureBadge').textContent = `第${lectureNum}讲`;
}

/**
 * 显示讲次内容区域
 */
function showLectureDisplay() {
    document.getElementById('welcomeState').classList.add('d-none');
    document.getElementById('lectureLoading').classList.add('d-none');
    document.getElementById('lectureDisplay').classList.remove('d-none');
}

/**
 * 显示讲次加载状态
 */
function showLectureLoading() {
    document.getElementById('welcomeState').classList.add('d-none');
    document.getElementById('lectureLoading').classList.remove('d-none');
    document.getElementById('lectureDisplay').classList.add('d-none');
}

/**
 * 绑定内容类型切换事件
 */
function bindContentTypeEvents() {
    const contentTabs = document.querySelectorAll('[data-content-type]');
    contentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const contentType = this.getAttribute('data-content-type');
            
            // 检查是否选择了讲次
            if (!currentLectureId) {
                showError('请先选择一个讲次');
                return;
            }
            
            // 更新活动标签状态
            updateActiveContentTab(this);
            
            // 加载内容
            loadLectureContent(contentType);
        });
    });
}

/**
 * 更新活动内容标签状态
 */
function updateActiveContentTab(activeTab) {
    // 移除所有活动状态
    document.querySelectorAll('[data-content-type]').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 设置当前活动状态
    activeTab.classList.add('active');
}

/**
 * 加载讲次内容
 */
async function loadLectureContent(contentType) {
    console.log('加载讲次内容:', {lectureId: currentLectureId, contentType});
    
    if (!currentLectureId) {
        console.error('没有选择的讲次');
        setContentError(contentType, '请先选择一个讲次');
        return;
    }
    
    // 如果是深入探索，显示聊天界面
    if (contentType === 'ADVANCED') {
        displayChatInterface();
        return;
    }
    
    try {
        // 检查缓存
        const cacheKey = `${currentLectureId}_${contentType}`;
        if (currentLectureContents[cacheKey]) {
            console.log('使用缓存的内容:', contentType);
            displayLectureContent(contentType, currentLectureContents[cacheKey]);
            return;
        }
        
        // 显示加载状态
        setContentLoading(contentType, true);
        
        // 调用API
        console.log('调用API:', `${API_BASE_URL}/lecture-content?lectureId=${currentLectureId}&type=${contentType}`);
        const response = await fetch(`${API_BASE_URL}/lecture-content?lectureId=${currentLectureId}&type=${contentType}`);
        
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API返回数据:', data);
        
        if (data.success && data.data) {
            // 缓存内容
            currentLectureContents[cacheKey] = data.data;
            
            // 显示内容
            displayLectureContent(contentType, data.data);
            console.log('内容加载成功:', contentType);
        } else {
            throw new Error(data.message || '获取讲次内容失败');
        }
        
    } catch (error) {
        console.error('加载讲次内容失败:', error);
        setContentError(contentType, error.message);
    }
}

/**
 * 设置内容加载状态
 */
function setContentLoading(contentType, isLoading) {
    const contentMap = {
        'CONTENT': 'contentText',
        'SIMPLIFIED': 'simplifiedText',
        'TEST': 'testText',
        'EXPLORE': 'exploreText'
    };
    
    const elementId = contentMap[contentType];
    const element = document.getElementById(elementId);
    
    if (element) {
        if (isLoading) {
            element.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">正在生成内容...</span>
                    </div>
                    <p class="mt-2 mb-0 text-muted">AI正在生成精彩内容...</p>
                </div>
            `;
        }
    }
}

/**
 * 设置内容错误状态
 */
function setContentError(contentType, message) {
    const contentMap = {
        'CONTENT': 'contentText',
        'SIMPLIFIED': 'simplifiedText',
        'TEST': 'testText',
        'EXPLORE': 'exploreText'
    };
    
    const elementId = contentMap[contentType];
    const element = document.getElementById(elementId);
    
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h6><i class="bi bi-exclamation-triangle"></i> 加载失败</h6>
                <p class="mb-0">${message}</p>
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="loadLectureContent('${contentType}')">
                    <i class="bi bi-arrow-clockwise"></i> 重试
                </button>
            </div>
        `;
    }
}

/**
 * 显示讲次内容
 */
function displayLectureContent(contentType, content) {
    const contentMap = {
        'COURSE': 'contentText',
        'SIMPLIFIED': 'simplifiedText',
        'TEST': 'testText',
        'ADVANCED': 'exploreText'
    };
    
    const elementId = contentMap[contentType];
    const element = document.getElementById(elementId);
    
    if (element && content) {
        element.innerHTML = parseMarkdown(content.content || content);
    }
}

/**
 * 增强的Markdown解析器
 */
function parseMarkdown(text) {
    if (!text) return '';
    
    let html = text;
    
    // 先处理代码块（防止内容被其他规则影响）
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({
            lang: lang || 'text',
            code: code.trim()
        });
        return placeholder;
    });
    
    // 处理行内代码
    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
        inlineCodes.push(code);
        return placeholder;
    });
    
    // 转义HTML字符
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // 处理标题
    html = html
        .replace(/^#### (.*$)/gm, '<h6 class="mt-3 mb-2">$1</h6>')
        .replace(/^### (.*$)/gm, '<h5 class="mt-3 mb-2">$1</h5>')
        .replace(/^## (.*$)/gm, '<h4 class="mt-4 mb-3">$1</h4>')
        .replace(/^# (.*$)/gm, '<h3 class="mt-4 mb-3">$1</h3>');
    
    // 处理列表
    html = html.replace(/^[\s]*-[\s]+(.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="mb-3">$1</ul>');
    
    // 处理粗体和斜体
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-decoration-none">$1</a>');
    
    // 处理段落
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = html.replace(/\n/g, '<br>');
    
    // 包装段落
    if (!html.startsWith('<h') && !html.startsWith('<ul')) {
        html = '<p class="mb-3">' + html + '</p>';
    }
    
    // 恢复代码块
    codeBlocks.forEach((block, index) => {
        const placeholder = `__CODE_BLOCK_${index}__`;
        const codeHtml = `
            <div class="code-block mb-3">
                <div class="code-header">
                    <span class="code-lang">${block.lang}</span>
                    <button class="btn btn-sm btn-outline-light copy-btn" onclick="copyCode(this)">
                        <i class="bi bi-clipboard"></i> 复制
                    </button>
                </div>
                <pre><code class="language-${block.lang}">${block.code}</code></pre>
            </div>
        `;
        html = html.replace(placeholder, codeHtml);
    });
    
    // 恢复行内代码
    inlineCodes.forEach((code, index) => {
        const placeholder = `__INLINE_CODE_${index}__`;
        html = html.replace(placeholder, `<code class="bg-light px-1 rounded">${code}</code>`);
    });
    
    // 修复空段落
    html = html.replace(/<p class="mb-3"><\/p>/g, '');
    
    return html;
}

/**
 * 导航到上一讲或下一讲
 */
function navigateLecture(direction) {
    if (!currentCourseStructure || !Array.isArray(currentCourseStructure) || !currentCourseStructure.length || !currentLectureId) return;
    
    // 找到当前讲次的位置
    let currentChapterIndex = -1;
    let currentLectureIndex = -1;
    
    for (let i = 0; i < currentCourseStructure.length; i++) {
        const chapter = currentCourseStructure[i];
        if (chapter && Array.isArray(chapter.lectures)) {
            for (let j = 0; j < chapter.lectures.length; j++) {
                if (chapter.lectures[j] && chapter.lectures[j].id == currentLectureId) {
                    currentChapterIndex = i;
                    currentLectureIndex = j;
                    break;
                }
            }
        }
        if (currentChapterIndex !== -1) break;
    }
    
    if (currentChapterIndex === -1) return;
    
    let targetChapterIndex = currentChapterIndex;
    let targetLectureIndex = currentLectureIndex;
    
    if (direction === 'next') {
        targetLectureIndex++;
        if (targetLectureIndex >= currentCourseStructure[targetChapterIndex].lectures.length) {
            targetChapterIndex++;
            targetLectureIndex = 0;
        }
    } else if (direction === 'prev') {
        targetLectureIndex--;
        if (targetLectureIndex < 0) {
            targetChapterIndex--;
            if (targetChapterIndex >= 0) {
                targetLectureIndex = currentCourseStructure[targetChapterIndex].lectures.length - 1;
            }
        }
    }
    
    // 检查边界
    if (targetChapterIndex < 0 || targetChapterIndex >= currentCourseStructure.length) {
        return;
    }
    
    const targetChapter = currentCourseStructure[targetChapterIndex];
    if (targetLectureIndex < 0 || targetLectureIndex >= targetChapter.lectures.length) {
        return;
    }
    
    // 导航到目标讲次
    const targetLecture = targetChapter.lectures[targetLectureIndex];
    selectLecture(targetLecture.id, targetLecture.title, targetChapterIndex + 1, targetLectureIndex + 1);
    
    // 确保章节展开
    const chapterItems = document.querySelectorAll('.chapter-item');
    if (chapterItems[targetChapterIndex]) {
        chapterItems[targetChapterIndex].classList.add('expanded');
    }
}

/**
 * 返回上一页
 */
function goBack() {
    if (currentTopic) {
        window.location.href = `topic-modules.html?topic=${encodeURIComponent(currentTopic)}`;
    } else {
        window.history.back();
    }
}

/**
 * 缓存相关函数
 */
function getCachedCourseStructure(moduleId) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + 'structure_' + moduleId;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const data = JSON.parse(cached);
            const now = new Date().getTime();
            const expiry = data.timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
            
            if (now < expiry && data.structure) {
                console.log('使用缓存的课程结构数据');
                
                // 验证缓存数据的完整性
                if (Array.isArray(data.structure)) {
                    // 为每个章节添加空的lectures数组（如果不存在）
                    const validatedStructure = data.structure.map(chapter => ({
                        ...chapter,
                        lectures: Array.isArray(chapter.lectures) ? chapter.lectures : []
                    }));
                    return validatedStructure;
                }
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('读取缓存失败:', error);
        // 清除可能损坏的缓存
        try {
            const cacheKey = CACHE_KEY_PREFIX + 'structure_' + moduleId;
            localStorage.removeItem(cacheKey);
        } catch (e) {
            // 忽略清除缓存的错误
        }
    }
    
    return null;
}

function setCachedCourseStructure(moduleId, structure) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + 'structure_' + moduleId;
        const data = {
            structure: structure,
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        console.log('课程结构数据已缓存');
    } catch (error) {
        console.error('缓存数据失败:', error);
    }
}

/**
 * 显示聊天界面（深入探索功能）
 */
function displayChatInterface() {
    const exploreTextElement = document.getElementById('exploreText');
    if (!exploreTextElement) return;
    
    // 获取当前讲次信息
    const lectureTitle = document.getElementById('lectureTitle').textContent;
    const chapterBadge = document.getElementById('chapterBadge').textContent;
    const lectureBadge = document.getElementById('lectureBadge').textContent;
    
    exploreTextElement.innerHTML = `
        <div class="chat-container">
            <div class="chat-header">
                <h5><i class="bi bi-chat-dots"></i> AI深入探索</h5>
                <p class="text-muted mb-0">与AI助手深入讨论：${lectureTitle}</p>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message ai-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>您好！我是您的AI学习助手。关于"${lectureTitle}"这一讲，您有什么想深入了解的问题吗？</p>
                        <p>我可以帮您：</p>
                        <ul>
                            <li>解答疑难问题</li>
                            <li>提供更多实例</li>
                            <li>扩展相关知识</li>
                            <li>推荐学习资源</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="input-group">
                    <input type="text" id="chatInput" class="form-control" 
                           placeholder="输入您的问题..." onkeypress="handleChatKeyPress(event)">
                    <button class="btn btn-primary" onclick="sendMessage()">
                        <i class="bi bi-send"></i> 发送
                    </button>
                </div>
                <div class="quick-questions mt-2">
                    <small class="text-muted">快速提问：</small>
                    <button class="btn btn-sm btn-outline-secondary me-1 mt-1" onclick="askQuickQuestion('能举个具体例子吗？')">
                        举个例子
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1 mt-1" onclick="askQuickQuestion('有什么实际应用场景？')">
                        实际应用
                    </button>
                    <button class="btn btn-sm btn-outline-secondary me-1 mt-1" onclick="askQuickQuestion('如何进一步学习？')">
                        进一步学习
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 处理聊天输入键盘事件
 */
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/**
 * 快速提问
 */
function askQuickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

/**
 * 发送消息
 */
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 清空输入框
    input.value = '';
    
    // 添加用户消息
    addChatMessage(message, 'user');
    
    // 显示AI思考状态
    const thinkingId = addChatMessage('正在思考中...', 'ai', true);
    
    try {
        // 获取当前讲次信息作为上下文
        const lectureTitle = document.getElementById('lectureTitle').textContent;
        const contextPrompt = `关于课程"${lectureTitle}"的问题：${message}`;
        
        // 调用AI API
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: contextPrompt,
                lectureId: currentLectureId
            })
        });
        
        if (!response.ok) {
            throw new Error('AI服务暂时不可用');
        }
        
        const data = await response.json();
        
        // 移除思考状态，添加AI回复
        removeChatMessage(thinkingId);
        addChatMessage(data.reply || '抱歉，我现在无法回答这个问题。', 'ai');
        
    } catch (error) {
        console.error('发送消息失败:', error);
        removeChatMessage(thinkingId);
        addChatMessage('抱歉，AI服务暂时不可用，请稍后再试。', 'ai');
    }
}

/**
 * 添加聊天消息
 */
function addChatMessage(message, sender, isTemporary = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.id = messageId;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    const bgClass = sender === 'user' ? 'bg-primary text-white' : 'bg-light';
    
    // 对AI消息进行Markdown渲染，用户消息保持纯文本
    let messageContent;
    if (sender === 'ai' && !isTemporary) {
        messageContent = parseMarkdown(message);
    } else {
        messageContent = `<p class="mb-0">${message}</p>`;
    }
    
    messageElement.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content ${bgClass}">
            ${messageContent}
            ${isTemporary ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : ''}
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
}

/**
 * 移除聊天消息
 */
function removeChatMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        messageElement.remove();
    }
}

/**
 * 复制代码功能
 */
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // 临时改变按钮文本
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> 已复制';
        button.classList.remove('btn-outline-light');
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-light');
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案：选择文本
        const range = document.createRange();
        range.selectNode(codeBlock.querySelector('code'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    });
}

/**
 * 显示错误信息
 */
function showError(message) {
    const container = document.querySelector('.course-structure .container');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h5 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> 错误</h5>
            <p class="mb-0">${message}</p>
            <hr>
            <button class="btn btn-outline-danger" onclick="window.history.back()">
                <i class="bi bi-arrow-left"></i> 返回
            </button>
        </div>
    `;
}
