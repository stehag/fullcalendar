import { filterHash, mapHash } from '../util/object.js';
import { mergeEventStores, createEmptyEventStore, filterEventStoreDefs, excludeSubEventStore, parseEvents, } from '../structs/event-store.js';
import { expandRecurring } from '../structs/recurring-event.js';
export function reduceEventStore(eventStore, action, eventSources, dateProfile, context) {
    switch (action.type) {
        case 'RECEIVE_EVENTS': // raw
            return receiveRawEvents(eventStore, eventSources[action.sourceId], action.fetchId, action.fetchRange, action.rawEvents, context);
        case 'RESET_RAW_EVENTS':
            return resetRawEvents(eventStore, eventSources[action.sourceId], action.rawEvents, dateProfile.activeRange, context);
        case 'ADD_EVENTS': // already parsed, but not expanded
            return addEvent(eventStore, action.eventStore, // new ones
            dateProfile ? dateProfile.activeRange : null, context);
        case 'RESET_EVENTS':
            return action.eventStore;
        case 'MERGE_EVENTS': // already parsed and expanded
            return mergeEventStores(eventStore, action.eventStore);
        case 'PREV': // TODO: how do we track all actions that affect dateProfile :(
        case 'NEXT':
        case 'CHANGE_DATE':
        case 'CHANGE_VIEW_TYPE':
            if (dateProfile) {
                return expandRecurring(eventStore, dateProfile.activeRange, context);
            }
            return eventStore;
        case 'REMOVE_EVENTS':
            return excludeSubEventStore(eventStore, action.eventStore);
        case 'REMOVE_EVENT_SOURCE':
            return excludeEventsBySourceId(eventStore, action.sourceId);
        case 'REMOVE_ALL_EVENT_SOURCES':
            return filterEventStoreDefs(eventStore, (eventDef) => (!eventDef.sourceId // only keep events with no source id
            ));
        case 'REMOVE_ALL_EVENTS':
            return createEmptyEventStore();
        default:
            return eventStore;
    }
}
function receiveRawEvents(eventStore, eventSource, fetchId, fetchRange, rawEvents, context) {
    if (eventSource && // not already removed
        fetchId === eventSource.latestFetchId // TODO: wish this logic was always in event-sources
    ) {
        let subset = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context);
        if (fetchRange) {
            subset = expandRecurring(subset, fetchRange, context);
        }
        return mergeEventStores(excludeEventsBySourceId(eventStore, eventSource.sourceId), subset);
    }
    return eventStore;
}
function resetRawEvents(existingEventStore, eventSource, rawEvents, activeRange, context) {
    const { defIdMap, instanceIdMap } = buildPublicIdMaps(existingEventStore);
    let newEventStore = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context, false, defIdMap, instanceIdMap);
    return expandRecurring(newEventStore, activeRange, context);
}
function transformRawEvents(rawEvents, eventSource, context) {
    let calEachTransform = context.options.eventDataTransform;
    let sourceEachTransform = eventSource ? eventSource.eventDataTransform : null;
    if (sourceEachTransform) {
        rawEvents = transformEachRawEvent(rawEvents, sourceEachTransform);
    }
    if (calEachTransform) {
        rawEvents = transformEachRawEvent(rawEvents, calEachTransform);
    }
    return rawEvents;
}
function transformEachRawEvent(rawEvents, func) {
    let refinedEvents;
    if (!func) {
        refinedEvents = rawEvents;
    }
    else {
        refinedEvents = [];
        for (let rawEvent of rawEvents) {
            let refinedEvent = func(rawEvent);
            if (refinedEvent) {
                refinedEvents.push(refinedEvent);
            }
            else if (refinedEvent == null) {
                refinedEvents.push(rawEvent);
            } // if a different falsy value, do nothing
        }
    }
    return refinedEvents;
}
function addEvent(eventStore, subset, expandRange, context) {
    if (expandRange) {
        subset = expandRecurring(subset, expandRange, context);
    }
    return mergeEventStores(eventStore, subset);
}
export function rezoneEventStoreDates(eventStore, oldDateEnv, newDateEnv) {
    let { defs } = eventStore;
    let instances = mapHash(eventStore.instances, (instance) => {
        let def = defs[instance.defId];
        if (def.allDay) {
            return instance; // isn't dependent on timezone
        }
        return Object.assign(Object.assign({}, instance), { range: {
                start: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.start, instance.forcedStartTzo)),
                end: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.end, instance.forcedEndTzo)),
            }, forcedStartTzo: newDateEnv.canComputeOffset ? null : instance.forcedStartTzo, forcedEndTzo: newDateEnv.canComputeOffset ? null : instance.forcedEndTzo });
    });
    return { defs, instances };
}
function excludeEventsBySourceId(eventStore, sourceId) {
    return filterEventStoreDefs(eventStore, (eventDef) => eventDef.sourceId !== sourceId);
}
// QUESTION: why not just return instances? do a general object-property-exclusion util
export function excludeInstances(eventStore, removals) {
    return {
        defs: eventStore.defs,
        instances: filterHash(eventStore.instances, (instance) => !removals[instance.instanceId]),
    };
}
function buildPublicIdMaps(eventStore) {
    const { defs, instances } = eventStore;
    const defIdMap = {};
    const instanceIdMap = {};
    for (let defId in defs) {
        const def = defs[defId];
        const { publicId } = def;
        if (publicId) {
            defIdMap[publicId] = defId;
        }
    }
    for (let instanceId in instances) {
        const instance = instances[instanceId];
        const def = defs[instance.defId];
        const { publicId } = def;
        if (publicId) {
            instanceIdMap[publicId] = instanceId;
        }
    }
    return { defIdMap, instanceIdMap };
}
//# sourceMappingURL=eventStore.js.map