/**
 * 登录表单验证
 */

function validateLogin() {
    // 获取表单元素
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    var remember = document.getElementById('remember').checked;
    
    // 清除之前的错误提示
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    var isValid = true;
    
    // 验证账号不能为空
    if (username === '') {
        document.getElementById('usernameError').textContent = '账号不能为空';
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
    
    // 如果验证通过，显示登录数据
    if (isValid) {
        var loginData = {
            '账号': username,
            '密码': password,
            '记住密码': remember ? '是' : '否'
        };
        alert('登录信息验证通过！\n\n' + JSON.stringify(loginData, null, 2));
        
        // 保存用户信息到 localStorage
        var userInfo = {
            username: username,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 跳转到工作台页面
        window.location.href = '../experiment4/workbench.html';
        return false;
    }
    
    return false;
}

/**
 * 退出登录
 */
function logout() {
    if (confirm('确定要退出登录吗？')) {
        window.location.href = 'login.html';
    }
}