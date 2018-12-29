import Car from './Car';

export default class Car2 extends Car  {        
    constructor(newCar) {
        super(newCar);
    }

    desiredNextPos(y, x, grid) {

        let newPos = { y, x };
        switch(this.direction) {
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

        }

        if( newPos.y < 0 || newPos.y >= grid.length || 
            newPos.x < 0 || newPos.x >= grid[0].length )
            return null;

        return newPos;
    }

    move(y, x, grid) {

        this.speed = this.desiredSpeed;
        
        let newPos = this.desiredNextPos(y, x, grid);
        if( !newPos )
            return null; 

        this.isStopped = false;

        if( this.willCrash(newPos, grid) ) {
            
            newPos = { y, x };
            this.stops += 1;
            this.isStopped = true;
            this.speed = 0;
            
        }
        return newPos;
    }

    willCrash(newPos, grid) {
        for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[0].length; x++) {
                if( grid[y][x].car && grid[y][x].car != this) {

                    const otherPos = grid[y][x].car.desiredNextPos(y,x, grid);
                    if( otherPos && otherPos.x === newPos.x && otherPos.y === newPos.y)
                        return true;
                }
            }
        }
        return false;
    }
}
