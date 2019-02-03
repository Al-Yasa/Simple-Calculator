/**** Variables ****/
const OPERATION = document.querySelector('.operation');
let operationArray = [];
const OUTPUT = document.querySelector('.output');
let done = true;
let result = 0;
const KEYS = document.querySelector('.keys');

/**** Funcitons ****/
/** Key Functions **/
function clear() {
    OPERATION.innerHTML = '';
    OUTPUT.innerHTML = 0;
    operationArray = [];
    result = 0;
}

function plusMinus() { // plus/minus flips the result from positive to negative and vice versa
    if (operationArray.length && done) {
        if (typeof operationArray[0] == "number") { // if first character is a number then add a minus operator at the beginning
            operationArray.unshift('-');
        } else { // if first character is not a number (example: an operator like '-')
            if (operationArray[0] === '-') { // if first character is a minus operator then remove it
                operationArray.shift('-');
            } else { // if first character is not a minus operator then add a minus operator
                operationArray.unshift('-');
            }
        }
        updateDisplay();
    }
}

function backspace() {
    if (!done) { // backspacing during input should remove the last character
        operationArray.pop();
    } else { // backspacing after calculation is done should clear the calc
        clear();
    }
}

function divide() {
    if (operationArray.length) {
        done = false;
        if (typeof operationArray[operationArray.length - 1] !== 'number') { // if last character is not a number
            if (operationArray[operationArray.length - 1] !== '-') { // if last character is not minus operator then replace it with a divide operator
                operationArray[operationArray.length - 1] = '/';
            }
        } else { // if last character is a number then add a divide operator
            operationArray.push('/');
        }
    }
}

function multiply() {
    if (operationArray.length) {
        done = false;
        if (typeof operationArray[operationArray.length - 1] !== 'number') { // if last character is not a number
            if (operationArray[operationArray.length - 1] !== '-') { // if last character is not minus operator then replace it with a multiply operator
                operationArray[operationArray.length - 1] = '*';
            }
        } else { // if last character is a number then add a multiply operator
            operationArray.push('*');
        }
    }
}

function minus() {
    done = false;
    if (typeof operationArray[operationArray.length - 1] !== 'number') { // if last character is not a number
        if (operationArray[operationArray.length - 1] !== '-') { // if last character is not minus operator then add a minus operator
            operationArray.push('-');
        }
    } else { // if last character is a number then add a minus operator
        operationArray.push('-');
    }
}

function plus() {
    if (operationArray.length) {
        done = false;
        if (typeof operationArray[operationArray.length - 1] !== 'number') { // if last character is not a number
            if (operationArray[operationArray.length - 1] !== '-') { // if last character is not minus operator then replace it with a plus operator
                operationArray[operationArray.length - 1] = '+';
            }
        } else { // if last character is a number then add a plus operator
            operationArray.push('+');
        }
    }
}

function addNum(num) {
    if (done) {clear();}
    done = false;
    operationArray.push(num);
}

function decimal() {
    done = false;
    let newArray = [];
    let newString;
    if (typeof operationArray[operationArray.length - 1] === 'number') { // if last character is a number

        for (i = operationArray.length - 1; i >= 0; i--) { // loop backwards through all characters in operation (in order to find the decimal point)
            if (typeof operationArray[i] === 'number' || operationArray[i] === '.') { // if character is a number or a decimal operator then add that character to the temporary array
                newArray.push(operationArray[i]);
            } else { // if character is not a number or a decimal operator then break out of the loop
                break;
            }
        }

        newString = newArray.join(''); // stringify our temporary array
        if (!newString.includes('.')) { // only add a decimal if one does not exist already
            operationArray.push('.');
        }

    }
}

function equal() {
    if (operationArray.length) {
        done = true;

        if (typeof operationArray[operationArray.length - 1] == 'number') { // if last character is a number then calculate
            calculate();
        } else { // if last character is not a number then remove that character and check again before calculating
            operationArray.pop();
            if (typeof operationArray[operationArray.length - 1] !== 'number') { // if last character is not a number remove it
                operationArray.pop();
            }
            calculate();
        }

        operationArray = [];

        if (decimalPlaces(result) > 5) { // if result number has more then 5 digit after decimal then fix-it to 6 digits
            result = result.toFixed(6);
        }

        result = String(result); // convert result number to a string

        for (i = 0; i < result.length; i++) { // loop through result string
            if (result[i].match(/[0-9]/g)) { // if character matches a number then convert it from string to a number before pushing it to operation array
                operationArray.push(Number(result[i]));
            } else { // if character does not match a number then push it to operation array as it is
                operationArray.push(result[i]);
            }
        }

        result = 0;
    }
}


/** Helper Functions **/
function updateDisplay() {
    OPERATION.innerHTML = '';
    for (char of operationArray) {
        if (char === '/') {
            OPERATION.innerHTML += `<span>&#247;</span>`;
        } else if (char === '*') {
            OPERATION.innerHTML += `<span>&#215;</span>`;
        } else if (char === '-') {
            OPERATION.innerHTML += `<span>-</span>`;
        } else if (char === '+') {
            OPERATION.innerHTML += `<span>+</span>`;
        } else {
            OPERATION.innerHTML += char;
        }
    }
}

/*
    this function is for finding out how many digits are there after the decimal of a number
    Source: https://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
*/
function decimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {return 0;}
    return Math.max(
         0,
         // Number of digits right of decimal point.
         (match[1] ? match[1].length : 0)
         // Adjust for scientific notation.
         - (match[2] ? +match[2] : 0));
}

function calculate() {
    result = eval(operationArray.join(''));
    if (result == Infinity || result == -Infinity) { // check if result is infinity in order to throw error (example: division by 0)
        OUTPUT.innerHTML = 'Error';
        setTimeout(() => clear(), 800);
    } else { // if no errot then check digits after decimal
        if (decimalPlaces(result) > 5) { // if there are more than 5 digits after the decimal then fix-it to 6 digits
            OUTPUT.innerHTML = result.toFixed(6);
        } else {
            OUTPUT.innerHTML = result;
        }
    }
}

/**** Start Logic ****/
KEYS.addEventListener('click', (e) => {
    btn_clicked = e.target.id;

    if (btn_clicked.includes('num')) {
        let num = parseInt(btn_clicked.substring(4));
        addNum(num);
    } else if (btn_clicked.includes('op')) {
        let op = btn_clicked.substring(3);
        switch (op) {
            case 'plus-minus':
                plusMinus();
                break;
            case 'divide':
                divide();
                break;
            case 'multiply':
                multiply();
                break;
            case 'minus':
                minus();
                break;
            case 'plus':
                plus();
                break;
            case 'equal':
                equal();
                break;
        }
    } else if (btn_clicked === 'clear') {clear();}
    else if (btn_clicked === 'backspace') {backspace();}
    else if (btn_clicked === 'decimal') {decimal();}

    /*
    console.log('result: ' + result);
    console.log('operationArray: ' + operationArray);
    */

    if (!done) { // don't update operation on screen after calculation (in order to show the operation and not replace it with the result -top screen-)
        updateDisplay(); // update display after the press of every button
    }
});
