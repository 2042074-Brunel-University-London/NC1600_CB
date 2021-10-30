


const buttons = [...document.getElementsByClassName('calc-pad')[0].children]

buttons.forEach(btn => {
    btn.addEventListener("click", handleBtn)
})

document.addEventListener('keyup', handleBtn);

// current, previous, operation
let state = ['0', '0', null];
let radix = 10;
let isDirty = false;

console.log(radix)

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
    toHex: 'X₁₆'
}

function getByDataType(t) {
    if (t instanceof Array) {
        let elements = []
        t.forEach(type => {
            elements.push(document.querySelector(`[data-type="${type}"]`))
        })
    }
}

function setRadix(r) {
    radix = r;
    switch (r) {
        case 2:
            console.log(document.querySelector('[data-type="binary"]'))
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
    }
}

function format(num) {
    const str = num.toString();
    const ints = parseInt(str.split('.')[0], radix);
    const decimals = str.split('.')[1];

    let res
    if (!ints) {
        res = '0';
    } else {
        res = ints.toLocaleString('en', { maximumFractionDigits: 0 }).replace(/,(?=[^\s])/g, " ")
    }
    return decimals ? `${res}.${decimals}` : res

}

function updateCalc() {
    document.getElementsByClassName('calc-result')[0].textContent = format(state[0]);

    if (state[2]) {
        document.getElementsByClassName('calc-history')[0].textContent = `${format(state[1])} ${state[2]}`
    } else {
        document.getElementsByClassName('calc-history')[0].textContent = 0
    }
}

function evaluate() {
    switch (state[2]) {
        case keys.plus:
            state[0] = (parseInt(state[1], radix) + parseInt(state[0], radix)).toString(radix);
            state[2] = keys.plus
            break;

        case keys.minus:
            state[0] = (parseInt(state[1], radix) - parseInt(state[0], radix)).toString(radix);
            break;

        case keys.multiplication:
            state[0] = (parseInt(state[1], radix) * parseInt(state[0], radix)).toString(radix);
            break;

        case keys.division:
            state[0] = (parseInt(state[1], radix) / parseInt(state[0], radix)).toString(radix);
            break;
    }
    state[2] = null;
    state[1] = '';
}

function handleBtn(e) {
    const key = (e.type === 'click' ? e.target.textContent.trim() : e.key);

    if (!isNaN(key) || Object.keys(keys).find(k => keys[k] === key)) {
        isDirty = true
        handleKey(key);
    }
    updateCalc();
}

function handleKey(key) {
    switch (key) {

        case keys.eval:
            evaluate();
            break;

        case Object.keys(keys).find(k => keys[k] === key) && key:
            switch (key) {
                case keys.clean:
                    state = ['', '', null]
                    break;

                case keys.del:
                    if (!!state[0]) {
                        state[0] = state[0].toString(radix).slice(0, -1)
                    } else {
                        state[0] = ''
                    }
                    break;

                case keys.negate:
                    const neg = -parseInt(state[0], radix);
                    if (neg) {
                        state[0] = neg;
                    }
                    break;

                case keys.perc:
                    state[0] = state[0] / 100
                    break;

                case keys.toHex:

                    state[0] = parseInt(state[0], radix).toString(16);
                    state[1] = parseInt(state[1], radix).toString(16);

                    setRadix(16)
                    console.log('New Hex Values', state[0], state[1]);
                    break;

                case keys.toNormal:
                    state[0] = parseInt(state[0], radix).toString(10);
                    state[1] = parseInt(state[1], radix).toString(10);

                    setRadix(10)
                    console.log('New Decimal Values', state[0], state[1]);
                    break;

                case keys.toBinary:
                    state[0] = parseInt(state[0], radix).toString(2);
                    state[1] = parseInt(state[1], radix).toString(2);

                    setRadix(2)
                    console.log('New Binary Values', state[0], state[1]);
                    break;

                default:
                    if (state[1]) {
                        state[2] = key
                    }
                    state[2] = key;
                    state[1] = state[0];
                    state[0] = '';
            }
            break;

        default:
            if (key) {
                if (key === '.' && state[0].includes('.')) {
                    break;
                }
                state[0] = state[0].toString() + key.toString()
            }
    }
}
// let calcHistory = '';
// let calcResult = '';
// let operation = null;


// function reset() {
//     calcHistory = '';
//     calcResult = ''

//     document.getElementsByClassName('calc-history')[0].textContent = '0'
//     document.getElementsByClassName('calc-result')[0].textContent = '0'
// }

// function formatStr(i) {
//     return parseFloat(i.trim()).toLocaleString('en').replace(/,(?=[^\s])/g, " ");
// }

// function numToStr(i) {
//     return i.replace(/\s/g, '')
// }

// function setHtml() {
//     document.getElementsByClassName('calc-history')[0].textContent = formatStr(calcHistory);
//     document.getElementsByClassName('calc-result')[0].textContent = formatStr(calcResult)
// }

// function makeCalc(key) {
//     operation = key;
//     calcHistory += key
//     setHtml()
//     // document.getElementsByClassName('calc-result')[0].textContent = '0'
// }

// function handleBtn(e) {
//     console.log(calcHistory, calcResult)
//     const keys = {
//         clean: 'C',
//         del: '⟲',
//         negate: '±',
//         perc: '%',
//         plus: '+',
//         minus: '-',
//         multiplication: '×',
//         division: '／',
//         eval: '＝',
//         dot: '.'
//     }

//     const pressedKey = e.target.textContent.trim();

//     switch (pressedKey) {
//         case keys.eval:
//             break;

//         case Object.keys(keys).find(key => keys[key] === pressedKey) && pressedKey:

//             switch (pressedKey) {
//                 case keys.clean:
//                     reset()
//                     break;

//                 case keys.del:
//                     calcHistory = calcHistory.slice(0, -1)
//                     calcResult = calcResult.slice(0, -1)
//                     setHtml()
//                     break;

//                 default:
//                     if (!operation || operation != pressedKey) {
//                         makeCalc(pressedKey)
//                     }


//             }
//             break;

//         default:
//             if (calcResult.length < 15) {
//                 calcHistory += pressedKey;
//                 calcResult += pressedKey;

//                 setHtml();
//             }
//     }
// }