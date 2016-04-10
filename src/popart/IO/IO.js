export default class IO {
    constructor(type, inputOrOutput) {
        this.type          = type;
        this.inputOrOutput = inputOrOutput;
    }

    set(value) {
        this.currentValue = value;
    }

    read() {
        return this.currentValue;
    }
};
