/**
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
 * 收集并显示所有表单数据
 */
function collectAndShowData() {
    var data = {};
    
    // 收集基本信息
    data['基本信息'] = {
        '姓名': document.querySelector('input[name="name"]').value.trim(),
        '性别': document.querySelector('input[name="gender"]:checked').value,
        '出生日期': document.querySelector('input[name="birthdate"]').value,
        '民族': document.querySelector('select[name="nation"]').value,
        '学历': document.querySelector('select[name="education"]').value,
        '政治面貌': document.querySelector('select[name="politicalStatus"]').value,
        '邮箱': document.querySelector('input[name="email"]').value.trim(),
        '联系电话': document.querySelector('input[name="phone"]').value.trim(),
        '身体状态': document.querySelector('select[name="health"]').value
    };
    
    // 收集求职意向
    data['求职意向'] = {
        '期望行业': document.querySelector('select[name="industry"]').value,
        '求职岗位': document.querySelector('select[name="position"]').value,
        '求职地点': document.querySelector('select[name="location"]').value,
        '期望薪资': document.querySelector('select[name="salaryMin"]').value + ' - ' + 
                   document.querySelector('select[name="salaryMax"]').value + '/月'
    };
    
    // 收集教育经历
    var eduData = [];
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item) {
        eduData.push({
            '学校名称': item.querySelector('input[name="school[]"]').value.trim(),
            '开始时间': item.querySelector('input[name="eduStart[]"]').value,
            '结束时间': item.querySelector('input[name="eduEnd[]"]').value
        });
    });
    data['教育经历'] = eduData;
    
    // 收集工作经历
    var workData = [];
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item) {
        workData.push({
            '在职时间': item.querySelector('input[name="workStart[]"]').value + ' - ' + 
                       item.querySelector('input[name="workEnd[]"]').value,
            '公司名称': item.querySelector('input[name="company[]"]').value.trim(),
            '职位名称': item.querySelector('select[name="jobTitle[]"]').value,
            '经历描述': item.querySelector('textarea[name="workDesc[]"]').value.trim()
        });
    });
    data['工作经历'] = workData;
    
    // 使用alert显示所有数据
    alert('简历信息录入成功！\n\n' + JSON.stringify(data, null, 2));
    
    // 输出到控制台
    console.log('简历表单数据:', data);
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
 * 收集并显示所有表单数据
 */
function collectAndShowData() {
    var data = {};
    
    // 收集基本信息
    data['基本信息'] = {
        '姓名': document.querySelector('input[name="name"]').value.trim(),
        '性别': document.querySelector('input[name="gender"]:checked').value,
        '出生日期': document.querySelector('input[name="birthdate"]').value,
        '民族': document.querySelector('select[name="nation"]').value,
        '学历': document.querySelector('select[name="education"]').value,
        '政治面貌': document.querySelector('select[name="politicalStatus"]').value,
        '邮箱': document.querySelector('input[name="email"]').value.trim(),
        '联系电话': document.querySelector('input[name="phone"]').value.trim(),
        '身体状态': document.querySelector('select[name="health"]').value
    };
    
    // 收集求职意向
    data['求职意向'] = {
        '期望行业': document.querySelector('select[name="industry"]').value,
        '求职岗位': document.querySelector('select[name="position"]').value,
        '求职地点': document.querySelector('select[name="location"]').value,
        '期望薪资': document.querySelector('select[name="salaryMin"]').value + ' - ' + 
                   document.querySelector('select[name="salaryMax"]').value + '/月'
    };
    
    // 收集教育经历
    var eduData = [];
    var eduItems = document.querySelectorAll('.edu-item');
    eduItems.forEach(function(item) {
        eduData.push({
            '学校名称': item.querySelector('input[name="school[]"]').value.trim(),
            '开始时间': item.querySelector('input[name="eduStart[]"]').value,
            '结束时间': item.querySelector('input[name="eduEnd[]"]').value
        });
    });
    data['教育经历'] = eduData;
    
    // 收集工作经历
    var workData = [];
    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function(item) {
        workData.push({
            '在职时间': item.querySelector('input[name="workStart[]"]').value + ' - ' + 
                       item.querySelector('input[name="workEnd[]"]').value,
            '公司名称': item.querySelector('input[name="company[]"]').value.trim(),
            '职位名称': item.querySelector('select[name="jobTitle[]"]').value,
            '经历描述': item.querySelector('textarea[name="workDesc[]"]').value.trim()
        });
    });
    data['工作经历'] = workData;
    
    // 使用alert显示所有数据
    alert('简历信息录入成功！\n\n' + JSON.stringify(data, null, 2));
    
    // 输出到控制台
    console.log('简历表单数据:', data);
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