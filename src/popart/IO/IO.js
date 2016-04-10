export default class IO {
    constructor(type, inputOrOutput) {
        this.type          = type;
        this.inputOrOutput = inputOrOutput;
        this.pluggedIo     = null;
    }

    set(value) {
        this.currentValue = value;
    }

    read() {
        if (this.pluggedIo) {
            return this.pluggedIo.read();
        }

        return this.currentValue;
    }

    plug(io) {
        this.pluggedIo = io;
    }

    isPlugged() {
        return this.pluggedIo !== null;
    }
};
