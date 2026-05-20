/**
 * 简历表单验证与数据处理
 */

/**
 * 登录状态检测间隔时间（毫秒）
 * 设置为5分钟检测一次
 */
var LOGIN_CHECK_INTERVAL = 5 * 60 * 1000;

/**
 * 登录状态检测定时器
 */
var loginCheckTimer = null;

/**
 * 检查登录状态
 * @returns {boolean} - 是否已登录
 */
function checkLoginStatus() {
    var userInfo = getUserInfo();
    if (!userInfo || !userInfo.username) {
        return false;
    }
    return true;
}

/**
 * 页面加载时检查登录状态
 */
function initLoginCheck() {
    // 页面加载时立即检查登录状态
    if (!checkLoginStatus()) {
        if (confirm('您的登录状态已失效，请重新登录')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    // 设置定时检测登录状态
    loginCheckTimer = setInterval(function() {
        if (!checkLoginStatus()) {
            clearInterval(loginCheckTimer);
            if (confirm('您的登录状态已失效，请重新登录')) {
                window.location.href = 'login.html';
            }
        }
    }, LOGIN_CHECK_INTERVAL);
    
    // 页面关闭前清除定时器
    window.addEventListener('beforeunload', function() {
        if (loginCheckTimer) {
            clearInterval(loginCheckTimer);
        }
    });
}

/**
 * 简历表单验证
 * @returns {boolean} - 是否验证通过
 */
function validateResume() {
    // 验证前先检查登录状态
    if (!checkLoginStatus()) {
        alert('您的登录状态已失效，请重新登录');
        window.location.href = 'login.html';
        return false;
    }
    // 清除所有错误提示
    clearAllErrors();
    
    var isValid = true;
    
    // 验证基本信息
    var name = document.querySelector('input[name="name"]').value.trim();
    if (name === '') {
        document.getElementById('nameError').textContent = '姓名不能为空';
        isValid = false;
    }
    
    var email = document.querySelector('input[name="email"]').value.trim();
    if (email !== '' && !validateEmail(email)) {
        document.getElementById('emailError').textContent = '请输入有效的邮箱地址';
        isValid = false;
    }
    
    var phone = document.querySelector('input[name="phone"]').value.trim();
    if (phone !== '' && !validatePhone(phone)) {
        document.getElementById('phoneError').textContent = '请输入有效的手机号码';
        isValid = false;
    }
    
    var birthdate = document.querySelector('input[name="birthdate"]').value;
    if (birthdate !== '' && !validateDate(birthdate)) {
        document.getElementById('birthdateError').textContent = '请输入有效的出生日期';
        isValid = false;
    }
    
    var location = document.querySelector('select[name="location"]').value;
    if (location === '') {
        document.getElementById('locationError').textContent = '请选择求职地点';
        isValid = false;
    }
    
    // 验证教育经历
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item, index) {
        var school = item.querySelector('input[name="school[]"]').value.trim();
        var eduStart = item.querySelector('input[name="eduStart[]"]').value;
        var eduEnd = item.querySelector('input[name="eduEnd[]"]').value;
        
        if (school !== '' && eduStart === '') {
            alert('第' + (index + 1) + '条教育经历：请填写开始时间');
            isValid = false;
        }
        if (eduEnd !== '' && eduStart !== '' && eduEnd < eduStart) {
            alert('第' + (index + 1) + '条教育经历：结束时间不能早于开始时间');
            isValid = false;
        }
    });
    
    // 验证工作经历
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item, index) {
        var company = item.querySelector('input[name="company[]"]').value.trim();
        var workStart = item.querySelector('input[name="workStart[]"]').value;
        var workEnd = item.querySelector('input[name="workEnd[]"]').value;
        
        if (company !== '' && workStart === '') {
            alert('第' + (index + 1) + '条工作经历：请填写开始时间');
            isValid = false;
        }
        if (workEnd !== '' && workStart !== '' && workEnd < workStart) {
            alert('第' + (index + 1) + '条工作经历：结束时间不能早于开始时间');
            isValid = false;
        }
    });
    
    // 如果验证通过，收集并显示所有数据
    if (isValid) {
        collectAndShowData();
    }
    
    return false;
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息对象
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
 * 保存简历数据到 localStorage
 * @param {Object} resumeData - 简历数据对象
 */
function saveResumeToLocalStorage(resumeData) {
    try {
        // 获取当前用户
        var userInfo = getUserInfo();
        if (!userInfo || !userInfo.username) {
            alert('请先登录');
            window.location.href = 'login.html';
            return false;
        }
        
        // 获取用户已有的简历列表
        var userResumes = localStorage.getItem('resumes_' + userInfo.username);
        var resumes = userResumes ? JSON.parse(userResumes) : [];
        
        // 生成唯一ID
        var maxId = resumes.length > 0 ? Math.max(...resumes.map(r => r.id)) : 0;
        resumeData.id = maxId + 1;
        resumeData.createdAt = new Date().toISOString();
        resumeData.username = userInfo.username;
        
        // 添加到列表
        resumes.push(resumeData);
        
        // 保存到 localStorage
        localStorage.setItem('resumes_' + userInfo.username, JSON.stringify(resumes));
        
        return true;
    } catch (e) {
        console.error('保存简历失败:', e);
        return false;
    }
}

/**
 * 收集并保存所有表单数据
 */
function collectAndShowData() {
    var data = {};
    
    // 收集基本信息
    data['基本Info'] = {
        'name': document.querySelector('input[name="name"]').value.trim(),
        'gender': document.querySelector('input[name="gender"]:checked').value,
        'birthdate': document.querySelector('input[name="birthdate"]').value,
        'nation': document.querySelector('select[name="nation"]').value,
        'education': document.querySelector('select[name="education"]').value,
        'politicalStatus': document.querySelector('select[name="politicalStatus"]').value,
        'email': document.querySelector('input[name="email"]').value.trim(),
        'phone': document.querySelector('input[name="phone"]').value.trim(),
        'health': document.querySelector('select[name="health"]').value
    };
    
    // 收集求职意向
    data['careerObjective'] = {
        'industry': document.querySelector('select[name="industry"]').value,
        'position': document.querySelector('select[name="position"]').value,
        'location': document.querySelector('select[name="location"]').value,
        'salaryMin': document.querySelector('select[name="salaryMin"]').value,
        'salaryMax': document.querySelector('select[name="salaryMax"]').value
    };
    
    // 收集教育经历
    var eduData = [];
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item) {
        eduData.push({
            'school': item.querySelector('input[name="school[]"]').value.trim(),
            'startDate': item.querySelector('input[name="eduStart[]"]').value,
            'endDate': item.querySelector('input[name="eduEnd[]"]').value
        });
    });
    data['education'] = eduData;
    
    // 收集工作经历
    var workData = [];
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item) {
        workData.push({
            'startDate': item.querySelector('input[name="workStart[]"]').value,
            'endDate': item.querySelector('input[name="workEnd[]"]').value,
            'company': item.querySelector('input[name="company[]"]').value.trim(),
            'jobTitle': item.querySelector('select[name="jobTitle[]"]').value,
            'description': item.querySelector('textarea[name="workDesc[]"]').value.trim()
        });
    });
    data['workExperience'] = workData;
    
    // 保存到 localStorage
    if (saveResumeToLocalStorage(data)) {
        // 使用alert显示所有数据
        alert('简历信息录入成功！\n\n' + JSON.stringify(data, null, 2));
        
        // 输出到控制台
        console.log('简历表单数据:', data);
        
        // 通知父页面（工作台）切换到简历列表
        // 检查是否在 iframe 中运行
        if (window.parent && window.parent !== window) {
            // 如果在 iframe 中，通知父页面切换页面
            if (typeof window.parent.loadPage === 'function') {
                setTimeout(function() {
                    window.parent.loadPage('resumeList');
                }, 500);
            } else {
                // 回退方案：使用 postMessage 通知父页面
                window.parent.postMessage({ action: 'loadPage', pageName: 'resumeList' }, '*');
            }
        } else {
            // 如果不在 iframe 中，直接跳转
            setTimeout(function() {
                window.location.href = '../experiment4/workbench.html?page=resumeList';
            }, 1000);
        }
    } else {
        alert('保存简历失败，请重试');
    }
}

/**
 * 添加教育经历项
 */
function addEduItem() {
    var container = document.getElementById('eduContainer');
    var newItem = document.createElement('div');
    newItem.className = 'edu-item';
    newItem.innerHTML = `
        <div class="form-item">
            <label>学校名称</label>
            <input type="text" name="school[]" placeholder="请输入学校名称">
        </div>
        <div class="form-item">
            <label>时间</label>
            <div class="date-range">
                <input type="date" name="eduStart[]">
                <span>-</span>
                <input type="date" name="eduEnd[]">
            </div>
        </div>
        <button class="btn-delete" onclick="deleteEduItem(this)">×</button>
    `;
    container.appendChild(newItem);
}

/**
 * 删除教育经历项
 * @param {HTMLElement} btn - 删除按钮
 */
function deleteEduItem(btn) {
    var container = document.getElementById('eduContainer');
    var items = container.querySelectorAll('.edu-item');
    
    // 至少保留一项
    if (items.length > 1) {
        btn.parentElement.remove();
    } else {
        alert('至少需要保留一条教育经历');
    }
}

/**
 * 添加工作经历项
 */
function addWorkItem() {
    var container = document.getElementById('workContainer');
    var newItem = document.createElement('div');
    newItem.className = 'work-item';
    newItem.innerHTML = `
        <div class="form-item">
            <label>在职时间</label>
            <div class="date-range">
                <input type="date" name="workStart[]">
                <span>-</span>
                <input type="date" name="workEnd[]">
            </div>
        </div>
        <div class="form-item">
            <label>公司名称</label>
            <input type="text" name="company[]" placeholder="请输入公司名称">
        </div>
        <div class="form-item">
            <label>职位名称</label>
            <select name="jobTitle[]">
                <option value="">请输入</option>
                <option value="工程师">工程师</option>
                <option value="高级工程师">高级工程师</option>
                <option value="技术主管">技术主管</option>
                <option value="经理">经理</option>
            </select>
        </div>
        <div class="form-item">
            <label>经历描述</label>
            <textarea name="workDesc[]" placeholder="请输入工作经历描述"></textarea>
        </div>
        <button class="btn-delete" onclick="deleteWorkItem(this)">×</button>
    `;
    container.appendChild(newItem);
}

/**
 * 删除工作经历项
 * @param {HTMLElement} btn - 删除按钮
 */
function deleteWorkItem(btn) {
    var container = document.getElementById('workContainer');
    var items = container.querySelectorAll('.work-item');
    
    // 至少保留一项
    if (items.length > 1) {
        btn.parentElement.remove();
    } else {
        alert('至少需要保留一条工作经历');
    }
}/**
 * 简历表单验证与数据处理
 */

/**
 * 简历表单验证
 * @returns {boolean} - 是否验证通过
 */
function validateResume() {
    // 清除所有错误提示
    clearAllErrors();
    
    var isValid = true;
    
    // 验证基本信息
    var name = document.querySelector('input[name="name"]').value.trim();
    if (name === '') {
        document.getElementById('nameError').textContent = '姓名不能为空';
        isValid = false;
    }
    
    var email = document.querySelector('input[name="email"]').value.trim();
    if (email !== '' && !validateEmail(email)) {
        document.getElementById('emailError').textContent = '请输入有效的邮箱地址';
        isValid = false;
    }
    
    var phone = document.querySelector('input[name="phone"]').value.trim();
    if (phone !== '' && !validatePhone(phone)) {
        document.getElementById('phoneError').textContent = '请输入有效的手机号码';
        isValid = false;
    }
    
    var birthdate = document.querySelector('input[name="birthdate"]').value;
    if (birthdate !== '' && !validateDate(birthdate)) {
        document.getElementById('birthdateError').textContent = '请输入有效的出生日期';
        isValid = false;
    }
    
    var location = document.querySelector('select[name="location"]').value;
    if (location === '') {
        document.getElementById('locationError').textContent = '请选择求职地点';
        isValid = false;
    }
    
    // 验证教育经历
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item, index) {
        var school = item.querySelector('input[name="school[]"]').value.trim();
        var eduStart = item.querySelector('input[name="eduStart[]"]').value;
        var eduEnd = item.querySelector('input[name="eduEnd[]"]').value;
        
        if (school !== '' && eduStart === '') {
            alert('第' + (index + 1) + '条教育经历：请填写开始时间');
            isValid = false;
        }
        if (eduEnd !== '' && eduStart !== '' && eduEnd < eduStart) {
            alert('第' + (index + 1) + '条教育经历：结束时间不能早于开始时间');
            isValid = false;
        }
    });
    
    // 验证工作经历
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item, index) {
        var company = item.querySelector('input[name="company[]"]').value.trim();
        var workStart = item.querySelector('input[name="workStart[]"]').value;
        var workEnd = item.querySelector('input[name="workEnd[]"]').value;
        
        if (company !== '' && workStart === '') {
            alert('第' + (index + 1) + '条工作经历：请填写开始时间');
            isValid = false;
        }
        if (workEnd !== '' && workStart !== '' && workEnd < workStart) {
            alert('第' + (index + 1) + '条工作经历：结束时间不能早于开始时间');
            isValid = false;
        }
    });
    
    // 如果验证通过，收集并显示所有数据
    if (isValid) {
        collectAndShowData();
    }
    
    return false;
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息对象
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
 * 保存简历数据到 localStorage
 * @param {Object} resumeData - 简历数据对象
 */
function saveResumeToLocalStorage(resumeData) {
    try {
        // 获取当前用户
        var userInfo = getUserInfo();
        if (!userInfo || !userInfo.username) {
            alert('请先登录');
            window.location.href = 'login.html';
            return false;
        }
        
        // 获取用户已有的简历列表
        var userResumes = localStorage.getItem('resumes_' + userInfo.username);
        var resumes = userResumes ? JSON.parse(userResumes) : [];
        
        // 生成唯一ID
        var maxId = resumes.length > 0 ? Math.max(...resumes.map(r => r.id)) : 0;
        resumeData.id = maxId + 1;
        resumeData.createdAt = new Date().toISOString();
        resumeData.username = userInfo.username;
        
        // 添加到列表
        resumes.push(resumeData);
        
        // 保存到 localStorage
        localStorage.setItem('resumes_' + userInfo.username, JSON.stringify(resumes));
        
        return true;
    } catch (e) {
        console.error('保存简历失败:', e);
        return false;
    }
}

/**
 * 收集并保存所有表单数据
 */
function collectAndShowData() {
    var data = {};
    
    // 收集基本信息
    data['基本Info'] = {
        'name': document.querySelector('input[name="name"]').value.trim(),
        'gender': document.querySelector('input[name="gender"]:checked').value,
        'birthdate': document.querySelector('input[name="birthdate"]').value,
        'nation': document.querySelector('select[name="nation"]').value,
        'education': document.querySelector('select[name="education"]').value,
        'politicalStatus': document.querySelector('select[name="politicalStatus"]').value,
        'email': document.querySelector('input[name="email"]').value.trim(),
        'phone': document.querySelector('input[name="phone"]').value.trim(),
        'health': document.querySelector('select[name="health"]').value
    };
    
    // 收集求职意向
    data['careerObjective'] = {
        'industry': document.querySelector('select[name="industry"]').value,
        'position': document.querySelector('select[name="position"]').value,
        'location': document.querySelector('select[name="location"]').value,
        'salaryMin': document.querySelector('select[name="salaryMin"]').value,
        'salaryMax': document.querySelector('select[name="salaryMax"]').value
    };
    
    // 收集教育经历
    var eduData = [];
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item) {
        eduData.push({
            'school': item.querySelector('input[name="school[]"]').value.trim(),
            'startDate': item.querySelector('input[name="eduStart[]"]').value,
            'endDate': item.querySelector('input[name="eduEnd[]"]').value
        });
    });
    data['education'] = eduData;
    
    // 收集工作经历
    var workData = [];
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item) {
        workData.push({
            'startDate': item.querySelector('input[name="workStart[]"]').value,
            'endDate': item.querySelector('input[name="workEnd[]"]').value,
            'company': item.querySelector('input[name="company[]"]').value.trim(),
            'jobTitle': item.querySelector('select[name="jobTitle[]"]').value,
            'description': item.querySelector('textarea[name="workDesc[]"]').value.trim()
        });
    });
    data['workExperience'] = workData;
    
    // 保存到 localStorage
    if (saveResumeToLocalStorage(data)) {
        // 使用alert显示所有数据
        alert('简历信息录入成功！\n\n' + JSON.stringify(data, null, 2));
        
        // 输出到控制台
        console.log('简历表单数据:', data);
        
        // 检查是否在 iframe 中运行
        if (window.parent && window.parent !== window) {
            // 如果在 iframe 中，通知父页面切换到简历列表
            if (typeof window.parent.loadPage === 'function') {
                setTimeout(function() {
                    window.parent.loadPage('resumeList');
                }, 500);
            } else {
                // 回退方案：使用 postMessage 通知父页面
                window.parent.postMessage({ action: 'loadPage', pageName: 'resumeList' }, '*');
            }
        } else {
            // 如果不在 iframe 中（直接访问），保持原有跳转逻辑
            setTimeout(function() {
                window.location.href = '../experiment4/workbench.html?page=resumeList';
            }, 1000);
        }
    } else {
        alert('保存简历失败，请重试');
    }
}

/**
 * 添加教育经历项
 */
function addEduItem() {
    var container = document.getElementById('eduContainer');
    var newItem = document.createElement('div');
    newItem.className = 'edu-item';
    newItem.innerHTML = `
        <div class="form-item">
            <label>学校名称</label>
            <input type="text" name="school[]" placeholder="请输入学校名称">
        </div>
        <div class="form-item">
            <label>时间</label>
            <div class="date-range">
                <input type="date" name="eduStart[]">
                <span>-</span>
                <input type="date" name="eduEnd[]">
            </div>
        </div>
        <button class="btn-delete" onclick="deleteEduItem(this)">×</button>
    `;
    container.appendChild(newItem);
}

/**
 * 删除教育经历项
 * @param {HTMLElement} btn - 删除按钮
 */
function deleteEduItem(btn) {
    var container = document.getElementById('eduContainer');
    var items = container.querySelectorAll('.edu-item');
    
    // 至少保留一项
    if (items.length > 1) {
        btn.parentElement.remove();
    } else {
        alert('至少需要保留一条教育经历');
    }
}

/**
 * 添加工作经历项
 */
function addWorkItem() {
    var container = document.getElementById('workContainer');
    var newItem = document.createElement('div');
    newItem.className = 'work-item';
    newItem.innerHTML = `
        <div class="form-item">
            <label>在职时间</label>
            <div class="date-range">
                <input type="date" name="workStart[]">
                <span>-</span>
                <input type="date" name="workEnd[]">
            </div>
        </div>
        <div class="form-item">
            <label>公司名称</label>
            <input type="text" name="company[]" placeholder="请输入公司名称">
        </div>
        <div class="form-item">
            <label>职位名称</label>
            <select name="jobTitle[]">
                <option value="">请输入</option>
                <option value="工程师">工程师</option>
                <option value="高级工程师">高级工程师</option>
                <option value="技术主管">技术主管</option>
                <option value="经理">经理</option>
            </select>
        </div>
        <div class="form-item">
            <label>经历描述</label>
            <textarea name="workDesc[]" placeholder="请输入工作经历描述"></textarea>
        </div>
        <button class="btn-delete" onclick="deleteWorkItem(this)">×</button>
    `;
    container.appendChild(newItem);
}

/**
 * 删除工作经历项
 * @param {HTMLElement} btn - 删除按钮
 */
function deleteWorkItem(btn) {
    var container = document.getElementById('workContainer');
    var items = container.querySelectorAll('.work-item');
    
    // 至少保留一项
    if (items.length > 1) {
        btn.parentElement.remove();
    } else {
        alert('至少需要保留一条工作经历');
    }
}