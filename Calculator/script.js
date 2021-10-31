

/**
 * Buttons list from the children of div.calc-pad
 */
const buttons = [...document.getElementsByClassName('calc-pad')[0].children].map(c => [...c.children]).flat().filter(i => i.getAttribute('data-type') !== 'units' && i.tagName === "BUTTON");
/**
 * Adding click listeners to every button from the buttons list
 */
buttons.forEach(btn => btn.addEventListener("click", handleBtn));

/**
 * Calculator states: current, previous, operation
 */
let state = ['0', '0', null];

/**
 * Current global radix of the calculator
 */
let radix = 10;

/**
 * Dictionary of special keys in the calculator
 */
const keys = {
    clean: '⟲',
    del: '⌫',
    negate: '±',
    perc: '%',
    plus: '+',
    minus: '-',
    multiplication: '×',
    division: '／',
    eval: '＝',
    toBinary: 'X₂',
    toNormal: 'X₁₀',
    toHex: 'X₁₆',
}

/**
 * Function to handle radix change. Controls states of HTML elements.
 * @param {number} r 
 */
function setRadix(r) {
    radix = r;
    let hexNums = document.querySelectorAll("[data-radix='16']");
    let nums = document.querySelectorAll("[data-radix='10']");
    let binNums = document.querySelectorAll("[data-radix='2']");

    switch (r) {
        case 2:
            document.querySelector('[data-type="binary"]').classList.add('active');
            document.querySelector('[data-type="decimal"]').classList.remove('active');
            document.querySelector('[data-type="hex"]').classList.remove('active');
            break;

        case 10:
            document.querySelector('[data-type="binary"]').classList.remove('active');
            document.querySelector('[data-type="decimal"]').classList.add('active');
            document.querySelector('[data-type="hex"]').classList.remove('active');
            break;

        case 16:
            document.querySelector('[data-type="binary"]').classList.remove('active');
            document.querySelector('[data-type="decimal"]').classList.remove('active');
            document.querySelector('[data-type="hex"]').classList.add('active');
            break;

        default:
            radix = 10;
            document.querySelector('[data-type="binary"]').disabled = false;
            document.querySelector('[data-type="decimal"]').disabled = true;
            document.querySelector('[data-type="hex"]').disabled = false;
            break;
    }

    r >= 16 ? hexNums.forEach(n => n.disabled = false) : hexNums.forEach(n => n.disabled = true);
    r >= 10 ? nums.forEach(n => n.disabled = false) : nums.forEach(n => n.disabled = true);
    r >= 2 ? binNums.forEach(n => n.disabled = false) : binNums.forEach(n => n.disabled = true);
}

/**
 * Alternitve to parseInt for numbers with floating point
 * @returns {Number} parsed number
 */
function parseFloat(string, radix) {
    let res;
    const [i, d] = string.split('.');
    const iNum = parseInt(i, radix);
    const sign = Infinity / iNum === Infinity ? 1 : -1
    res = iNum

    if (d) {
        const dNum = parseInt(d, radix);
        const dLength = Math.max(dNum.toString(radix).length, d.length);
        res = iNum + sign * dNum / radix ** dLength;
    }

    return res;
}

/**
 * Calculate from states
 */
function evaluate() {
    switch (state[2]) {
        case keys.plus:
            state[0] = (parseFloat(state[1], radix) + parseFloat(state[0], radix)).toString(radix);
            state[2] = keys.plus
            break;

        case keys.minus:
            console.log(state[1], state[0])
            state[0] = (parseFloat(state[1], radix) - parseFloat(state[0], radix)).toString(radix);
            break;

        case keys.multiplication:
            state[0] = (parseFloat(state[1], radix) * parseFloat(state[0], radix)).toString(radix);
            break;

        case keys.division:
            state[0] = (parseFloat(state[1], radix) / parseFloat(state[0], radix)).toString(radix);
            break;
    }
    state[2] = null;
    state[1] = '0';
}

/**
 * Handles buttton clicks
 * @param {Event} e 
 */
function handleBtn(e) {
    const key = (e.type === 'click' ? e.target.textContent.trim() : e.key);

    /**
     * Checks if the key is either number or '.' or exists in the special keys dictionary
     */
    if (!isNaN(key) || Object.keys(keys).find(k => keys[k] === key) || '.') {
        handleKey(key);
    }
    updateCalc();
}

/**
 * Update calculator element values
 */
function updateCalc() {
    document.getElementsByClassName('calc-result')[0].textContent = format(state[0]);
    if (state[2]) {
        document.getElementsByClassName('calc-history')[0].textContent = `${format(state[1])} ${state[2]}`
    } else {
        document.getElementsByClassName('calc-history')[0].textContent = 0
    }

    /**
     * Sync div.units-output with the entered number
     */
    state[2] ? handleCalcValueChange(parseFloat(state[1], radix)) : handleCalcValueChange(parseFloat(state[0], radix));
}

/**
 * Format number
*/
function format(num) {
    const str = num.toString(radix);

    const ints = str.split('.')[0];
    const decimals = str.split('.')[1];

    let res = ints ? ints.replace(/,(?=[^\s])/g, " ") : "0";
    return decimals ? `${res}.${decimals}`.toUpperCase() : res.toUpperCase()
}

/**
 * Disables input numbers
 */
function lockdown() {
    buttons.forEach(b => b.disabled = true);
    document.querySelector('[data-button="reset"]').disabled = false;
}

/**
 * Resets calculator states and buttons
 */
function reset() {
    state = ['0', '0', null]
    buttons.forEach(b => b.disabled = false);
    setRadix(radix);
}
/**
 * Handles pressed key
 * @param {*} key 
 */
function handleKey(key) {
    switch (key) {
        /**
         * Evaluate: calculate data from states
         * @author Akbarshokh Sobirov
         */
        case keys.eval:
            evaluate();
            if (isNaN(state[0])) {
                lockdown()
            }
            break;

        /**
         * Handles all keys from keys Object
         */
        case Object.keys(keys).find(k => keys[k] === key) && key:
            switch (key) {
                /**
                 * Clean: reset all states
                 * @author Akbarshokh Sobirov
                 */
                case keys.clean:
                    reset();
                    break;

                /**
                 * Deletion: remove last character of the state[0]
                 * @author Akbarshokh Sobirov
                 */
                case keys.del:
                    if (!!state[0]) {
                        state[0] = state[0].toString(radix).slice(0, -1)
                    } else {
                        state[0] = '0'
                    }
                    break;

                /**
                 * Subtraction
                 * @author Akbarshokh Sobirov
                 */
                case keys.negate:
                    const neg = -parseFloat(state[0], radix);
                    if (neg) {
                        state[0] = neg;
                    }
                    break;

                case keys.perc:
                    state[0] = state[0] / 100
                    break;

                /**
                 * Function to convert to hexidecimal system
                 * @author 
                 */
                case keys.toHex:
                    state[0] = parseFloat(state[0], radix).toString(16);
                    state[1] = parseFloat(state[1], radix).toString(16);

                    setRadix(16)
                    updateCalc();

                    break;

                /**
                 * Function to convert to decimal system
                 * @author
                 */
                case keys.toNormal:
                    state[0] = parseFloat(state[0], radix).toString(10);
                    state[1] = parseFloat(state[1], radix).toString(10);

                    setRadix(10)
                    updateCalc();

                    break;

                /**
                 * Function to convert to binary numeral system
                 * @author
                 */
                case keys.toBinary:
                    state[0] = parseFloat(state[0], radix).toString(2);
                    state[1] = parseFloat(state[1], radix).toString(2);

                    setRadix(2);
                    updateCalc();

                    break;

                /**
                 * Handles the state transfer
                 * @author Akbarshokh Sobirov
                 */
                default:
                    state[2] = key;
                    state[1] = state[0];
                    state[0] = '0';
            }
            break;

        /**
         * Used to add decimal point
         */
        case '.':
            if (state[0].includes('.')) {
                break;
            }
            state[0] += '.'
            break;

        /**
         * Default function (case) to handle entered number
         */
        default:
            if (key) {
                state[0] = parseFloat(state[0] + key, radix).toString(radix);
            }
            break;
    }
}

const selectElement = document.querySelector('.select-unit');
const unitBtns = document.querySelectorAll('[data-type=units]');
const unitsOutput = document.querySelector('.units-output');

selectElement.addEventListener('change', handleUnitSystemChange);

/**
 * Unit buttons' click listener
 */
unitBtns.forEach(b => b.addEventListener('click', handleUnitBtnClick))

const units = {
    temp: 'Temperature',
    mass: 'Mass',
    length: "Length"
}

const unitKeys = {
    fahrenheit: '°F',
    celsius: '°C'
}

/**
 * Units states: selected unit (from), value in selected unit
 */
unitsState = ['', ''];

/**
 * Update output, unit buttons content and states 
 * @param {string} first unit button 
 * @param {string} second unit button
 */
function updateUnitBtns(f, s) {
    unitsState[0] = f
    handleUnitKey(f);

    unitBtns.forEach(b => b.disabled = false);
    unitBtns[0].textContent = f;
    unitBtns[0].classList.add('active');

    unitBtns[1].textContent = s;
    unitBtns[1].classList.remove('active');

    unitsOutput.classList.remove('disabled');
}

/**
 * Function to handle select changes
 * @param {*} e 
 */
function handleUnitSystemChange(e) {
    switch (e.target.value) {
        case units.temp:
            updateUnitBtns(unitKeys.celsius, unitKeys.fahrenheit);
            break;

        case units.mass:
            break;

        default:
            unitBtns.forEach(b => {
                b.textContent = ''
                b.classList.remove('active');
                b.disabled = true;
            })
            unitsOutput.classList.add('disabled');
            unitsOutput.textContent = unitsState[1]
            break;
    }
}

/**
 * Function to update current value
 * @param {Number} value with base of 10 
 */
function handleCalcValueChange(newVal) {
    unitsState[1] = newVal
    handleUnitKey(unitsState[0]);
}

/**
 * Function to calculte units
 * @param {unitKeys} key 
 */
function handleUnitKey(key) {
    switch (key) {
        /**
         * Calculates celsium in fahrenheit
         * @author Beier Wang
         */
        case unitKeys.celsius:
            unitsState[0] = unitKeys.celsius;
            let fahrenheit = unitsState[1] * 9 / 5 + 32;
            unitsOutput.textContent = ((Number(fahrenheit.toFixed(2)).toPrecision(8) / 1).toString().substring(0, 9) + unitKeys.fahrenheit);
            break;

        /**
         * Calculates celsium in fahrenheit
         * @author Beier Wang
         */
        case unitKeys.fahrenheit:
            unitsState[0] = unitKeys.fahrenheit;
            let celsius = (unitsState[1] - 32) * 5 / 9;
            unitsOutput.textContent = ((Number(celsius.toFixed(2)).toPrecision(8) / 1).toString().substring(0, 9) + unitKeys.celsius);
            break;

        default:
            break;
    }
}

/**
 * Function to handle unit button click
 * @param {Event} e 
 */

function handleUnitBtnClick(e) {
    const key = e.target.textContent;
    handleUnitKey(key)
    unitBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
}