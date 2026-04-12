class Calculator {
    constructor() {
        this.display = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.expression = '';
        
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.handleInput(value);
            });
        });
        
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

    isNumber(value) {
        return /^\d+$/.test(value) || value === '.';
    }

    isOperator(value) {
        return ['+', '-', '*', '/'].includes(value);
    }

    getOperatorSymbol(op) {
        const symbols = { '+': '+', '-': '-', '*': '×', '/': '÷' };
        return symbols[op] || op;
    }

    appendNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = '0';
            this.shouldResetDisplay = false;
        }
        
        if (num === '.') {
            if (!this.currentValue.includes('.')) {
                this.currentValue += num;
            }
        } else if (num === '00') {
            if (this.currentValue !== '0') {
                this.currentValue += '00';
            }
        } else {
            if (this.currentValue === '0') {
                this.currentValue = num;
            } else {
                this.currentValue += num;
            }
        }
        
        this.updateDisplay();
    }

    setOperator(op) {
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
            this.previousValue = parseFloat(this.currentValue);
        } else if (this.previousValue === null) {
            this.previousValue = parseFloat(this.currentValue);
        }
        
        this.operator = op;
        this.expression = `${this.previousValue} ${this.getOperatorSymbol(op)}`;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    calculate() {
        if (this.previousValue === null || this.operator === null) {
            return;
        }
        
        const current = parseFloat(this.currentValue);
        let result;
        
        this.expression += ` ${current}`;
        
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
                if (current === 0) {
                    this.displayError('错误');
                    return;
                }
                result = this.previousValue / current;
                break;
            default:
                return;
        }
        
        this.currentValue = this.formatResult(result);
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    formatResult(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toFixed(10).replace(/\.?0+$/, '');
    }

    displayError(msg) {
        this.currentValue = msg;
        this.expression = '';
        this.updateDisplay();
        setTimeout(() => {
            this.clear();
        }, 1500);
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.shouldResetDisplay = false;
        this.expression = '';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    percent() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    updateDisplay() {
        this.expressionDisplay.textContent = this.expression;
        this.display.textContent = this.currentValue;
    }
}

new Calculator();