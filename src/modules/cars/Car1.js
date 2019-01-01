import Car from './Car';

export default class Car1 extends Car {

    move(y, x, grid) {

        this.speed = this.desiredSpeed;

        let newPos = this.desiredNextPos(y, x, grid);
        if (!newPos)
            return null;

        this.isStopped = false;

        if (this.willCrash(newPos, grid)) {
            newPos = { y, x };
            this.stops += 1;
            this.isStopped = true;
            this.speed = 0;
        }
        return newPos;
    }

    willCrash(newPos, grid) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x].car && grid[y][x].car !== this) {
                    const otherPos = grid[y][x].car.desiredNextPos(y, x, grid);
                    if (otherPos && otherPos.x === newPos.x && otherPos.y === newPos.y)
                        return true;
                }
            }
        }
        return false;
    }
}
