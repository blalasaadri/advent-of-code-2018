import { readFileSync } from 'fs';

class FrequencySolver {

    private readInput(): number[] {
        return readFileSync('./day-01/task-1/input.txt', 'utf-8')
            .split('\n')
            .filter(Boolean)
            .map(num => parseInt(num));
    }

    public solve(): number {
        let input: number[] = this.readInput();
        let currentFrequency: number = 0;
        let previouslySeenFrequencies: Set<number> = new Set();
        
        while (!previouslySeenFrequencies.has(currentFrequency)) {
            for (let num of input) {
                if (previouslySeenFrequencies.has(currentFrequency)) {
                    break;
                }
                previouslySeenFrequencies.add(currentFrequency);
                currentFrequency += num;
            }
        }
        return currentFrequency;
    }
}

let solution = (new FrequencySolver()).solve();
console.log(solution);