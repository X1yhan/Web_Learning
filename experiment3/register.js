/**
 * 注册表单验证
 */

function validateRegister() {
    // 获取表单元素
    var username = document.getElementById('username').value.trim();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var phone = document.getElementById('phone').value.trim();
    var agree = document.getElementById('agree').checked;
    
    // 清除之前的错误提示
    clearAllErrors();
    
    var isValid = true;
    
    // 验证用户名
    if (username === '') {
        document.getElementById('usernameError').textContent = '用户名不能为空';
        isValid = false;
    } else if (username.length < 3) {
        document.getElementById('usernameError').textContent = '用户名至少3个字符';
        isValid = false;
    }
    
    // 验证邮箱
    if (email === '') {
        document.getElementById('emailError').textContent = '邮箱不能为空';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = '请输入有效的邮箱地址';
        isValid = false;
    }
    
    // 验证密码
    if (password === '') {
        document.getElementById('passwordError').textContent = '密码不能为空';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('passwordError').textContent = '密码长度至少8位';
        isValid = false;
    } else if (!validatePasswordComplexity(password)) {
        document.getElementById('passwordError').textContent = '密码需包含大写、小写、数字、特殊字符中的三种';
        isValid = false;
    }
    
    // 验证确认密码
    if (confirmPassword === '') {
        document.getElementById('confirmPasswordError').textContent = '请再次输入密码';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = '两次输入的密码不一致';
        isValid = false;
    }
    
    // 验证手机号
    if (phone !== '' && !validatePhone(phone)) {
        document.getElementById('phoneError').textContent = '请输入有效的手机号码';
        isValid = false;
    }
    
    // 验证同意协议
    if (!agree) {
        document.getElementById('agreeError').textContent = '请阅读并同意用户协议';
        isValid = false;
    }
    
    // 如果验证通过，输出表单信息到控制台
    if (isValid) {
        var registerData = {
            '用户名': username,
            '邮箱': email,
            '密码': password,
            '手机号': phone,
            '同意协议': agree ? '是' : '否'
        };
        console.log('注册表单信息:', registerData);
        alert('注册成功！\n\n' + JSON.stringify(registerData, null, 2));
        window.location.href = 'login.html';
    }
    
    return false;
}

/**
 * 清除注册表单错误提示
 */
function clearRegisterErrors() {
    var errors = document.querySelectorAll('.error');
    errors.forEach(function(error) {
        error.textContent = '';
    });
}