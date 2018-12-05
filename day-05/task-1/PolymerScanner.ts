import { readFileSync, writeFileSync } from 'fs';

const readInput = (fileName: string) => readFileSync(fileName, 'utf-8');

const input = readInput('day-05/input.txt').trim();

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

let polymer : string = input;
let solved = false;
do {
    let newPolymer = reactOnce(polymer);
    solved = newPolymer == polymer;
    polymer = newPolymer;
} while(!solved);

console.log(`input.length = ${input.length}, polymer.length = ${polymer.length}`);

writeFileSync('target/day-05/task-1/output.txt', polymer);