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

    private findSquareWithNoOverlap(cloth: number[][], squares: Square[]) {
        return squares.filter(square => square.isSquareWithoutOverlapOn(cloth));
    }

    public solve(): number[] {
        let cloth: number[][] = _.range(1000).map(() => _.range(1000).map(() => 0));

        let input: Square[] = this.readInput();
        input.forEach(square => square.markCoveredSquares(cloth));
        return this.findSquareWithNoOverlap(cloth, input).map(square => square.getId());
    }
}

let findOverlaps = new FindOverlaps().solve();
console.log(`Solution: ${findOverlaps}`);