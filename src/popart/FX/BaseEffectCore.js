export default class BaseEffectCore {
    constructor() {

    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        // Use the current input list and look for corresponding IO values
        this.inputList.forEach((input) => {
            let inputName = input.name;
            this.IO[inputName].set(IOValues[inputName].currentValue);
        });
    }
};
