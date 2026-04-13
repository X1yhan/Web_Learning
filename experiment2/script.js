/**
 * 计算器类 - 实现基本的计算器功能
 */
class Calculator {
    /**
     * 构造函数 - 初始化计算器状态和绑定事件
     */
    constructor() {
        // 获取显示元素
        this.display = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        
        // 初始化状态变量
        this.currentValue = '0';       // 当前显示的值
        this.previousValue = null;     // 上一个操作数
        this.operator = null;          // 当前运算符
        this.shouldResetDisplay = false; // 是否需要重置显示
        this.expression = '';          // 表达式显示
        
        // 绑定事件
        this.bindEvents();
    }

    /**
     * 绑定事件处理函数
     * 包括按钮点击事件和键盘事件
     */
    bindEvents() {
        // 绑定按钮点击事件
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.handleInput(value);
            });
        });
        
        // 绑定键盘事件
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
                '=': '=', 'Enter': '=', 'Backspace': 'backspace',
                'Escape': 'AC', 'c': 'AC', 'C': 'AC'
            };
            
            if (keyMap[e.key]) {
                e.preventDefault();
                this.handleInput(keyMap[e.key]);
            }
        });
    }

    /**
     * 处理用户输入
     * @param {string} value - 用户输入的值
     */
    handleInput(value) {
        if (this.isNumber(value)) {
            this.appendNumber(value);
        } else if (this.isOperator(value)) {
            this.setOperator(value);
        } else if (value === '=') {
            this.calculate();
        } else if (value === 'AC') {
            this.clear();
        } else if (value === 'backspace') {
            this.backspace();
        } else if (value === '%') {
            this.percent();
        }
    }

    /**
     * 判断输入是否为数字或小数点
     * @param {string} value - 输入值
     * @returns {boolean} - 是否为数字或小数点
     */
    isNumber(value) {
        return /^\d+$/.test(value) || value === '.';
    }

    /**
     * 判断输入是否为运算符
     * @param {string} value - 输入值
     * @returns {boolean} - 是否为运算符
     */
    isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }

    /**
     * 获取运算符的显示符号
     * @param {string} op - 运算符
     * @returns {string} - 显示用的运算符符号
     */
    getOperatorSymbol(op) {
        const symbols = { '+': '+', '-': '-', '*': '×', '/': '÷' };
        return symbols[op] || op;
    }

    /**
     * 追加数字到当前值
     * @param {string} num - 要追加的数字
     */
    appendNumber(num) {
        // 如果需要重置显示，则先重置
        if (this.shouldResetDisplay) {
            this.currentValue = '0';
            this.shouldResetDisplay = false;
        }
        
        // 处理小数点输入
        if (num === '.') {
            if (!this.currentValue.includes('.')) {
                this.currentValue += num;
            }
        } 
        // 处理00输入
        else if (num === '00') {
            if (this.currentValue !== '0') {
                this.currentValue += '00';
            }
        } 
        // 处理普通数字输入
        else {
            if (this.currentValue === '0') {
                this.currentValue = num;
            } else {
                this.currentValue += num;
            }
        }
        
        // 更新显示
        this.updateDisplay();
    }

    /**
     * 设置运算符
     * @param {string} op - 运算符
     */
    setOperator(op) {
        // 如果已有运算符且不需要重置显示，则先计算
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
            this.previousValue = parseFloat(this.currentValue);
        } 
        // 如果没有上一个值，则将当前值设为上一个值
        else if (this.previousValue === null) {
            this.previousValue = parseFloat(this.currentValue);
        }
        
        // 设置运算符并更新表达式显示
        this.operator = op;
        this.expression = `${this.previousValue} ${this.getOperatorSymbol(op)}`;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /**
     * 执行计算
     */
    calculate() {
        // 如果没有上一个值或运算符，则直接返回
        if (this.previousValue === null || this.operator === null) {
            return;
        }
        
        const current = parseFloat(this.currentValue);
        let result;
        
        // 更新表达式显示
        this.expression += ` ${current}`;
        
        // 根据运算符执行计算
        switch (this.operator) {
            case '+':
                result = this.previousValue + current;
                break;
            case '-':
                result = this.previousValue - current;
                break;
            case '*':
                result = this.previousValue * current;
                break;
            case '/':
                // 处理除数为0的情况
                if (current === 0) {
                    this.displayError('错误');
                    return;
                }
                result = this.previousValue / current;
                break;
            default:
                return;
        }
        
        // 格式化结果并更新状态
        this.currentValue = this.formatResult(result);
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /**
     * 格式化计算结果
     * @param {number} num - 计算结果
     * @returns {string} - 格式化后的结果字符串
     */
    formatResult(num) {
        // 如果是整数，直接返回字符串
        if (Number.isInteger(num)) {
            return num.toString();
        }
        // 如果是小数，保留10位小数并去除末尾的0
        return num.toFixed(10).replace(/\.?0+$/, '');
    }

    /**
     * 显示错误信息
     * @param {string} msg - 错误信息
     */
    displayError(msg) {
        this.currentValue = msg;
        this.expression = '';
        this.updateDisplay();
        // 1.5秒后自动清除错误
        setTimeout(() => {
            this.clear();
        }, 1500);
    }

    /**
     * 清除所有状态
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.expression = '';
        this.updateDisplay();
    }

    /**
     * 退格功能
     */
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    /**
     * 百分比功能
     */
    percent() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        this.expressionDisplay.textContent = this.expression;
        this.display.textContent = this.currentValue;
    }
}

// 实例化计算器
new Calculator();