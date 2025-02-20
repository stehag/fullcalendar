import { preventDefault } from './dom-event.js';
let guidNumber = 0;
export function guid() {
    guidNumber += 1;
    return String(guidNumber);
}
/* FullCalendar-specific DOM Utilities
----------------------------------------------------------------------------------------------------------------------*/
// Make the mouse cursor express that an event is not allowed in the current area
export function disableCursor() {
    document.body.classList.add('fc-not-allowed');
}
// Returns the mouse cursor to its original look
export function enableCursor() {
    document.body.classList.remove('fc-not-allowed');
}
/* Selection
----------------------------------------------------------------------------------------------------------------------*/
export function preventSelection(el) {
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
    el.addEventListener('selectstart', preventDefault);
}
export function allowSelection(el) {
    el.style.userSelect = '';
    el.style.webkitUserSelect = '';
    el.removeEventListener('selectstart', preventDefault);
}
/* Context Menu
----------------------------------------------------------------------------------------------------------------------*/
export function preventContextMenu(el) {
    el.addEventListener('contextmenu', preventDefault);
}
export function allowContextMenu(el) {
    el.removeEventListener('contextmenu', preventDefault);
}
export function parseFieldSpecs(input) {
    let specs = [];
    let tokens = [];
    let i;
    let token;
    if (typeof input === 'string') {
        tokens = input.split(/\s*,\s*/);
    }
    else if (typeof input === 'function') {
        tokens = [input];
    }
    else if (Array.isArray(input)) {
        tokens = input;
    }
    for (i = 0; i < tokens.length; i += 1) {
        token = tokens[i];
        if (typeof token === 'string') {
            specs.push(token.charAt(0) === '-' ?
                { field: token.substring(1), order: -1 } :
                { field: token, order: 1 });
        }
        else if (typeof token === 'function') {
            specs.push({ func: token });
        }
    }
    return specs;
}
export function compareByFieldSpecs(obj0, obj1, fieldSpecs) {
    let i;
    let cmp;
    for (i = 0; i < fieldSpecs.length; i += 1) {
        cmp = compareByFieldSpec(obj0, obj1, fieldSpecs[i]);
        if (cmp) {
            return cmp;
        }
    }
    return 0;
}
export function compareByFieldSpec(obj0, obj1, fieldSpec) {
    if (fieldSpec.func) {
        return fieldSpec.func(obj0, obj1);
    }
    return flexibleCompare(obj0[fieldSpec.field], obj1[fieldSpec.field])
        * (fieldSpec.order || 1);
}
export function flexibleCompare(a, b) {
    if (!a && !b) {
        return 0;
    }
    if (b == null) {
        return -1;
    }
    if (a == null) {
        return 1;
    }
    if (typeof a === 'string' || typeof b === 'string') {
        return String(a).localeCompare(String(b));
    }
    return a - b;
}
/* String Utilities
----------------------------------------------------------------------------------------------------------------------*/
export function padStart(val, len) {
    let s = String(val);
    return '000'.substr(0, len - s.length) + s;
}
export function formatWithOrdinals(formatter, args, fallbackText) {
    if (typeof formatter === 'function') {
        return formatter(...args);
    }
    if (typeof formatter === 'string') { // non-blank string
        return args.reduce((str, arg, index) => (str.replace('$' + index, arg || '')), formatter);
    }
    return fallbackText;
}
/* Number Utilities
----------------------------------------------------------------------------------------------------------------------*/
export function compareNumbers(a, b) {
    return a - b;
}
export function isInt(n) {
    return n % 1 === 0;
}
/* Weird Utilities
----------------------------------------------------------------------------------------------------------------------*/
export function firstDefined(...args) {
    for (let i = 0; i < args.length; i += 1) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
/* FC-specific DOM dimension stuff
----------------------------------------------------------------------------------------------------------------------*/
export function computeSmallestCellWidth(cellEl) {
    let allWidthEl = cellEl.querySelector('.fc-scrollgrid-shrink-frame');
    let contentWidthEl = cellEl.querySelector('.fc-scrollgrid-shrink-cushion');
    if (!allWidthEl) {
        throw new Error('needs fc-scrollgrid-shrink-frame className'); // TODO: use const
    }
    if (!contentWidthEl) {
        throw new Error('needs fc-scrollgrid-shrink-cushion className');
    }
    return cellEl.getBoundingClientRect().width - allWidthEl.getBoundingClientRect().width + // the cell padding+border
        contentWidthEl.getBoundingClientRect().width;
}
//# sourceMappingURL=misc.js.map