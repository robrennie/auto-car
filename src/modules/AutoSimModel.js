import GridCell from './GridCell'

export default class AutoSimModel {
    constructor(modelProps) {
        this.blockSize = modelProps.blockSize;
        this.blocksCx = modelProps.blocksCx;
        this.blocksCy = modelProps.blocksCy;
        this.gridCx = this.blocksCx * this.blockSize + 2 * (this.blocksCx - 1);
        this.gridCy = this.blocksCy * this.blockSize + 2 * (this.blocksCy - 1);
        this.grid = [];
        this.currentCars = 0;
        this.averageStops = 0;
        this.currentStops = 0;
        this.courteousness = modelProps.courteousness;

        this.clear();
    }

    clear() {

        this.grid = [];
        this.totalCars = 0;
        this.averageStops = 0;

        // create whole default grid
        for (var y = 0; y < this.gridCy; y++) {
            let gridRow = [];
            for (var x = 0; x < this.gridCx; x++) {
                gridRow.push(new GridCell());
            }
            this.grid.push(gridRow);
        }

        // create roads
        for (y = this.blockSize; y < this.gridCy; y += (this.blockSize + 2)) {
            for (x = 0; x < this.gridCx; x++) {
                this.grid[y][x].cellType = 'road';
                this.grid[y][x].direction.push('west');
                this.grid[y + 1][x].cellType = 'road';
                this.grid[y + 1][x].direction.push('east');
            }
        }
        for (x = this.blockSize; x < this.gridCx; x += (this.blockSize + 2)) {
            for (y = 0; y < this.gridCy; y++) {
                this.grid[y][x].cellType = 'road';
                this.grid[y][x].direction.push('south');
                this.grid[y][x + 1].cellType = 'road';
                this.grid[y][x + 1].direction.push('north');
            }
        }
    }

    next() {

        // flag if there's a crash
        let noCrash = true;

        // copy old grid w/o cars
        let newGrid = [];
        for (var y = 0; y < this.gridCy; y++) {
            let newRow = [];
            for (var x = 0; x < this.gridCx; x++) {

                // copy grid cell
                let newCell = new GridCell(this.grid[y][x]);
                newCell.car = null;
                newRow.push(newCell);
            }
            newGrid.push(newRow);
        }

        // compute new car positions
        for (y = 0; y < this.gridCy; y++) {
            for (x = 0; x < this.gridCx; x++) {
                if (!this.moveCar(y, x, newGrid))
                    noCrash = false;
            }
        }

        // replace grid
        this.grid = newGrid;

        this.updateCounts();

        return noCrash;
    }

    moveCar(y, x, newGrid) {
        let noCrash = true;
        if (this.grid[y][x].car) {
            let newCoords = this.grid[y][x].car.move(y, x, this.grid, this);
            if (newCoords) {
                let gridCell = newGrid[newCoords.y][newCoords.x];
                if (newCoords.y !== y && newCoords.x !== x && gridCell.car) {
                    gridCell.isCrash = true;
                    noCrash = false;
                    this.grid[y][x].isCrash = true;
                }
                else
                    gridCell.car = this.grid[y][x].car;
            }
        }
        return noCrash
    }

    randomCarStartInfo() {

        const defaultSpeed = 1; // only speed of 1 is supported in this simple model

        const randomSide = Math.floor(Math.random() * 4) + 1;
        const randomFactorX = Math.floor(Math.random() * (this.blocksCx - 1)) * (this.blockSize + 2) + this.blockSize;
        const randomFactorY = Math.floor(Math.random() * (this.blocksCy - 1)) * (this.blockSize + 2) + this.blockSize;

        // top
        if (randomSide === 4)
            return {
                startY: 0,
                startX: randomFactorX,
                direction: 'south',
                speed: defaultSpeed
            }

        // bottom
        if (randomSide === 3)
            return {
                startY: this.gridCy - 1,
                startX: randomFactorX + 1,
                direction: 'north',
                speed: defaultSpeed
            }
        // left
        if (randomSide === 2)
            return {
                startY: randomFactorY + 1,
                startX: 0,
                direction: 'east',
                speed: defaultSpeed
            }
        // right
        if (randomSide === 1)
            return {
                startY: randomFactorY,
                startX: this.gridCx - 1,
                direction: 'west',
                speed: defaultSpeed
            }
    }

    allCarStartInfo() {

        let allCar = [];
        const defaultSpeed = 1; // only speed of 1 is supported in this simple model

        for (let y = this.blockSize; y < this.gridCy; y += (this.blockSize + 2)) {
            allCar.push({
                startY: y,
                startX: this.gridCx - 1,
                direction: 'west',
                speed: defaultSpeed
            });
            allCar.push({
                startY: y + 1,
                startX: 0,
                direction: 'east',
                speed: defaultSpeed
            })
        }
        for (let x = this.blockSize; x < this.gridCx; x += (this.blockSize + 2)) {
            allCar.push({
                startY: 0,
                startX: x,
                direction: 'south',
                speed: defaultSpeed
            });
            allCar.push({
                startY: this.gridCy - 1,
                startX: x + 1,
                direction: 'north',
                speed: defaultSpeed
            })
        }
        return allCar;
    }

    updateCounts() {

        this.currentStops = 0;
        this.currentCars = 0;

        for (var y = 0; y < this.gridCy; y++) {
            for (var x = 0; x < this.gridCx; x++) {
                if (this.grid[y][x].car) {
                    this.currentCars += 1;
                    this.currentStops += this.grid[y][x].car.stops;
                }
            }
        }
        this.averageStops = this.currentStops / this.currentCars;
    }
}