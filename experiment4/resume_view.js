/**
 * 个人简历展示页面脚本
 * 从JSON文件加载简历数据并展示
 */

/**
 * 页面加载完成后执行
 */
document.addEventListener('DOMContentLoaded', function() {
    loadResumeData();
});

/**
 * 使用Axios异步加载简历数据
 */
async function loadResumeData() {
    try {
        // 从JSON文件加载简历数据
        const response = await axios.get('../experiment3/resume_info.txt');
        const data = response.data;
        
        // 填充简历信息
        fillResumeInfo(data);
        
        console.log('简历数据加载成功:', data);
    } catch (error) {
        console.error('加载简历数据失败:', error);
        showError('加载简历数据失败，请稍后重试');
    }
}

/**
 * 填充简历信息到页面
 * @param {Object} data - 简历数据对象
 */
function fillResumeInfo(data) {
    // 填充基本信息
    if (data.basicInfo) {
        document.getElementById('name').textContent = data.basicInfo.name || '未填写';
        document.getElementById('gender').textContent = data.basicInfo.gender || '未填写';
        document.getElementById('birthdate').textContent = data.basicInfo.birthdate || '未填写';
        document.getElementById('nation').textContent = data.basicInfo.nation || '未填写';
        document.getElementById('education').textContent = data.basicInfo.education || '未填写';
        document.getElementById('politicalStatus').textContent = data.basicInfo.politicalStatus || '未填写';
        document.getElementById('email').textContent = data.basicInfo.email || '未填写';
        document.getElementById('phone').textContent = data.basicInfo.phone || '未填写';
        document.getElementById('health').textContent = data.basicInfo.health || '未填写';
    }
    
    // 填充求职意向
    if (data.careerObjective) {
        document.getElementById('industry').textContent = data.careerObjective.industry || '未填写';
        document.getElementById('position').textContent = data.careerObjective.position || '未填写';
        document.getElementById('location').textContent = data.careerObjective.location || '未填写';
        const salaryMin = data.careerObjective.salaryMin || '0';
        const salaryMax = data.careerObjective.salaryMax || '0';
        document.getElementById('salary').textContent = `${salaryMin} - ${salaryMax}/月`;
    }
    
    // 填充教育经历
    if (data.education && data.education.length > 0) {
        renderEducationList(data.education);
    } else {
        document.getElementById('educationList').innerHTML = '<p style="color:#999;">暂无教育经历</p>';
    }
    
    // 填充工作经历
    if (data.workExperience && data.workExperience.length > 0) {
        renderWorkExperienceList(data.workExperience);
    } else {
        document.getElementById('workExperienceList').innerHTML = '<p style="color:#999;">暂无工作经历</p>';
    }
}

/**
 * 渲染教育经历列表
 * @param {Array} educationArray - 教育经历数组
 */
function renderEducationList(educationArray) {
    let html = '';
    
    educationArray.forEach(function(item) {
        html += `
            <div class="timeline-item">
                <div class="timeline-header">
                    <span class="timeline-title">${item.school || '未填写'}</span>
                    <span class="timeline-period">${item.startDate || ''} - ${item.endDate || ''}</span>
                </div>
            </div>
        `;
    });
    
    document.getElementById('educationList').innerHTML = html;
}

/**
 * 渲染工作经历列表
 * @param {Array} workArray - 工作经历数组
 */
function renderWorkExperienceList(workArray) {
    let html = '';
    
    workArray.forEach(function(item) {
        html += `
            <div class="timeline-item">
                <div class="timeline-header">
                    <span class="timeline-title">${item.jobTitle || '未填写'}</span>
                    <span class="timeline-period">${item.startDate || ''} - ${item.endDate || ''}</span>
                </div>
                <div class="timeline-company">${item.company || '未填写'}</div>
                <div class="timeline-desc">${item.description || '未填写'}</div>
            </div>
        `;
    });
    
    document.getElementById('workExperienceList').innerHTML = html;
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
    const content = document.querySelector('.resume-content');
    content.innerHTML = `<div class="error-message">${message}</div>`;
}