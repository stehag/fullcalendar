export default `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:events@fullcalendar.test
X-WR-TIMEZONE:Europe/Paris
BEGIN:VEVENT
DTSTART:20190415T093000Z
DURATION:PT4H
DTSTAMP:20201006T124223Z
UID:12345678
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=test@fullcalendar.test;X-NUM-GUESTS=0:mailto:test@fullcalendar.test
CREATED:20190412T223947Z
DESCRIPTION:
LAST-MODIFIED:20190412T223947Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Hour long meeting
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
//# sourceMappingURL=timedMeetingWithDuration.js.map