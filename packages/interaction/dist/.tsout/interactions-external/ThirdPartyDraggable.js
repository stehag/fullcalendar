import { ExternalElementDragging } from './ExternalElementDragging.js';
import { InferredElementDragging } from './InferredElementDragging.js';
/*
Bridges third-party drag-n-drop systems with FullCalendar.
Must be instantiated and destroyed by caller.
*/
export class ThirdPartyDraggable {
    constructor(containerOrSettings, settings) {
        let containerEl = document;
        if (
        // wish we could just test instanceof EventTarget, but doesn't work in IE11
        containerOrSettings === document ||
            containerOrSettings instanceof Element) {
            containerEl = containerOrSettings;
            settings = settings || {};
        }
        else {
            settings = (containerOrSettings || {});
        }
        let dragging = this.dragging = new InferredElementDragging(containerEl);
        if (typeof settings.itemSelector === 'string') {
            dragging.pointer.selector = settings.itemSelector;
        }
        else if (containerEl === document) {
            dragging.pointer.selector = '[data-event]';
        }
        if (typeof settings.mirrorSelector === 'string') {
            dragging.mirrorSelector = settings.mirrorSelector;
        }
        new ExternalElementDragging(dragging, settings.eventData); // eslint-disable-line no-new
    }
    destroy() {
        this.dragging.destroy();
    }
}
//# sourceMappingURL=ThirdPartyDraggable.js.map