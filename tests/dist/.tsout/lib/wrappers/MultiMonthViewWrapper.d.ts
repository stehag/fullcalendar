import { Calendar } from '@fullcalendar/core';
import { ViewWrapper } from './ViewWrapper.js';
export declare class MultiMonthViewWrapper extends ViewWrapper {
    constructor(calendar: Calendar);
    getMonths(): {
        el: HTMLElement;
        title: string;
        columnCnt: number;
    }[];
    getEventEls(): HTMLElement[];
    getScrollerEl(): HTMLElement;
}
//# sourceMappingURL=MultiMonthViewWrapper.d.ts.map