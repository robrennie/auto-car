export default class GridCell {
    constructor(copy) {
        if (copy) {
            this.cellType = copy.cellType;
            this.car = copy.car;
            this.isCrash = copy.isCrash;
            this.direction = copy.direction;
        } else {
            this.cellType = 'block';
            this.car = null;
            this.isCrash = false;
            this.direction = [];
        }
    }

    isMultiDirection() {
        return this.direction.length > 1;
    }
}
