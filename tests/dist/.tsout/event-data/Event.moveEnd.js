describe('Event::moveEnd', () => {
    pushOptions({
        timeZone: 'UTC',
        defaultTimedEventDuration: '01:00',
    });
    describe('when event doesn\'t have an end', () => {
        pushOptions({
            events: [
                { id: '1', start: '2018-09-03T12:00:00' },
            ],
        });
        it('generates a new end', () => {
            initCalendar();
            let event = currentCalendar.getEventById('1');
            event.moveEnd('01:00');
            expect(event.start).toEqualDate('2018-09-03T12:00:00Z');
            expect(event.end).toEqualDate('2018-09-03T14:00:00Z');
        });
    });
    describe('when event does have an end', () => {
        pushOptions({
            events: [
                { id: '1', start: '2018-09-03T12:00:00', end: '2018-09-03T15:00:00' },
            ],
        });
        it('moves end', () => {
            initCalendar();
            let event = currentCalendar.getEventById('1');
            event.moveEnd('01:00');
            expect(event.start).toEqualDate('2018-09-03T12:00:00Z');
            expect(event.end).toEqualDate('2018-09-03T16:00:00Z');
        });
    });
});
export {};
//# sourceMappingURL=Event.moveEnd.js.map