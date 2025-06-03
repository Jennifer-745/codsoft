const display = document.getElementById('display');
const steps = document.getElementById('steps');
const buttons = document.querySelector('.buttons');

let currentInput = '';
let firstOperand = null;
let operator = null;
let shouldResetInput = false;
let calculationSteps = [];

function updateDisplay(value) {
    display.textContent = value;
}

function updateSteps() {
    steps.innerHTML = calculationSteps.map((step, i) => `<div><span style="color:#aaa;">${i+1}.</span> ${step}</div>`).join('');
    steps.scrollTop = steps.scrollHeight;
}

function clearAll() {
    currentInput = '';
    firstOperand = null;
    operator = null;
    shouldResetInput = false;
    calculationSteps = [];
    updateDisplay('0');
    updateSteps();
}

function handleNumber(num) {
    if (shouldResetInput) {
        currentInput = '';
        shouldResetInput = false;
    }
    if (num === '.' && currentInput.includes('.')) return;
    if (num === '.' && currentInput === '') currentInput = '0';
    currentInput += num;
    updateDisplay(currentInput);
}

function operatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return '';
    }
}

function handleOperator(nextOperator) {
    if (currentInput === '' && firstOperand === null) return;
    if (operator && !shouldResetInput) {
        handleEquals();
    }
    if (currentInput !== '') {
        firstOperand = parseFloat(currentInput);
    }
    operator = nextOperator;
    calculationSteps.push(`${firstOperand} ${operatorSymbol(operator)}`);
    updateSteps();
    shouldResetInput = true;
}

function handleEquals() {
    if (operator === null || currentInput === '') return;
    let secondOperand = parseFloat(currentInput);
    let result = 0;
    let stepString = `${firstOperand} ${operatorSymbol(operator)} ${secondOperand} = `;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            break;
    }
    stepString += result;
    calculationSteps.push(stepString);
    updateSteps();
    updateDisplay(result);
    currentInput = result.toString();
    firstOperand = result === 'Error' ? null : result;
    operator = null;
    shouldResetInput = true;
}

function handleBackspace() {
    if (shouldResetInput) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
}

buttons.addEventListener('click', (event) => {
    const btn = event.target;
    if (!btn.classList.contains('btn')) return;

    if (btn.hasAttribute('data-number')) {
        handleNumber(btn.getAttribute('data-number'));
    } else if (btn.hasAttribute('data-action')) {
        const action = btn.getAttribute('data-action');
        switch (action) {
            case 'clear':
                clearAll();
                break;
            case 'add':
                handleOperator('+');
                break;
            case 'subtract':
                handleOperator('-');
                break;
            case 'multiply':
                handleOperator('*');
                break;
            case 'divide':
                handleOperator('/');
                break;
            case 'equals':
                handleEquals();
                break;
            case 'backspace':
                handleBackspace();
                break;
        }
    }
});

// Initialize display and step log
clearAll();
