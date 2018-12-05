import { LogLine } from './ReadLogs';
import { NightShiftLog, shiftLogs } from './GroupLogs';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isBefore from 'date-fns/isBefore';
import _ from 'underscore';

let calculateSleepiestMinute = (logs: NightShiftLog[], guard: string) => {
    //console.log(JSON.stringify(logs, null, 2));
    let sleepiestGuardLogs = _.groupBy(logs, obj => obj.getLogEntries()[0].getGuardId())[guard];
    //console.log(JSON.stringify(sleepiestGuardLogs, null, 2));
    
    let sleepingMinutes = new Map<number, number>();

    let returnValue = [0, 0];
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

        returnValue = sortedSleepingMinutes[0];
    });

    return returnValue;
};

let findSleepyestMinutePerGuard = (sleepLogs: NightShiftLog[]) => {
    let groupedLogs: _.Dictionary<NightShiftLog[]> = _.groupBy(sleepLogs, log => log.getLogEntries()[0].getGuardId());

    let sleepiestMinutes: Map<string, number[]> = new Map<string, number[]>();
    for (let guardId in groupedLogs) {
        //console.log(`guardId = ${guardId}, value = ${JSON.stringify(groupedLogs[guardId])}`)
        let sleepiestMinute: number[] = calculateSleepiestMinute(groupedLogs[guardId], guardId);
        //console.log(`Sleepiest minute for ${guardId} is ${sleepiestMinute}`);
        sleepiestMinutes.set(guardId, sleepiestMinute);
    }
    return sleepiestMinutes;
};

let sleepyestMinutePerGuard: Map<string, number[]> = findSleepyestMinutePerGuard(shiftLogs);

//console.log(sleepyestMinutePerGuard);

let sleepiestGuard = _.sortBy(Array.from(sleepyestMinutePerGuard).map(array => ({
    guardId: array[0],
    sleepiestMinute: array[1][0],
    sleepTime: array[1][1]
})), obj => obj.sleepTime).reverse()[0];

console.log(sleepiestGuard);

let calculateResult = ({ guardId, sleepiestMinute, sleepTime }) => {
    return parseInt(guardId.substr(1)) * sleepiestMinute;
};

console.log(`The sleepiest guard is the one with ID ${sleepiestGuard.guardId}, who slept ${sleepiestGuard.sleepTime} at minute ${sleepiestGuard.sleepiestMinute}.`);
console.log(`This means, the solution is ${calculateResult(sleepiestGuard)}`);