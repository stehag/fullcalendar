import { DateTime as LuxonDateTime, Duration as LuxonDuration } from 'luxon';
import { CalendarImpl } from '@fullcalendar/core/internal';
export function toLuxonDateTime(date, calendar) {
    if (!(calendar instanceof CalendarImpl)) {
        throw new Error('must supply a CalendarApi instance');
    }
    let { dateEnv } = calendar.getCurrentData();
    return LuxonDateTime.fromJSDate(date, {
        zone: dateEnv.timeZone,
        locale: dateEnv.locale.codes[0],
    });
}
export function toLuxonDuration(duration, calendar) {
    if (!(calendar instanceof CalendarImpl)) {
        throw new Error('must supply a CalendarApi instance');
    }
    let { dateEnv } = calendar.getCurrentData();
    return LuxonDuration.fromObject(Object.assign(Object.assign({}, duration), { locale: dateEnv.locale.codes[0] }));
}
// Internal Utils
export function luxonToArray(datetime) {
    return [
        datetime.year,
        datetime.month - 1,
        datetime.day,
        datetime.hour,
        datetime.minute,
        datetime.second,
        datetime.millisecond,
    ];
}
export function arrayToLuxon(arr, timeZone, locale) {
    return LuxonDateTime.fromObject({
        zone: timeZone,
        locale,
        year: arr[0],
        month: arr[1] + 1,
        day: arr[2],
        hour: arr[3],
        minute: arr[4],
        second: arr[5],
        millisecond: arr[6],
    });
}
//# sourceMappingURL=convert.js.map