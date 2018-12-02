import { readFileSync } from 'fs';

class ChecksumCalculator {
    private readInput() : string[] {
        return readFileSync('./day-02/input.txt', 'utf-8')
            .split('\n')
            .filter(Boolean);
    }
    
    private checkEntry(entry : string) : [boolean, boolean] {
        let characters = {};
        [... entry].forEach(c => {
            if (characters[c] != undefined) {
                characters[c] += 1;
            } else {
                characters[c] = 1;
            }
        });
        let doubles = false;
        let triples = false;
        Object.keys(characters).forEach(key => {
            let value : number = characters[key];
            if (value == 2) {
                doubles = true;
            } else if (value == 3) {
                triples = true;
            }
        });
        //console.log(`For entry ${entry} the result is ${JSON.stringify(characters)}`);
        return [doubles, triples];
    }

    public solve() : number {
        let input = this.readInput();
        //console.log(input);
        let checkedValues = input.map(entry => this.checkEntry(entry));
        let summedValues = checkedValues
            .map(value => [value[0] ? 1 : 0, value[1] ? 1 : 0])
            .reduce((previousValue, currentValue) => [previousValue[0] + currentValue[0], previousValue[1] + currentValue[1]]);
        //console.log(summedValues);
        return summedValues[0] * summedValues[1];
    }
}

let checksumCaluclator = new ChecksumCalculator;
console.log(checksumCaluclator.solve());