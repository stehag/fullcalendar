import { createPlugin } from '@fullcalendar/core';
import { LuxonNamedTimeZone } from './LuxonNamedTimeZone.js';
import { formatWithCmdStr } from './format.js';
export default createPlugin({
    name: '<%= pkgName %>',
    cmdFormatter: formatWithCmdStr,
    namedTimeZonedImpl: LuxonNamedTimeZone,
});
export { toLuxonDateTime, toLuxonDuration } from './convert.js';
//# sourceMappingURL=index.js.map