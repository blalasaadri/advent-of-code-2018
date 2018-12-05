import { logEntries, LogLine } from './ReadLogs';
//import format from 'date-fns/format';

class NightShiftLog {
    private logEntries: LogLine[] = [];

    addLogEntry(logEntry: LogLine) {
        this.logEntries.push(logEntry);
    }

    getLogEntries() : LogLine[] {
        return this.logEntries;
    }
}

let nightShiftLogs: NightShiftLog[] = [];
let nightShiftLog: NightShiftLog = new NightShiftLog();

logEntries.forEach(logEntry => {
    if (logEntry.getGuardId()) {
        nightShiftLogs.push(nightShiftLog);
        nightShiftLog = new NightShiftLog();
    }
    nightShiftLog.addLogEntry(logEntry);
});

let shiftLogs = nightShiftLogs.splice(1);
/*.map(entry => entry.getLogEntries().map(logLine => {return {
    action: logLine.getAction(),
    timestamp: format(logLine.getTimestamp(), 'yyyy-MM-dd HH:mm')
}}));*/

//console.log(`shiftLogs:\n` + JSON.stringify(shiftLogs, null, 2));

export {
    NightShiftLog,
    shiftLogs
};