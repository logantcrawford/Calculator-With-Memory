const calc_display = document.querySelector('h1');
const input_btns = document.querySelectorAll('button');
const clear_btn = document.getElementById('clear-btn');

// Calculate first and second values depending on operator
const calculate = {
    '/' : (first_num, second_num) => first_num / second_num,
    '*' : (first_num, second_num) => first_num * second_num,
    '+' : (first_num, second_num) => first_num + second_num,
    '-' : (first_num, second_num) => first_num - second_num,
    '' : (first_num, second_num) => second_num,
};

let first_value = 0;
let operator_value = '';
let awaiting_next_value = false;
let memory_value = 0;
let error_log = false;

function send_number_value(number) {
    // Replace current display value if first value is entered
    if (awaiting_next_value) {
        calc_display.textContent = number;
        awaiting_next_value = false;
    } else {
        // If current display value is 0, replace it, if not add number.
        const display_value = calc_display.textContent;
        calc_display.textContent = display_value === '0' ? number : display_value + number;
    }
};

function add_decimal() {
    // if operator pressed, don't add decimal
    if (awaiting_next_value) return;
    // If no decimal, add one
    if (!calc_display.textContent.includes('.')) {
        calc_display.textContent = `${calc_display.textContent}.`;
    }
}

function use_operator(operator) {
    const current_value = Number(calc_display.textContent);
    try {
        if (!error_log) {
            // Prevent multiple operators
            if (operator_value && awaiting_next_value) {
                operator_value = operator;
                return;
            };
            // Assign first_value if no value
            if (!first_value) {
                first_value = current_value;
            } else {
                const calculation = calculate[operator_value](first_value, current_value);
                calc_display.textContent = calculation;
                first_value = calculation;
            }
            // Ready for next value, store operator
            awaiting_next_value = true;
            operator_value = operator;
        } else {
            calc_display.textContent = 'Error';
        }
    } catch(err) {
        calc_display.textContent = 'Error';
        error_log = true;
    }

};

// Handle memory
function use_memory(value) {
    let current_value = Number(calc_display.textContent);
    let short_term_display = calc_display.textContent;
    if (value == 'mc') {
        calc_display.textContent = 'Mem Cleared';
        setTimeout(wait, 500, short_term_display);
        memory_value = 0;
    } else if (value == 'mr') {
        calc_display.textContent = memory_value;
        current_value = memory_value;
    } else if (value == '+' || '-') {
        first_value = calc_display.textContent;
        const calculation = calculate[value](memory_value, current_value); 
        memory_value = calculation;
        calc_display.textContent = first_value;
    }
};

// Reset all values, Display (Except in memory)
function reset_all() {
    first_value = 0;
    error_log = false;
    operator_value = '';
    awaiting_next_value = false;
    calc_display.textContent = '0';
};

// Timer
function wait(short_term_display){
    calc_display.textContent = short_term_display;
 }

 // Add Event Listeners for numbers, operatiors, and decimal buttons
input_btns.forEach((input_btn) => {
    if (input_btn.classList.length === 0) {
        input_btn.addEventListener('click', () => send_number_value(input_btn.value));
    } else if (input_btn.classList.contains('operator')) {
        input_btn.addEventListener('click', () => use_operator(input_btn.value));
    } else if (input_btn.classList.contains('decimal')) {
        input_btn.addEventListener('click', () => add_decimal());
    } else if (input_btn.classList.contains('memory')) {
        input_btn.addEventListener('click', () => use_memory(input_btn.value));
    }
 });
// Event Listener
clear_btn.addEventListener('click', reset_all);