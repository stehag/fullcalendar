const IGNORED_EVENTS = {
    load: true, // ignore when jQuery detaches the load event from the window
};
export class ListenerCounter {
    constructor(el) {
        this.delta = 0;
        this.jQueryStartCount = 0;
        this.el = el;
    }
    startWatching() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let t = this;
        let el = t.el;
        let origAddEventListened = el.addEventListener;
        let origRemoveEventListener = el.removeEventListener;
        el.addEventListener = (eventName, ...otherArgs) => {
            if (!IGNORED_EVENTS[eventName]) {
                t.delta += 1;
            }
            return origAddEventListened.call(el, eventName, ...otherArgs);
        };
        el.removeEventListener = (eventName, ...otherArgs) => {
            if (!IGNORED_EVENTS[eventName]) {
                t.delta -= 1;
            }
            return origRemoveEventListener.call(el, eventName, ...otherArgs);
        };
        this.jQueryStartCount = countJqueryListeners(el);
    }
    stopWatching() {
        delete this.el.addEventListener;
        delete this.el.removeEventListener;
        return this.computeDelta();
    }
    computeDelta() {
        return this.delta + (countJqueryListeners(this.el) - this.jQueryStartCount);
    }
}
function countJqueryListeners(el) {
    let hash = getJqueryHandlerHash(el);
    let cnt = 0;
    $.each(hash, (name, handlers) => {
        cnt += handlers.length;
    });
    return cnt;
}
function getJqueryHandlerHash(el) {
    return $._data($(el)[0], 'events') || {};
}
//# sourceMappingURL=ListenerCounter.js.map