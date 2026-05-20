/**
 * 简历列表页面脚本
 */

// 全局变量存储简历数据
let userResumes = [];

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
 * 从localStorage获取用户的简历列表
 * @returns {Array} 简历数组
 */
function getUserResumes() {
    try {
        var userInfo = getUserInfo();
        if (!userInfo || !userInfo.username) {
            return [];
        }
        var resumesStr = localStorage.getItem('resumes_' + userInfo.username);
        return resumesStr ? JSON.parse(resumesStr) : [];
    } catch (e) {
        console.error('获取简历列表失败:', e);
        return [];
    }
}

/**
 * 计算工作经验年限
 * @param {string} startDate - 开始日期
 * @returns {string} 经验年限
 */
function calculateExperience(startDate) {
    if (!startDate) return '未知';
    var start = new Date(startDate);
    var now = new Date();
    var years = now.getFullYear() - start.getFullYear();
    var months = now.getMonth() - start.getMonth();
    if (months < 0) {
        years--;
    }
    return years + '年';
}

/**
 * 页面加载完成后执行
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取用户简历数据
    userResumes = getUserResumes();
    
    // 如果没有简历，显示提示
    if (userResumes.length === 0) {
        showEmptyState();
    } else {
        renderResumeList(userResumes);
    }
});

/**
 * 显示空状态
 */
function showEmptyState() {
    const grid = document.getElementById('resumeGrid');
    grid.innerHTML = `
        <div class="empty-state">
            <h3>暂无简历</h3>
            <p>您还没有录入任何简历</p>
            <button class="btn-primary" onclick="goToResumeInput()">立即录入</button>
        </div>
    `;
}

/**
 * 跳转到简历录入页面
 */
function goToResumeInput() {
    window.parent.loadPage('resumeInput');
}

/**
 * 渲染简历列表
 * @param {Array} resumes - 简历数组
 */
function renderResumeList(resumes) {
    const grid = document.getElementById('resumeGrid');
    
    if (resumes.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    
    resumes.forEach(function(resume) {
        // 从简历数据中提取信息（兼容两种数据格式：basicInfo 和 基本Info）
        const basicInfo = resume.basicInfo || resume['基本Info'] || {};
        const careerObj = resume.careerObjective || {};
        const workExp = resume.workExperience && resume.workExperience.length > 0 
            ? resume.workExperience[0] : {};
        
        const name = basicInfo.name || '未命名';
        const position = careerObj.position || '未填写';
        const education = basicInfo.education || '未填写';
        const location = careerObj.location || '未填写';
        const salary = careerObj.salaryMin && careerObj.salaryMax 
            ? careerObj.salaryMin + '-' + careerObj.salaryMax 
            : '未填写';
        const experience = calculateExperience(workExp.startDate);
        
        html += `
            <div class="resume-card" onclick="viewResume(${resume.id})">
                <div class="card-header">
                    <h3 class="card-name">${name}</h3>
                    <p class="card-position">${position}</p>
                </div>
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">学历：</span>
                        <span class="info-value">${education}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">地点：</span>
                        <span class="info-value">${location}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">薪资：</span>
                        <span class="info-value">${salary}/月</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">经验：</span>
                        <span class="info-value">${experience}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn btn-view" onclick="event.stopPropagation();viewResume(${resume.id})">查看</button>
                    <button class="action-btn btn-edit" onclick="event.stopPropagation();editResume(${resume.id})">编辑</button>
                    <button class="action-btn btn-delete" onclick="event.stopPropagation();deleteResume(${resume.id})">删除</button>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

/**
 * 搜索简历
 */
function searchResume() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = userResumes.filter(function(resume) {
        const basicInfo = resume.basicInfo || {};
        const careerObj = resume.careerObjective || {};
        const name = (basicInfo.name || '').toLowerCase();
        const position = (careerObj.position || '').toLowerCase();
        const location = (careerObj.location || '').toLowerCase();
        
        return name.includes(keyword) ||
               position.includes(keyword) ||
               location.includes(keyword);
    });
    
    renderResumeList(filtered);
}

/**
 * 查看简历详情
 * @param {number} id - 简历ID
 */
function viewResume(id) {
    // 将选中的简历ID存储到sessionStorage，供简历展示页面使用
    sessionStorage.setItem('selectedResumeId', id.toString());
    
    // 通知父页面加载简历展示页面
    window.parent.loadPage('resume');
}

/**
 * 编辑简历
 * @param {number} id - 简历ID
 */
function editResume(id) {
    // 跳转到简历编辑页面
    alert(`正在打开简历ID ${id} 的编辑页面...`);
    // 实际项目中这里会跳转到编辑页面
}

/**
 * 删除简历
 * @param {number} id - 简历ID
 */
function deleteResume(id) {
    // 确认删除
    if (!confirm('确定要删除这份简历吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        var userInfo = getUserInfo();
        if (!userInfo || !userInfo.username) {
            alert('请先登录');
            return;
        }
        
        // 获取用户的简历列表
        var userResumesStr = localStorage.getItem('resumes_' + userInfo.username);
        var resumes = userResumesStr ? JSON.parse(userResumesStr) : [];
        
        // 过滤掉要删除的简历
        var updatedResumes = resumes.filter(function(r) {
            return r.id !== id;
        });
        
        // 保存更新后的列表
        localStorage.setItem('resumes_' + userInfo.username, JSON.stringify(updatedResumes));
        
        // 更新本地缓存
        userResumes = updatedResumes;
        
        // 重新渲染列表
        if (userResumes.length === 0) {
            showEmptyState();
        } else {
            renderResumeList(userResumes);
        }
        
        alert('简历删除成功！');
        console.log('简历删除成功，ID:', id);
    } catch (e) {
        console.error('删除简历失败:', e);
        alert('删除简历失败，请重试');
    }
}