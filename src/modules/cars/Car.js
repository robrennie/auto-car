export default class Car {        
    constructor(newCar) {
        this.direction = newCar.direction;
        this.speed = newCar.speed;
        this.desiredSpeed = newCar.speed;
        this.stops = 0;
        this.isStopped = false;
    }
}