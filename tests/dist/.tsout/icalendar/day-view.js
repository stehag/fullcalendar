import fetchMock from 'fetch-mock';
import timeGridPlugin from '@fullcalendar/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import oneHourMeeting from './data/oneHourMeeting.js';
import recurringWeekly from './data/recurringWeekly.js';
import mungedOneHourMeeting from './data/mungedOneHourMeeting.js';
import meetingWithMungedStart from './data/meetingWithMungedStart.js';
import alldayEvent from './data/alldayEvent.js';
import timedMeetingWithoutEnd from './data/timedMeetingWithoutEnd.js';
import timedMeetingWithDuration from './data/timedMeetingWithDuration.js';
import dataWithRecurrenceId from './data/recurrenceId.js';
import { CalendarWrapper } from '../lib/wrappers/CalendarWrapper.js';
import { TimeGridViewWrapper } from '../lib/wrappers/TimeGridViewWrapper.js';
describe('addICalEventSource with day view', () => {
    const ICAL_MIME_TYPE = 'text/calendar';
    pushOptions({
        plugins: [iCalendarPlugin, timeGridPlugin],
        initialDate: '2019-04-15',
        initialView: 'timeGridDay',
        timeZone: 'Europe/Paris',
    });
    afterEach(() => {
        fetchMock.restore();
    });
    it('adds a one-hour long meeting', (done) => {
        loadICalendarWith(oneHourMeeting, () => {
            setTimeout(() => {
                assertEventCount(1);
                done();
            }, 100);
        });
    });
    it('adds a repeating weekly meeting', (done) => {
        loadICalendarWith(recurringWeekly, () => {
            setTimeout(() => {
                assertEventCount(1);
                const event = currentCalendar.getEvents()[0];
                // test non-date props
                expect(event.title).toBe('Weekly Monday meeting');
                expect(event.url).toBe('https://fullcalendar.io/');
                expect(event.extendedProps.description).toBe('this is the description');
                expect(event.extendedProps.location).toBe('this is the location');
                done();
            }, 100);
        });
    });
    it('adds an all day event', (done) => {
        loadICalendarWith(alldayEvent, () => {
            setTimeout(() => {
                assertEventCount(1);
                const events = currentCalendar.getEvents();
                events.forEach((event) => expect(event.allDay).toBeTruthy());
                // test non-date props
                expect(events[0].title).toBe('First conference');
                expect(events[0].url).toBe('https://fullcalendar.io/');
                expect(events[0].extendedProps.description).toBe('this is the description');
                expect(events[0].extendedProps.location).toBe('this is the location');
                done();
            }, 100);
        });
    });
    it('ignores a munged event', (done) => {
        loadICalendarWith(mungedOneHourMeeting, () => {
            setTimeout(() => {
                assertEventCount(0);
                done();
            }, 100);
        });
    });
    it('ignores a meeting with a munged start', (done) => {
        loadICalendarWith(meetingWithMungedStart, () => {
            setTimeout(() => {
                assertEventCount(0);
                done();
            }, 100);
        });
    });
    it('sets default duration when forceEventDuration is enabled and no end or duration included in the VEVENT', (done) => {
        loadICalendarWith(timedMeetingWithoutEnd, () => {
            setTimeout(() => {
                assertEventCount(1);
                const event = currentCalendar.getEvents()[0];
                expect(event.end.getHours()).toEqual(event.start.getHours() + 3);
                done();
            }, 100);
        }, (source) => {
            initCalendar({
                forceEventDuration: true,
                defaultTimedEventDuration: '03:00',
            }).addEventSource(source);
        });
    });
    it('sets end to null when forceEventDuration is disabled and no end or duration included in the VEVENT', (done) => {
        loadICalendarWith(timedMeetingWithoutEnd, () => {
            setTimeout(() => {
                assertEventCount(1);
                const event = currentCalendar.getEvents()[0];
                expect(event.end).toBe(null);
                done();
            }, 100);
        }, (source) => {
            initCalendar({
                defaultTimedEventDuration: '03:00',
                forceEventDuration: false,
            }).addEventSource(source);
        });
    });
    it('does not override iCal DURATION in VEVENT', (done) => {
        loadICalendarWith(timedMeetingWithDuration, () => {
            setTimeout(() => {
                assertEventCount(1);
                const event = currentCalendar.getEvents()[0];
                expect(event.end.getHours()).toEqual(event.start.getHours() + 4);
                done();
            }, 100);
        }, (source) => {
            initCalendar({
                forceEventDuration: true,
                defaultTimedEventDuration: '03:00',
            }).addEventSource(source);
        });
    });
    // https://github.com/fullcalendar/fullcalendar/issues/6451
    it('respects RECURRENCE-ID and does not render double events', (done) => {
        loadICalendarWith(dataWithRecurrenceId, () => {
            setTimeout(() => {
                let timeGridWrapper = new TimeGridViewWrapper(currentCalendar).timeGrid;
                let eventEls = timeGridWrapper.getEventEls();
                expect(eventEls.length).toBe(1);
                done();
            }, 100);
        }, (source) => {
            initCalendar({
                initialDate: '2021-07-08',
            }).addEventSource(source);
        });
    });
    it('does not reload data on next', (done) => {
        let requestCnt = 0;
        const givenUrl = window.location.href + '/my-feed.php';
        fetchMock.get(/my-feed\.php/, () => {
            requestCnt++;
            return {
                headers: { 'content-type': ICAL_MIME_TYPE },
                body: timedMeetingWithDuration,
            };
        });
        initCalendar().addEventSource({ url: givenUrl, format: 'ics' });
        setTimeout(() => {
            assertEventCount(1);
            currentCalendar.next();
            expect(requestCnt).toBe(1);
            done();
        }, 100);
    });
    function loadICalendarWith(rawICal, assertions, calendarSetup) {
        const givenUrl = window.location.href + '/my-feed.php';
        fetchMock.get(/my-feed\.php/, {
            headers: { 'content-type': ICAL_MIME_TYPE },
            body: rawICal,
        });
        const source = { url: givenUrl, format: 'ics' };
        if (calendarSetup) {
            calendarSetup(source);
        }
        else {
            initCalendar().addEventSource(source);
        }
        const [requestUrl] = fetchMock.lastCall();
        const requestParamStr = new URL(requestUrl).searchParams.toString();
        expect(requestParamStr).toBe('');
        assertions();
    }
    // Checks to make sure all events have been rendered and that the calendar
    // has internal info on all the events.
    function assertEventCount(expectedCount) {
        expect(currentCalendar.getEvents().length).toEqual(expectedCount);
        let calendarWrapper = new CalendarWrapper(currentCalendar);
        expect(calendarWrapper.getEventEls().length).toEqual(expectedCount);
    }
});
//# sourceMappingURL=day-view.js.map