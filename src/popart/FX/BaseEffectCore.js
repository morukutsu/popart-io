import uuid from 'node-uuid';

export default class BaseEffectCore {
    constructor() {
        this.uuid = uuid.v4();
        this.time = 0.0;
    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        this.uuid = parameters.uuid;
        this.time = parameters.time;

        // Use the current input list and look for corresponding IO values
        this.inputList.forEach((input) => {
            let inputName = input.name;

            if (IOValues[inputName]) {
                // TODO: find out a non explicit way to reload all of these parameters
                this.IO[inputName].set(IOValues[inputName].currentValue);
                this.IO[inputName].uuid            = IOValues[inputName].uuid;
                this.IO[inputName].pluggedIo       = IOValues[inputName].pluggedIo;
                this.IO[inputName].pluggedEntity   = IOValues[inputName].pluggedEntity;
                this.IO[inputName].modulationRange = IOValues[inputName].modulationRange;
                this.IO[inputName].isModulated     = IOValues[inputName].isModulated;
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

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
    }

    onModulationRangeChanged(parameter, value) {
        this.IO[parameter].setModulationRange(value);
    }

    getState() {
        return this;
    }
};
