import { addMs, startOfDay, addDays } from './datelib/marker.js';
import { createDuration } from './datelib/duration.js';
import { ViewContextType } from './ViewContext.js';
import { Component } from './preact.js';
import { getNow } from './reducers/current-date.js';
export class NowTimer extends Component {
    constructor(props, context) {
        super(props, context);
        this.initialNowDate = getNow(context.options.now, context.dateEnv);
        this.initialNowQueriedMs = new Date().valueOf();
        this.state = this.computeTiming().currentState;
    }
    render() {
        let { props, state } = this;
        return props.children(state.nowDate, state.todayRange);
    }
    componentDidMount() {
        this.setTimeout();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.unit !== this.props.unit) {
            this.clearTimeout();
            this.setTimeout();
        }
    }
    componentWillUnmount() {
        this.clearTimeout();
    }
    computeTiming() {
        let { props, context } = this;
        let unroundedNow = addMs(this.initialNowDate, new Date().valueOf() - this.initialNowQueriedMs);
        let currentUnitStart = context.dateEnv.startOf(unroundedNow, props.unit);
        let nextUnitStart = context.dateEnv.add(currentUnitStart, createDuration(1, props.unit));
        let waitMs = nextUnitStart.valueOf() - unroundedNow.valueOf();
        // there is a max setTimeout ms value (https://stackoverflow.com/a/3468650/96342)
        // ensure no longer than a day
        waitMs = Math.min(1000 * 60 * 60 * 24, waitMs);
        return {
            currentState: { nowDate: currentUnitStart, todayRange: buildDayRange(currentUnitStart) },
            nextState: { nowDate: nextUnitStart, todayRange: buildDayRange(nextUnitStart) },
            waitMs,
        };
    }
    setTimeout() {
        let { nextState, waitMs } = this.computeTiming();
        this.timeoutId = setTimeout(() => {
            this.setState(nextState, () => {
                this.setTimeout();
            });
        }, waitMs);
    }
    clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}
NowTimer.contextType = ViewContextType;
function buildDayRange(date) {
    let start = startOfDay(date);
    let end = addDays(start, 1);
    return { start, end };
}
//# sourceMappingURL=NowTimer.js.map