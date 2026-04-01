let result = document.getElementById('result');
let expression = document.getElementById('expression');
let currentValue = '0';
let operator = null;
let firstOperand = null;
let isCalculated = false;
let currentExpression = '';

// 添加按钮点击事件监听器
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        handleButtonClick(value);
    });
});

function handleButtonClick(value) {
    // 数字和小数点
    if ((value >= '0' && value <= '9') || value === '.' || value === '00') {
        if (currentValue === '0' || isCalculated) {
            if (value === '.') {
                currentValue = '0.';
            } else {
                currentValue = value;
            }
            isCalculated = false;
        } else {
            // 避免重复小数点
            if (value === '.' && currentValue.includes('.')) {
                return;
            }
            currentValue += value;
        }
        updateDisplay();
    }
    // 运算符
    else if (value === '+' || value === '-' || value === '*' || value === '/') {
        if (firstOperand === null) {
            firstOperand = parseFloat(currentValue);
        } else if (!isCalculated) {
            firstOperand = calculate(firstOperand, parseFloat(currentValue), operator);
            currentValue = firstOperand.toString();
            updateDisplay();
        }
        operator = value;
        isCalculated = false;
    }
    // 等于
    else if (value === '=') {
        if (firstOperand !== null && operator !== null) {
            const secondOperand = parseFloat(currentValue);
            const calculatedValue = calculate(firstOperand, secondOperand, operator);
            currentValue = calculatedValue.toString();
            firstOperand = null;
            operator = null;
            isCalculated = true;
            updateDisplay();
        }
    }
    // 清除
    else if (value === 'AC') {
        currentValue = '0';
        firstOperand = null;
        operator = null;
        isCalculated = false;
        updateDisplay();
    }
    // 退格
    else if (value === 'backspace') {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
    }
    // 百分比
    else if (value === '%') {
        currentValue = (parseFloat(currentValue) / 100).toString();
        updateDisplay();
    }
}

function calculate(a, b, op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b !== 0 ? a / b : '错误';
        default:
            return b;
    }
}

function updateDisplay() {
    expression.textContent = currentExpression;
    result.textContent = currentValue;
}