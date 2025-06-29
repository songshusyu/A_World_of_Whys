// 导航处理
document.addEventListener('DOMContentLoaded', () => {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 设置活动导航项
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 登录注册按钮事件
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/pages/login.html';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = '/pages/register.html';
        });
    }
});