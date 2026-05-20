/**
 * 简历数据加载与表单填充
 */

/**
 * 使用Axios加载简历数据
 */
async function loadResumeData() {
    try {
        // 从JSON文件加载简历数据
        const response = await axios.get('resume_info.txt');
        const data = response.data;
        
        // 填充简历表单
        fillResumeForm(data);
        
        console.log('简历数据加载成功:', data);
    } catch (error) {
        console.error('加载简历数据失败:', error);
        alert('加载简历数据失败，请稍后重试');
    }
}

/**
 * 填充简历表单
 * @param {Object} data - 简历数据对象
 */
function fillResumeForm(data) {
    // 填充基本信息
    if (data.basicInfo) {
        document.querySelector('input[name="name"]').value = data.basicInfo.name || '';
        document.querySelector('input[name="gender"][value="' + (data.basicInfo.gender || '男') + '"]').checked = true;
        document.querySelector('input[name="birthdate"]').value = data.basicInfo.birthdate || '';
        document.querySelector('select[name="nation"]').value = data.basicInfo.nation || '汉族';
        document.querySelector('select[name="education"]').value = data.basicInfo.education || '本科';
        document.querySelector('select[name="politicalStatus"]').value = data.basicInfo.politicalStatus || '群众';
        document.querySelector('input[name="email"]').value = data.basicInfo.email || '';
        document.querySelector('input[name="phone"]').value = data.basicInfo.phone || '';
        document.querySelector('select[name="health"]').value = data.basicInfo.health || '良好';
    }
    
    // 填充求职意向
    if (data.careerObjective) {
        document.querySelector('select[name="industry"]').value = data.careerObjective.industry || '';
        document.querySelector('select[name="position"]').value = data.careerObjective.position || '';
        document.querySelector('select[name="location"]').value = data.careerObjective.location || '';
        document.querySelector('select[name="salaryMin"]').value = data.careerObjective.salaryMin || '5k';
        document.querySelector('select[name="salaryMax"]').value = data.careerObjective.salaryMax || '10k';
    }
    
    // 填充教育经历
    if (data.education && data.education.length > 0) {
        var eduContainer = document.getElementById('eduContainer');
        // 清空现有内容
        eduContainer.innerHTML = '';
        
        data.education.forEach(function(item, index) {
            var newItem = document.createElement('div');
            newItem.className = 'edu-item';
            newItem.innerHTML = `
                <div class="form-item">
                    <label>学校名称</label>
                    <input type="text" name="school[]" placeholder="请输入学校名称" value="${item.school || ''}">
                </div>
                <div class="form-item">
                    <label>时间</label>
                    <div class="date-range">
                        <input type="date" name="eduStart[]" value="${item.startDate || ''}">
                        <span>-</span>
                        <input type="date" name="eduEnd[]" value="${item.endDate || ''}">
                    </div>
                </div>
                <button class="btn-delete" onclick="deleteEduItem(this)">×</button>
            `;
            eduContainer.appendChild(newItem);
        });
    }
    
    // 填充工作经历
    if (data.workExperience && data.workExperience.length > 0) {
        var workContainer = document.getElementById('workContainer');
        // 清空现有内容
        workContainer.innerHTML = '';
        
        data.workExperience.forEach(function(item, index) {
            var newItem = document.createElement('div');
            newItem.className = 'work-item';
            newItem.innerHTML = `
                <div class="form-item">
                    <label>在职时间</label>
                    <div class="date-range">
                        <input type="date" name="workStart[]" value="${item.startDate || ''}">
                        <span>-</span>
                        <input type="date" name="workEnd[]" value="${item.endDate || ''}">
                    </div>
                </div>
                <div class="form-item">
                    <label>公司名称</label>
                    <input type="text" name="company[]" placeholder="请输入公司名称" value="${item.company || ''}">
                </div>
                <div class="form-item">
                    <label>职位名称</label>
                    <select name="jobTitle[]">
                        <option value="">请输入</option>
                        <option value="工程师" ${item.jobTitle === '工程师' ? 'selected' : ''}>工程师</option>
                        <option value="高级工程师" ${item.jobTitle === '高级工程师' ? 'selected' : ''}>高级工程师</option>
                        <option value="技术主管" ${item.jobTitle === '技术主管' ? 'selected' : ''}>技术主管</option>
                        <option value="经理" ${item.jobTitle === '经理' ? 'selected' : ''}>经理</option>
                    </select>
                </div>
                <div class="form-item">
                    <label>经历描述</label>
                    <textarea name="workDesc[]" placeholder="请输入工作经历描述">${item.description || ''}</textarea>
                </div>
                <button class="btn-delete" onclick="deleteWorkItem(this)">×</button>
            `;
            workContainer.appendChild(newItem);
        });
    }
}

/**
 * 页面加载完成后自动加载简历数据
 */
window.onload = function() {
    // 先检查登录状态
    if (typeof initLoginCheck === 'function') {
        initLoginCheck();
    }
    // 加载简历数据
    loadResumeData();
};