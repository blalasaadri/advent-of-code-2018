import { readFileSync } from 'fs';
import { Point, Square } from './Square';
import _ from 'underscore';

class FindOverlaps {
    private readInput() : Square[] {
        return readFileSync('./day-03/input.txt', 'utf-8')
            .split('\n')
            .filter(Boolean)
            .map(line => {
                let sections = line.split(' ');
                let id: number = parseInt(sections[0].substr(1));
                let leftUpperCorner: number[] = sections[2].substr(0, sections[2].length - 1).split(',').map(value => parseInt(value));
                let dimensions: number[] = sections[3].split('x').map(value => parseInt(value));
                //console.log(`ID: ${id}, left upper corner: ${leftUpperCorner.join(' / ')}, dimensions: ${dimensions.join(' x ')}`);
                return new Square(id, new Point(leftUpperCorner[0], leftUpperCorner[1]), dimensions[0], dimensions[1]);
            });
    }

    private findNumberOfSquaresWithValuesLargerThan1(squares: number[][]) {
        return squares.map((value) => {
            return value
                .filter(value => value > 1)
                .reduce((previousValue) => previousValue + 1, 0);
        }).filter(value => value > 1)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }

    public solve(): number {
        let cloth: number[][] = _.range(1000).map(() => _.range(1000).map(() => 0));

        let input: Square[] = this.readInput();
        input.forEach(square => square.markCoveredSquares(cloth));
        //console.log(cloth);
        return this.findNumberOfSquaresWithValuesLargerThan1(cloth);
    }
}

let findOverlaps = new FindOverlaps().solve();
console.log(`Solution: ${findOverlaps}`);