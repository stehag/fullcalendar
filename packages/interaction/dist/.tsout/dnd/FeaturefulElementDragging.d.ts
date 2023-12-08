import { PointerDragEvent, ElementDragging } from '@fullcalendar/core/internal';
import { PointerDragging } from './PointerDragging.js';
import { ElementMirror } from './ElementMirror.js';
import { AutoScroller } from './AutoScroller.js';
export declare class FeaturefulElementDragging extends ElementDragging {
    private containerEl;
    pointer: PointerDragging;
    mirror: ElementMirror;
    autoScroller: AutoScroller;
    delay: number | null;
    minDistance: number;
    touchScrollAllowed: boolean;
    mirrorNeedsRevert: boolean;
    isInteracting: boolean;
    isDragging: boolean;
    isDelayEnded: boolean;
    isDistanceSurpassed: boolean;
    delayTimeoutId: number | null;
    constructor(containerEl: HTMLElement, selector?: string);
    destroy(): void;
    onPointerDown: (ev: PointerDragEvent) => void;
    onPointerMove: (ev: PointerDragEvent) => void;
    onPointerUp: (ev: PointerDragEvent) => void;
    startDelay(ev: PointerDragEvent): void;
    handleDelayEnd(ev: PointerDragEvent): void;
    handleDistanceSurpassed(ev: PointerDragEvent): void;
    tryStartDrag(ev: PointerDragEvent): void;
    tryStopDrag(ev: PointerDragEvent): void;
    stopDrag(ev: PointerDragEvent): void;
    setIgnoreMove(bool: boolean): void;
    setMirrorIsVisible(bool: boolean): void;
    setMirrorNeedsRevert(bool: boolean): void;
    setAutoScrollEnabled(bool: boolean): void;
}
//# sourceMappingURL=FeaturefulElementDragging.d.ts.map