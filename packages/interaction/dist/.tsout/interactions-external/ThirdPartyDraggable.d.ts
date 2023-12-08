import { DragMetaGenerator } from './ExternalElementDragging.js';
import { InferredElementDragging } from './InferredElementDragging.js';
export interface ThirdPartyDraggableSettings {
    eventData?: DragMetaGenerator;
    itemSelector?: string;
    mirrorSelector?: string;
}
export declare class ThirdPartyDraggable {
    dragging: InferredElementDragging;
    constructor(containerOrSettings?: EventTarget | ThirdPartyDraggableSettings, settings?: ThirdPartyDraggableSettings);
    destroy(): void;
}
//# sourceMappingURL=ThirdPartyDraggable.d.ts.map