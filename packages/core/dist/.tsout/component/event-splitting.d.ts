import { EventStore } from '../structs/event-store.js';
import { EventDef } from '../structs/event-def.js';
import { EventInteractionState } from '../interactions/event-interaction-state.js';
import { EventUiHash, EventUi } from './event-ui.js';
import { DateSpan } from '../structs/date-span.js';
export interface SplittableProps {
    businessHours: EventStore | null;
    dateSelection: DateSpan | null;
    eventStore: EventStore;
    eventUiBases: EventUiHash;
    eventSelection: string;
    eventDrag: EventInteractionState | null;
    eventResize: EventInteractionState | null;
}
export declare abstract class Splitter<PropsType extends SplittableProps = SplittableProps> {
    private getKeysForEventDefs;
    private splitDateSelection;
    private splitEventStore;
    private splitIndividualUi;
    private splitEventDrag;
    private splitEventResize;
    private eventUiBuilders;
    abstract getKeyInfo(props: PropsType): {
        [key: string]: {
            ui?: EventUi;
            businessHours?: EventStore;
        };
    };
    abstract getKeysForDateSpan(dateSpan: DateSpan): string[];
    abstract getKeysForEventDef(eventDef: EventDef): string[];
    splitProps(props: PropsType): {
        [key: string]: SplittableProps;
    };
    private _splitDateSpan;
    private _getKeysForEventDefs;
    private _splitEventStore;
    private _splitIndividualUi;
    private _splitInteraction;
}
//# sourceMappingURL=event-splitting.d.ts.map