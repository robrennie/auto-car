export default class Car {
    constructor(newCar) {
        this.direction = newCar.direction;
        this.speed = newCar.speed;
        this.desiredSpeed = newCar.speed;
        this.stops = 0;
        this.isStopped = false;
    }

    desiredNextPos(y, x, grid) {

        let newPos = { y, x };
        switch (this.direction) {
            case 'north':
                newPos = { y: y - this.speed, x };
                break;
            case 'south':
                newPos = { y: y + this.speed, x };
                break;
            case 'east':
                newPos = { y, x: x + this.speed };
                break;
            case 'west':
                newPos = { y, x: x - this.speed };
                break;
            default:
                return null;
        }

        if (newPos.y < 0 || newPos.y >= grid.length ||
            newPos.x < 0 || newPos.x >= grid[0].length)
            return null;

        return newPos;
    }
}