/**
 * 通用工具函数
 * 包含邮箱验证、手机号验证、日期验证、密码复杂度验证等
 */

/**
 * 密码复杂度验证：必须包含大写、小写、数字、特殊字符中的三种
 * @param {string} password - 密码
 * @returns {boolean} - 是否符合复杂度要求
 */
function validatePasswordComplexity(password) {
    var types = 0;
    
    // 检查是否包含大写字母
    if (/[A-Z]/.test(password)) types++;
    
    // 检查是否包含小写字母
    if (/[a-z]/.test(password)) types++;
    
    // 检查是否包含数字
    if (/[0-9]/.test(password)) types++;
    
    // 检查是否包含特殊字符
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) types++;
    
    // 必须包含至少三种类型
    return types >= 3;
}

/**
 * 邮箱格式验证
 * @param {string} email - 邮箱地址
 * @returns {boolean} - 是否有效
 */
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 手机号码验证
 * @param {string} phone - 手机号码
 * @returns {boolean} - 是否有效
 */
function validatePhone(phone) {
    var phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

/**
 * 日期验证
 * @param {string} date - 日期字符串
 * @returns {boolean} - 是否有效
 */
function validateDate(date) {
    var d = new Date(date);
    return d instanceof Date && !isNaN(d);
}

/**
 * 清除所有错误提示
 */
function clearAllErrors() {
    var errors = document.querySelectorAll('.error');
    errors.forEach(function(error) {
        error.textContent = '';
    });
}

/**
 * 切换密码显示/隐藏
 * @param {string} id - 密码输入框ID
 */
function togglePassword(id = 'password') {
    var passwordInput = document.getElementById(id);
    var toggleIcons = document.querySelectorAll('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcons.forEach(icon => icon.textContent = '🙈');
    } else {
        passwordInput.type = 'password';
        toggleIcons.forEach(icon => icon.textContent = '👁');
    }
}