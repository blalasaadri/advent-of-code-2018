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
        //console.log(input);
        return input.reduce(
            (previousValue, currentValue) => previousValue + currentValue
        );
    }
}

let solution = (new FrequencySolver()).solve();
console.log(solution);