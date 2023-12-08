import { WindowScrollController } from '@fullcalendar/core/internal';
import { ScrollGeomCache } from './ScrollGeomCache.js';
export class WindowScrollGeomCache extends ScrollGeomCache {
    constructor(doesListening) {
        super(new WindowScrollController(), doesListening);
    }
    getEventTarget() {
        return window;
    }
    computeClientRect() {
        return {
            left: this.scrollLeft,
            right: this.scrollLeft + this.clientWidth,
            top: this.scrollTop,
            bottom: this.scrollTop + this.clientHeight,
        };
    }
    // the window is the only scroll object that changes it's rectangle relative
    // to the document's topleft as it scrolls
    handleScrollChange() {
        this.clientRect = this.computeClientRect();
    }
}
//# sourceMappingURL=WindowScrollGeomCache.js.map