import IO   from '../IO/IO';
import uuid from 'node-uuid';

export default class BaseModulator {
    constructor() {
        this.uuid = uuid.v4();
        this.time = 0.0;
    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        this.uuid = parameters.uuid;
        this.time = parameters.time;

        // Use the current input list and look for corresponding IO values
        Object.keys(this.IO).forEach((key) => {
            if (!this.IO.hasOwnProperty(key)) {
                return;
            }

            let io = this.IO[key];
            let inputName = io.name;

            if (IOValues[inputName]) {
                this.IO[inputName].set(IOValues[inputName].currentValue);
                this.IO[inputName].uuid = IOValues[inputName].uuid;
                this.IO[inputName].pluggedToMe = IOValues[inputName].pluggedToMe;
            } else {
                // In this case, the parameter does not exist in the save file
                // this may happen when loading a file made with an old version of the software
                // TODO: initialize this parameter with a default value
            }
        });
    }

    buildInputList() {
        this.inputList = [];
        Object.keys(this.IO).forEach((parameterName) => {
            let parameter = this.IO[parameterName];
            if (parameter.inputOrOutput == "input") {
                this.inputList.push(parameter);
            }
        });
    }

    buildOutputList() {
        this.outputList = [];
        Object.keys(this.IO).forEach((parameterName) => {
            let parameter = this.IO[parameterName];
            if (parameter.inputOrOutput == "output") {
                this.outputList.push(parameter);
            }
        });
    }

    sync() {
        this.time = 0.0;
    }

    getState() {
        return this;
    }

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
    }

    onModulationRangeChanged(parameter, value) {
        this.IO[parameter].setModulationRange(value);
    }
};
