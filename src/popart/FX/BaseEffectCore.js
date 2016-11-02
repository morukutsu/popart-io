import uuid from 'node-uuid';
import RefreshManager from '../RefreshManager';

export default class BaseEffectCore {
    constructor() {
        this.uuid = uuid.v4();
        this.time = 0.0;

        this.parametersToSave   = ["uuid", "time"];
        this.ioParametersToSave = ["uuid", "pluggedIo", "pluggedEntity", "modulationRange", "isModulated"];
    }

    sync() {
        this.time = 0.0;
    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        // Reload core effect fields
        this.parametersToSave.forEach((elem) => {
            this[elem] = parameters[elem];
        });

        // Use the current input list and look for corresponding IO values
        this.inputList.forEach((input) => {
            let inputName = input.name;

            if (IOValues[inputName]) {
                // TODO: find out a non explicit way to reload all of these parameters
                this.IO[inputName].set(IOValues[inputName].currentValue);
                this.ioParametersToSave.forEach((elem) => {
                    this.IO[inputName][elem] = IOValues[inputName][elem];
                });
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
            // Build the inputlist
            let parameter = this.IO[parameterName];
            if (parameter.inputOrOutput == "input") {
                this.inputList.push(parameter);
            }

            // Set the default value of each parameter
            parameter.setDefaultValue(parameter.currentValue);
        });
    }

    onParameterChanged(parameter, value) {
        // Here we should trigger the refresh manager
        RefreshManager.scheduleRefresh();

        this.IO[parameter].set(value);
    }

    onModulationRangeChanged(parameter, value) {
        this.IO[parameter].setModulationRange(value);
    }

    getState() {
        return this;
    }
};
