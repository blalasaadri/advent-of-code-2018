import { readFileSync } from 'fs';
import levenshtein from 'js-levenshtein';

class IdComparator {
    private readInput() : string[] {
        return readFileSync('./day-02/input.txt', 'utf-8')
            .split('\n')
            .filter(Boolean);
    }

    private findSimilarEntries(entries : string[]) : string[][] {
        let similarEntries : string[][] = [];
        
        for (let i = 0; i < entries[0].length; i++) {
            let sorted = entries.sort((first, second) => [... first][i] > [... second][i] ? 1 : -1);
            for (let j = 0; j < sorted.length - 1; j++) {
                const distance = levenshtein(sorted[j], sorted[j + 1]);
                if (distance == 1) {
                    similarEntries.push([sorted[j], sorted[j + 1]]);
                }
            }
        }

        return similarEntries;
    }

    public solve() : string[][] {
        let input = this.readInput();
        let similarEntries = this.findSimilarEntries(input);
        return similarEntries.map(([first, second]) => {
            const firstArray = [... first];
            const secondArray = [... second];
            let result : string[] = [];
            for (let i = 0; i < firstArray.length; i++) {
                if (firstArray[i] == secondArray[i]) {
                    result.push(firstArray[i]);
                } else {
                    console.log(`Difference found in position ${i}: ${firstArray[i]} vs. ${secondArray[i]}`);
                }
            }
            return result;
        });
    }
}

let idComparator = new IdComparator();
console.log(`Solution: ${idComparator.solve()[0].join('')}`);