import { readFileSync } from 'fs';
import levenshtein from 'fast-levenshtein';

class IdComparator {
    private readInput() : string[] {
        return readFileSync('./day-02/input.txt', 'utf-8')
            .split('\n')
            .filter(Boolean);
    }

    private findSimilarEntries(entries : string[]) : string[][] {
        let similarEntries = new Set<string[]>();;
        
        for (let i = 0; i < entries[0].length; i++) {
            let sorted = entries.sort((first, second) => [... first][i] > [... second][i] ? 1 : -1);
            for (let j = 0; j < sorted.length - 1; j++) {
                const distance = levenshtein.get(sorted[j], sorted[j + 1]);
                if (distance == 1) {
                    similarEntries.add([sorted[j], sorted[j + 1]]);
                }
            }
        }

        return [... similarEntries.values()];
    }

    public solve() : string[][] {
        let input = this.readInput();
        let similarEntries = this.findSimilarEntries(input);
        return similarEntries.map(([first, second]) => {
            const firstArray = [... first];
            const secondArray = [... second];
            let result : string[] = [];
            for (let i = 0; i < firstArray.length; i++) {
                const character = firstArray[i];
                if (character == secondArray[i]) {
                    result.push(character);
                } /*else {
                    console.log(`Difference between '${first}' and '${second}' found in position ${i}: ${firstArray[i]} vs. ${secondArray[i]}`);
                }*/
            }
            return result;
        });
    }
}

let idComparator = new IdComparator();
console.log(`Solutions: \n\t${idComparator.solve().map(solution => solution.join('')).join('\n\t')}`);