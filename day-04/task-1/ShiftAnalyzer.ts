import { LogLine } from './ReadLogs';
import { NightShiftLog, shiftLogs } from './GroupLogs';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isBefore from 'date-fns/isBefore';
import _ from 'underscore';
//import parse from 'date-fns/parse'

let sleepiestGuard: { guardId: string, minutesAsleep: number } = (() => {
    let findSleepiestGuard = (logs: NightShiftLog[]) => {
        return logs.map(log => {
            let logEntries: LogLine[] = log.getLogEntries();
            let guardId = logEntries[0].getGuardId();
            
            let minutesAsleep: number = 0;
            let lastFallenAsleep: LogLine | undefined;
            for (let logEntry of logEntries) {
                if (logEntry.getAction().startsWith('falls asleep')) {
                    lastFallenAsleep = logEntry;
                } else if (logEntry.getAction().startsWith('wakes up') && lastFallenAsleep) {
                    minutesAsleep += differenceInMinutes(logEntry.getTimestamp(), lastFallenAsleep.getTimestamp());
                    lastFallenAsleep = undefined;
                }
            }

            //console.log(`guard: ${guardId}, minutes asleep: ${minutesAsleep}`);
    
            return {
                guardId,
                minutesAsleep
            };
        })
    };
    
    let sleepingDuringShifts = findSleepiestGuard(shiftLogs);
    
    let groupedByGuard = _.groupBy(sleepingDuringShifts, obj => obj.guardId);
    
    let totalSleepByGuard: { minutesAsleep: number, guardId: string}[] = [];
    for (let key in groupedByGuard) {
        let totalMinutesAsleep = 0;
        if (groupedByGuard.hasOwnProperty(key)) {
            let shiftsByGuard: { minutesAsleep: number }[] = groupedByGuard[key];

            totalMinutesAsleep += shiftsByGuard.reduce((first, second) => ({
                minutesAsleep: first.minutesAsleep + second.minutesAsleep
            })).minutesAsleep;
        }
        totalSleepByGuard.push({
            guardId: key,
            minutesAsleep: totalMinutesAsleep
        });
    }

    return _.sortBy(totalSleepByGuard, obj => obj.minutesAsleep)
        .reverse()[0]
})();

//console.log(sleepiestGuard);

let calculateSleepiestMinute = (logs: NightShiftLog[]) => {
    let sleepiestGuardLogs = _.groupBy(logs, obj => obj.getLogEntries()[0].getGuardId())[sleepiestGuard.guardId];
    //console.log(JSON.stringify(sleepiestGuardLogs, null, 2));
    
    let sleepingMinutes = new Map<number, number>();

    let returnValue = 0;
    sleepiestGuardLogs.forEach(shift => {
        let lastTimepoint: Date | undefined;
        let wasAwake: boolean = true;
        shift.getLogEntries().forEach(logEntry => {
            if (lastTimepoint == undefined) {
                lastTimepoint = logEntry.getTimestamp();
                wasAwake = true;
            } else {
                for (let timepoint = lastTimepoint; isBefore(timepoint, logEntry.getTimestamp()); timepoint.setMinutes(timepoint.getMinutes() + 1)) {
                    if (timepoint.getHours() == 0) {
                        let asleepAtThisMinute = sleepingMinutes.get(timepoint.getMinutes());
                        if (!asleepAtThisMinute) {
                            asleepAtThisMinute = 0;
                        }
                        if (!wasAwake) {
                            asleepAtThisMinute++;
                        }
                        sleepingMinutes.set(timepoint.getMinutes(), asleepAtThisMinute);
                    }
                }
                wasAwake = !wasAwake;
            }
        });
        if (lastTimepoint) {
            for (let timepoint = lastTimepoint; timepoint.getMinutes() > 0; timepoint.setMinutes(timepoint.getMinutes() + 1)) {
                let asleepAtThisMinute = sleepingMinutes.get(timepoint.getMinutes());
                if (!asleepAtThisMinute) {
                    asleepAtThisMinute = 0;
                }
                if (!wasAwake) {
                    asleepAtThisMinute++;
                }
                sleepingMinutes.set(timepoint.getMinutes(), asleepAtThisMinute);
            }
        }
        let sortedSleepingMinutes = _.sortBy(Array.from(sleepingMinutes), entry => entry[1]).reverse();
        //console.log(sortedSleepingMinutes);

        returnValue = sortedSleepingMinutes[0][0];
    });

    return returnValue;
};

let sleepiestMinute = calculateSleepiestMinute(shiftLogs);

console.log(`The ID of the guard is ${sleepiestGuard.guardId} and his sleepiest minute is ${sleepiestMinute}`);
console.log(`Therefore, the result is ${parseInt(sleepiestGuard.guardId.substr(1)) * sleepiestMinute}`);