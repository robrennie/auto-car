import React from 'react';
import './StreetView.css'
import AutoSimModel from '../modules/AutoSimModel'
import Car1 from '../modules/cars/Car1';
import Car4 from '../modules/cars/Car4';

export default class StreetView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            generation: 0,
            hasCrash: false,
            generationSpeed: 100,
            newCarsPerGen: 10,
            running: false,
            blocksCx: 6,
            blocksCy: 6,
            blockSize: 2,
            courtiousness: 10,
            useCar: 4,
        };
        this.model = new AutoSimModel(this.state);
        this.timer = null;
        this.numNewCars = 0;

        this.onReset = this.onReset.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onChangeGenerationSpeed = this.onChangeGenerationSpeed.bind(this);
        this.onChangeNewCarsPerGen = this.onChangeNewCarsPerGen.bind(this);
        this.onChangeBlocksCx = this.onChangeBlocksCx.bind(this);
        this.onChangeBlocksCy = this.onChangeBlocksCy.bind(this);
        this.onChangeBlockSize = this.onChangeBlockSize.bind(this);
        this.onChangeCourtiousness = this.onChangeCourtiousness.bind(this);
        this.onChangeUseCar = this.onChangeUseCar.bind(this);
    }

    // 
    // car factory
    //
    newCar(car) {
        switch (this.state.useCar) {
            case 1:
            default:
                return new Car1(car);
            case 4:
                return new Car4(car);
        }
    }

    //
    // pick random edge locations to start cars
    //
    newCarsRandom() {
        for (let i = 0; i < this.state.newCarsPerGen; i++) {
            const newCar = this.model.randomCarStartInfo();
            if (this.model.grid[newCar.startY][newCar.startX].car)
                continue;
            this.model.grid[newCar.startY][newCar.startX].car = this.newCar(newCar);
            this.numNewCars += 1;
        }
    }

    //
    // start at all open edge positions
    //
    newCarsAll() {
        const newCars = this.model.allCarStartInfo();
        for (const newCar of newCars) {
            if (this.model.grid[newCar.startY][newCar.startX].car)
                continue;
            this.model.grid[newCar.startY][newCar.startX].car = this.newCar(newCar);
            this.numNewCars += 1;
        }
    }

    // 
    // a single generation of the model
    //
    nextGeneration() {

        this.numNewCars = 0;

        // random open spaces
        if (this.state.newCarsPerGen > 0) {
            this.newCarsRandom();
        } else if (this.state.newCarsPerGen === 0) {
            this.newCarsAll();
        } else if (this.state.newCarsPerGen === -1 &&
            (this.state.generation === 0 || this.state.generation === 1)) {
            this.newCarsAll();
        }

        // run model
        let hasCrash = !this.model.next(this.generation);

        this.setState({
            generation: this.state.generation + 1,
            hasCrash
        });

        if (!hasCrash && this.running)
            this.timer = setTimeout(() => this.nextGeneration(), this.state.generationSpeed);
    }

    //
    // event handlers
    //
    onReset() {
        this.doReset(null);
    }

    doReset(addlState) {

        let timerCleared = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
            timerCleared = true;
        }

        const newState = { ...this.state, ...addlState };
        this.model = new AutoSimModel(newState);

        this.setState({
            generation: 0,
            hasCrash: false,
            ...addlState
        });

        if (timerCleared)
            this.timer = setTimeout(() => this.nextGeneration(), this.state.generationSpeed);
    }

    onStop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.running = false;
    }

    onStart() {
        if (!this.running) {
            this.running = true;
            setTimeout(() => this.nextGeneration(), this.state.generationSpeed);
        }
    }

    onChangeGenerationSpeed(e) {
        let generationSpeed = Number(e.target.value);
        if (generationSpeed < 10)
            generationSpeed = 10;
        this.setState({
            generationSpeed,
        });
    }

    onChangeNewCarsPerGen(e) {
        this.setState({
            newCarsPerGen: Number(e.target.value),
        });
    }

    onChangeBlocksCx(e) {
        let blocksCx = Number(e.target.value);
        if (blocksCx < 2)
            blocksCx = 2;
        this.doReset({
            blocksCx,
        });
    }

    onChangeBlocksCy(e) {
        let blocksCy = Number(e.target.value);
        if (blocksCy < 2)
            blocksCy = 2;
        this.doReset({
            blocksCy,
        });
    }

    onChangeBlockSize(e) {
        let blockSize = Number(e.target.value);
        if (blockSize < 2)
            blockSize = 2;
        this.doReset({
            blockSize,
        });
    }

    onChangeCourtiousness(e) {
        this.doReset({
            courtiousness: Number(e.target.value),
        })
    }

    onChangeUseCar(e) {
        this.doReset({
            useCar: Number(e.target.value),
        })
    }

    //
    // render
    //
    render() {

        let rows = [];

        for (var y = 0; y < this.model.gridCy; y++) {
            let row = [];
            for (var x = 0; x < this.model.gridCx; x++) {
                const cellType = this.model.grid[y][x].cellType;
                const cellKey = y * this.model.gridCx + x;
                let cellClass = '';
                switch (cellType) {
                    case 'road':
                        cellClass = 'cell_road';
                        break;
                    default:
                    case 'block':
                        cellClass = 'cell_block';
                        break;
                }
                let cellText = ' ';
                if (this.model.grid[y][x].car) {
                    cellText = this.model.grid[y][x].car.direction[0];
                    if (this.model.grid[y][x].car.isStopped && !this.model.grid[y][x].isCrash)
                        cellClass += ' stopped';
                }
                if (this.model.grid[y][x].isCrash) {
                    cellClass += ' crash';
                }

                row.push(<td key={cellKey} className={cellClass} >{cellText}</td>);
            }
            rows.push(<tr key={'r' + y}>{row}</tr>);
        }

        return (
            <div>Street View: {this.running ? "Running" : "Stopped"} <br></br>
                Generation: {this.state.generation} Stops: {this.model.currentStops} Cars: {this.model.currentCars} Avg. Stops: {this.model.averageStops.toFixed(2)} New Cars: {this.numNewCars}
                <table align='center' className={'grid'}><tbody>{rows}</tbody></table>
                <button onClick={this.onStart}>Start</button>
                <button onClick={this.onReset}>Reset</button>
                <button onClick={this.onStop}>Stop</button><br />
                Generation Speed: <input type="text" onChange={this.onChangeGenerationSpeed} value={this.state.generationSpeed} size='4' /><br />
                New Cars Per Gen: <input type="text" onChange={this.onChangeNewCarsPerGen} value={this.state.newCarsPerGen} size='4' /><br />
                Blocks Horizontal: <input type="text" onChange={this.onChangeBlocksCx} value={this.state.blocksCx} size='4' /><br />
                Blocks Vertical: <input type="text" onChange={this.onChangeBlocksCy} value={this.state.blocksCy} size='4' /><br />
                Block Size: <input type="text" onChange={this.onChangeBlockSize} value={this.state.blockSize} size='4' /><br />
                Courtiousness (%): <input type="text" onChange={this.onChangeCourtiousness} value={this.state.courtiousness} size='4' /><br />
                Car Model (1 or 4): <input type="text" onChange={this.onChangeUseCar} value={this.state.useCar} size='4' /><br />
            </div>
        )
    }
}