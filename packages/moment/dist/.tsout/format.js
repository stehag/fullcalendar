import { convertToMoment } from './convert.js';
export function formatWithCmdStr(cmdStr, arg) {
    let cmd = parseCmdStr(cmdStr);
    if (arg.end) {
        let startMom = convertToMoment(arg.start.array, arg.timeZone, arg.start.timeZoneOffset, arg.localeCodes[0]);
        let endMom = convertToMoment(arg.end.array, arg.timeZone, arg.end.timeZoneOffset, arg.localeCodes[0]);
        return formatRange(cmd, createMomentFormatFunc(startMom), createMomentFormatFunc(endMom), arg.defaultSeparator);
    }
    return convertToMoment(arg.date.array, arg.timeZone, arg.date.timeZoneOffset, arg.localeCodes[0]).format(cmd.whole); // TODO: test for this
}
function createMomentFormatFunc(mom) {
    return (cmdStr) => (cmdStr ? mom.format(cmdStr) : '' // because calling with blank string results in ISO8601 :(
    );
}
function parseCmdStr(cmdStr) {
    let parts = cmdStr.match(/^(.*?)\{(.*)\}(.*)$/); // TODO: lookbehinds for escape characters
    if (parts) {
        let middle = parseCmdStr(parts[2]);
        return {
            head: parts[1],
            middle,
            tail: parts[3],
            whole: parts[1] + middle.whole + parts[3],
        };
    }
    return {
        head: null,
        middle: null,
        tail: null,
        whole: cmdStr,
    };
}
function formatRange(cmd, formatStart, formatEnd, separator) {
    if (cmd.middle) {
        let startHead = formatStart(cmd.head);
        let startMiddle = formatRange(cmd.middle, formatStart, formatEnd, separator);
        let startTail = formatStart(cmd.tail);
        let endHead = formatEnd(cmd.head);
        let endMiddle = formatRange(cmd.middle, formatStart, formatEnd, separator);
        let endTail = formatEnd(cmd.tail);
        if (startHead === endHead && startTail === endTail) {
            return startHead +
                (startMiddle === endMiddle ? startMiddle : startMiddle + separator + endMiddle) +
                startTail;
        }
    }
    let startWhole = formatStart(cmd.whole);
    let endWhole = formatEnd(cmd.whole);
    if (startWhole === endWhole) {
        return startWhole;
    }
    return startWhole + separator + endWhole;
}
//# sourceMappingURL=format.js.map