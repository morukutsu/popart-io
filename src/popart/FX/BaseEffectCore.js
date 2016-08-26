export default class BaseEffectCore {
    constructor() {

    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        // Use the current input list and look for corresponding IO values
        this.inputList.forEach((input) => {
            let inputName = input.name;

            if (IOValues[inputName]) {
                this.IO[inputName].set(IOValues[inputName].currentValue);
            } else {
                // In this case, the parameter does not exist in the save file
                // this may happen when loading a file made with an old version of the software
                // TODO: initialize this parameter with a default value
            }
        });
    }
};
