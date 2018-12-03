class Point {
    private x: number;
    private y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getX() : number {
        return this.x;
    }

    public getY() : number {
        return this.y;
    }
}

class Square {
    private id: number;
    private upperLeftCorner: Point;
    private width: number;
    private height: number;

    constructor(id: number, upperLeftCorner: Point, width: number, height: number) {
        this.id = id;
        this.upperLeftCorner = upperLeftCorner;
        this.width = width;
        this.height = height;
    }

    public getId() : number {
        return this.id;
    }

    public markCoveredSquares(squares: number[][]) : void {
        //console.log(`ID: ${this.id}`)
        for (let i = 0; i < this.height; i++) {
            let combinedY = this.upperLeftCorner.getY() + i;

            for (let j = 0; j < this.width; j++) {
                let combinedX = this.upperLeftCorner.getX() + j;

                squares[combinedY][combinedX]++;
            }
        }
    }

    public isSquareWithoutOverlapOn(squares: number[][]) : boolean {
        let isWithoutOverlap = true;
        for (let i = 0; i < this.height; i++) {
            let combinedY = this.upperLeftCorner.getY() + i;

            for (let j = 0; j < this.width; j++) {
                let combinedX = this.upperLeftCorner.getX() + j;

                isWithoutOverlap = isWithoutOverlap && (squares[combinedY][combinedX] == 1);
            }
        }
        return isWithoutOverlap;
    }
}

export {
    Point,
    Square
}