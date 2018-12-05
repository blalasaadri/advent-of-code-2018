import { readFileSync } from 'fs';
import format from 'date-fns/format';
import parse from 'date-fns/parse'
import _ from 'underscore';

class LogLine {
    private timestamp: Date;
    private action: string;

    constructor(timestamp: Date, action: string) {
        this.timestamp = timestamp;
        this.action = action;
    }

    getTimestamp() : Date {
        return this.timestamp;
    }

    getAction() : string {
        return this.action;
    }

    getGuardId() : string | undefined {
        let potentialGuardId: string = this.action.split(' ')[1];
        if (potentialGuardId.startsWith('#')) {
            return potentialGuardId;
        }
        return undefined;
    }
}

let input = readFileSync('./day-04/input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
        let timestamp: Date = parse(line.substr(1, 16), 'yyyy-MM-dd HH:mm', new Date(1518, 1, 1, 0, 0, 0, 0));
        let action: string = line.substr(19);
        return new LogLine(timestamp, action);
    });
let logEntries = _.sortBy(input, line => format(line.getTimestamp(), 'yyyy-MM-dd HH:mm'));
//console.log("input:\n" + JSON.stringify(input, null, 2));
/*console.log("logEntries:\n" + JSON.stringify(logEntries.map(logLine => {return {
    action: logLine.getAction(),
    timestamp: format(logLine.getTimestamp(), 'yyyy-MM-dd HH:mm')
}}), null, 2));*/

export {
    LogLine,
    logEntries
};