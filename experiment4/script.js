/**
 * 工作台页面脚本
 * 包含页面加载、菜单交互等功能
 */

/**
 * 加载指定页面到 iframe
 * @param {string} pageName - 页面名称
 */
function loadPage(pageName) {
    var iframe = document.getElementById('content-iframe');
    var pageTitle = document.getElementById('page-title');
    var pageDesc = document.getElementById('page-desc');
    
    // 页面映射配置
    var pages = {
        'resume': { 
            url: '../experiment4/resume_view.html', 
            title: '个人简历', 
            desc: '个人简历信息展示与管理' 
        },
        'calculator': { 
            url: '../experiment2/index.html', 
            title: '计算器', 
            desc: '简单实用的计算器应用' 
        },
        'garbage': { 
            url: '../experiment2/garbage.html', 
            title: '小游戏', 
            desc: '垃圾分类问答小游戏' 
        },
        'resumeInput': { 
            url: '../experiment3/resume.html', 
            title: '简历录入', 
            desc: '录入和编辑个人简历信息' 
        },
        'resumeList': { 
            url: 'resume_list.html', 
            title: '简历列表', 
            desc: '查看所有简历列表' 
        }
    };
    
    var page = pages[pageName];
    if (page) {
        // 更新页面标题和描述
        pageTitle.textContent = page.title;
        pageDesc.textContent = page.desc;
        
        // 加载页面到 iframe
        if (page.url !== '#') {
            iframe.src = page.url;
        } else {
            // 预留功能显示提示
            iframe.src = 'about:blank';
            setTimeout(function() {
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.write('<html><head><title>' + page.title + '</title><style>body{display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:Arial,sans-serif;color:#666;}</style></head><body><div><h2>🚀 ' + page.title + '</h2><p>' + page.desc + '</p><p style="color:#999;font-size:14px;margin-top:20px;">该功能正在开发中...</p></div></body></html>');
                doc.close();
            }, 100);
        }
    }
}

/**
 * 退出登录
 * 清除用户信息并返回登录页面
 */
function logout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除localStorage中的用户信息
        localStorage.removeItem('userInfo');
        // 跳转到登录页面
        window.location.href = '../experiment3/login.html';
    }
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息对象，包含username和loginTime
 */
function getUserInfo() {
    try {
        var userInfoStr = localStorage.getItem('userInfo');
        return userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch (e) {
        console.error('获取用户信息失败:', e);
        return null;
    }
}

/**
 * 检查登录状态
 * 如果未登录则跳转到登录页面
 */
function checkLogin() {
    var userInfo = getUserInfo();
    if (!userInfo || !userInfo.username) {
        // 未登录，跳转到登录页面
        window.location.href = '../experiment3/login.html';
        return false;
    }
    return true;
}

/**
 * 更新欢迎信息显示
 */
function updateWelcomeMessage() {
    var userInfo = getUserInfo();
    var welcomeText = document.getElementById('welcome-text');
    if (userInfo && userInfo.username && welcomeText) {
        welcomeText.textContent = '欢迎回来，' + userInfo.username;
    }
}

/**
 * 处理来自 iframe 的消息
 * @param {MessageEvent} event - 消息事件对象
 */
function handleIframeMessage(event) {
    // 验证消息来源（可选，但建议使用）
    // if (event.origin !== 'expected-origin') return;
    
    if (event.data && event.data.action) {
        switch (event.data.action) {
            case 'loadPage':
                // 从 iframe 收到页面切换请求
                if (event.data.pageName) {
                    loadPage(event.data.pageName);
                }
                break;
            default:
                console.log('Unknown action:', event.data.action);
        }
    }
}

/**
 * 页面加载完成后的初始化操作
 */
window.onload = function() {
    console.log('工作台页面加载完成');
    
    // 检查登录状态
    if (checkLogin()) {
        // 更新欢迎信息
        updateWelcomeMessage();
    }
    
    // 添加消息监听器，接收来自 iframe 的消息
    window.addEventListener('message', handleIframeMessage, false);
};