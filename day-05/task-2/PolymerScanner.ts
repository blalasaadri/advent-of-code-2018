import { readFileSync } from 'fs';
import _ from 'underscore';

const readInput = (fileName: string) => readFileSync(fileName, 'utf-8');

const input = readInput('day-05/input.txt').trim();

let react = (initial: string) => {
    const isUppercase = (char: string) => char == char.toUpperCase();
    const isLowercase = (char: string) => char == char.toLowerCase();
    const areEqualIgnoringCase = (first: string, second: string) => first.toUpperCase() == second.toUpperCase();
    const shouldReact = (first: string, second: string) => 
        areEqualIgnoringCase(first, second) && ((isUppercase(first) && isLowercase(second)) || (isLowercase(first) && isUppercase(second)));
    
    const reactOnce = function(polymer: string) : string {
        for (let i = 0; i < polymer.length - 1; i++) {
            const first = polymer[i];
            const second = polymer[i + 1];
            if (shouldReact(first, second)) {
                return polymer.substr(0, i) + polymer.substr(i + 2);
            }
        }
        return polymer;
    };
    
    let polymer : string = initial;
    let solved = false;
    do {
        let newPolymer = reactOnce(polymer);
        solved = newPolymer == polymer;
        polymer = newPolymer;
    } while(!solved);
    
    return polymer;
};

//let initialReaction = react(input);

const replaceAll = function(target: string, search: string, replacement: string) {
    return target.split(search).join(replacement);
};

const removeAllCaseInsensitive = function(target: string, search: string) {
    return replaceAll(replaceAll(target, search.toLowerCase(), ''), search.toUpperCase(), '');
}

const optimizations = new Map<string, number>();
for (let i = 0; i < 26; i++) {
    let char = String.fromCharCode(97 + i);
    let cleanedReaction = removeAllCaseInsensitive(input, char);
    optimizations.set(char, input.length - cleanedReaction.length);
}

const bestOptimization = _.sortBy(Array.from(optimizations), element => element[1]).reverse()[0];

const preOptimized = removeAllCaseInsensitive(input, bestOptimization[0]);
const postOptimized = react(preOptimized);

console.log(`input.length = ${input.length}, preOptimized.length = ${preOptimized.length}, postOptimized.length = ${postOptimized.length}`);