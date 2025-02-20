describe('eventWillUnmount', () => {
    pushOptions({
        initialDate: '2014-08-01',
    });
    function testSingleEvent(singleEventData, done) {
        let callCnt = 0;
        expect(singleEventData.id).toBeTruthy();
        let calendar = initCalendar({
            events: [singleEventData],
            eventWillUnmount(arg) {
                callCnt += 1;
                if (callCnt === 1) { // only care about the first call. gets called again when calendar is destroyed
                    expect(arg.event.id).toBe(singleEventData.id);
                    done();
                }
            },
        });
        calendar.getEventById(singleEventData.id).remove();
    }
    describe('when in month view', () => {
        pushOptions({
            initialView: 'dayGridMonth',
        });
        it('gets called with removeEvents method', (done) => {
            setTimeout(() => {
                testSingleEvent({
                    id: '1',
                    title: 'event1',
                    date: '2014-08-02',
                }, done);
            }, 0);
        });
    });
    describe('when in week view', () => {
        pushOptions({
            initialView: 'timeGridWeek',
            scrollTime: '00:00:00',
        });
        it('gets called with removeEvents method', (done) => {
            setTimeout(() => {
                testSingleEvent({
                    id: '1',
                    title: 'event1',
                    date: '2014-08-02T02:00:00',
                }, done);
            }, 0);
        });
    });
});
export {};
//# sourceMappingURL=eventDestroy.js.map