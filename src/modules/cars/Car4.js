import Car from './Car';

export default class Car4 extends Car {
    constructor(newCar) {
        super(newCar);

        this.reservations = [];
    }

    move(y, x, grid, model) {

        this.speed = this.desiredSpeed;

        // clear current reservation
        this.clearReservation({ y, x });

        let newPos = this.desiredNextPos(y, x, grid);
        if (!newPos)
            return null;

        this.isStopped = false;

        // if we already have this reserved
        if (this.isReserved(newPos))
            return newPos;

        // create the path we would like exclusive access too
        let reservePath = [newPos];
        while (grid[newPos.y][newPos.x].isMultiDirection()) {
            newPos = this.desiredNextPos(newPos.y, newPos.x, grid);
            if (!newPos)
                return null;
            reservePath.push(newPos);
        }

        // be altruistic n% of the time
        let beCourteous = (reservePath.length > 1 && Math.floor(Math.random() * 100) < model.courtiousness);
        if (beCourteous || !this.canReserve(reservePath, grid)) {
            newPos = { y, x };
            this.stops += 1;
            this.isStopped = true;
            this.speed = 0;
            reservePath = [newPos];
        }
        this.addReservation(reservePath);

        return reservePath[0];
    }

    clearReservation(reservePos) {
        let reservations2 = [];
        for (const rpos of this.reservations) {
            if (rpos.x === reservePos.x && rpos.y === reservePos.y)
                continue;
            reservations2.push(rpos);
        }
        this.reservations = reservations2;
    }

    isReserved(reservePos) {
        for (const rpos of this.reservations) {
            if (rpos.x === reservePos.x && rpos.y === reservePos.y)
                return true;
        }
        return false;
    }

    addReservation(reservePath) {
        for (const reservePos of reservePath) {
            let found = false;
            for (const rpos of this.reservations) {
                if (rpos.x === reservePos.x && rpos.y === reservePos.y) {
                    found = true;
                    break;
                }
            }
            if (!found)
                this.reservations.push(reservePos);
        }
    }

    canReserve(reservePath, grid) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x].car && grid[y][x].car !== this) {
                    for (const reservedPos of reservePath) {
                        if (grid[y][x].car.isReserved(reservedPos))
                            return false;
                    }
                }
            }
        }
        return true;
    }
}
