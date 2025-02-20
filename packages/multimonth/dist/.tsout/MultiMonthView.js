import { DateComponent, ViewContainer, intersectRanges, createDuration, memoize, createFormatter, isPropsEqual, formatIsoMonthStr, } from '@fullcalendar/core/internal';
import { buildDayTableRenderRange } from '@fullcalendar/daygrid/internal';
import { createElement, createRef } from '@fullcalendar/core/preact';
import { SingleMonth } from './SingleMonth.js';
export class MultiMonthView extends DateComponent {
    constructor() {
        super(...arguments);
        this.splitDateProfileByMonth = memoize(splitDateProfileByMonth);
        this.buildMonthFormat = memoize(buildMonthFormat);
        this.scrollElRef = createRef();
        this.firstMonthElRef = createRef();
        this.needsScrollReset = false;
        this.handleSizing = (isForced) => {
            if (isForced) {
                this.updateSize();
            }
        };
    }
    render() {
        const { context, props, state } = this;
        const { options } = context;
        const { clientWidth, clientHeight } = state;
        const monthHPadding = state.monthHPadding || 0;
        const colCount = Math.min(clientWidth != null ?
            Math.floor(clientWidth / (options.multiMonthMinWidth + monthHPadding)) :
            1, options.multiMonthMaxColumns) || 1;
        const monthWidthPct = (100 / colCount) + '%';
        const monthTableWidth = clientWidth == null ? null :
            (clientWidth / colCount) - monthHPadding;
        const isLegitSingleCol = clientWidth != null && colCount === 1;
        const monthDateProfiles = this.splitDateProfileByMonth(context.dateProfileGenerator, props.dateProfile, context.dateEnv, isLegitSingleCol ? false : options.fixedWeekCount, options.showNonCurrentDates);
        const monthTitleFormat = this.buildMonthFormat(options.multiMonthTitleFormat, monthDateProfiles);
        const rootClassNames = [
            'fc-multimonth',
            isLegitSingleCol ?
                'fc-multimonth-singlecol' :
                'fc-multimonth-multicol',
            (monthTableWidth != null && monthTableWidth < 400) ?
                'fc-multimonth-compact' :
                '',
        ];
        return (createElement(ViewContainer, { elRef: this.scrollElRef, elClasses: rootClassNames, viewSpec: context.viewSpec }, monthDateProfiles.map((monthDateProfile, i) => {
            const monthStr = formatIsoMonthStr(monthDateProfile.currentRange.start);
            return (createElement(SingleMonth, Object.assign({}, props, { key: monthStr, isoDateStr: monthStr, elRef: i === 0 ? this.firstMonthElRef : undefined, titleFormat: monthTitleFormat, dateProfile: monthDateProfile, width: monthWidthPct, tableWidth: monthTableWidth, clientWidth: clientWidth, clientHeight: clientHeight })));
        })));
    }
    componentDidMount() {
        this.updateSize();
        this.context.addResizeHandler(this.handleSizing);
        this.requestScrollReset();
    }
    componentDidUpdate(prevProps) {
        if (!isPropsEqual(prevProps, this.props)) { // an external change?
            this.handleSizing(false);
        }
        if (prevProps.dateProfile !== this.props.dateProfile) {
            this.requestScrollReset();
        }
        else {
            this.flushScrollReset();
        }
    }
    componentWillUnmount() {
        this.context.removeResizeHandler(this.handleSizing);
    }
    updateSize() {
        const scrollEl = this.scrollElRef.current;
        const firstMonthEl = this.firstMonthElRef.current;
        if (scrollEl) {
            this.setState({
                clientWidth: scrollEl.clientWidth,
                clientHeight: scrollEl.clientHeight,
            });
        }
        if (firstMonthEl && scrollEl) {
            if (this.state.monthHPadding == null) { // always remember initial non-zero value
                this.setState({
                    monthHPadding: scrollEl.clientWidth - // go within padding
                        firstMonthEl.firstChild.offsetWidth,
                });
            }
        }
    }
    requestScrollReset() {
        this.needsScrollReset = true;
        this.flushScrollReset();
    }
    flushScrollReset() {
        if (this.needsScrollReset &&
            this.state.monthHPadding != null // indicates sizing already happened
        ) {
            const { currentDate } = this.props.dateProfile;
            const scrollEl = this.scrollElRef.current;
            const monthEl = scrollEl.querySelector(`[data-date="${formatIsoMonthStr(currentDate)}"]`);
            scrollEl.scrollTop = monthEl.getBoundingClientRect().top -
                this.firstMonthElRef.current.getBoundingClientRect().top;
            this.needsScrollReset = false;
        }
    }
    // workaround for when queued setState render (w/ clientWidth) gets cancelled because
    // subsequent update and shouldComponentUpdate says not to render :(
    shouldComponentUpdate() {
        return true;
    }
}
// date profile
// -------------------------------------------------------------------------------------------------
const oneMonthDuration = createDuration(1, 'month');
function splitDateProfileByMonth(dateProfileGenerator, dateProfile, dateEnv, fixedWeekCount, showNonCurrentDates) {
    const { start, end } = dateProfile.currentRange;
    let monthStart = start;
    const monthDateProfiles = [];
    while (monthStart.valueOf() < end.valueOf()) {
        const monthEnd = dateEnv.add(monthStart, oneMonthDuration);
        const currentRange = {
            // yuck
            start: dateProfileGenerator.skipHiddenDays(monthStart),
            end: dateProfileGenerator.skipHiddenDays(monthEnd, -1, true),
        };
        let renderRange = buildDayTableRenderRange({
            currentRange,
            snapToWeek: true,
            fixedWeekCount,
            dateEnv,
        });
        renderRange = {
            // yuck
            start: dateProfileGenerator.skipHiddenDays(renderRange.start),
            end: dateProfileGenerator.skipHiddenDays(renderRange.end, -1, true),
        };
        const activeRange = dateProfile.activeRange ?
            intersectRanges(dateProfile.activeRange, showNonCurrentDates ? renderRange : currentRange) :
            null;
        monthDateProfiles.push({
            currentDate: dateProfile.currentDate,
            isValid: dateProfile.isValid,
            validRange: dateProfile.validRange,
            renderRange,
            activeRange,
            currentRange,
            currentRangeUnit: 'month',
            isRangeAllDay: true,
            dateIncrement: dateProfile.dateIncrement,
            slotMinTime: dateProfile.slotMaxTime,
            slotMaxTime: dateProfile.slotMinTime,
        });
        monthStart = monthEnd;
    }
    return monthDateProfiles;
}
// date formatting
// -------------------------------------------------------------------------------------------------
const YEAR_MONTH_FORMATTER = createFormatter({ year: 'numeric', month: 'long' });
const YEAR_FORMATTER = createFormatter({ month: 'long' });
function buildMonthFormat(formatOverride, monthDateProfiles) {
    return formatOverride ||
        ((monthDateProfiles[0].currentRange.start.getUTCFullYear() !==
            monthDateProfiles[monthDateProfiles.length - 1].currentRange.start.getUTCFullYear())
            ? YEAR_MONTH_FORMATTER
            : YEAR_FORMATTER);
}
//# sourceMappingURL=MultiMonthView.js.map