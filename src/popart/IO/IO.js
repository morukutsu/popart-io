export default class IO {
    constructor(name, type, inputOrOutput) {
        this.name = name;
        this.type          = type;
        this.inputOrOutput = inputOrOutput;
        this.pluggedIo     = null;

        this.isClamped = false;
        this.isScaled  = false;

        // TODO: generate a UUID for each new component or IO
    }

    set(value) {
        this.currentValue = value;
    }

    read() {
        let outputValue = this.currentValue;
        if (this.pluggedIo) {
            outputValue = this.pluggedIo.read();
        }

        if (this.isScaled) {
            outputValue = outputValue * this.scaleFactor;
        }

        if (this.isClamped) {
            outputValue = Math.min(this.clampRange[1], outputValue);
            outputValue = Math.max(this.clampRange[0], outputValue);
        }

        if (outputValue === undefined) {
            return 0;
        }

        return outputValue;
    }

    plug(io) {
        this.pluggedIo = io;
    }

    clamp(enable, min, max) {
        this.isClamped = enable;
        this.clampRange = [min, max];
    }

    scale(enable, scaleFactor) {
        this.isScaled = enable;
        this.scaleFactor = scaleFactor;
    }

    isPlugged() {
        return this.pluggedIo !== null;
    }
};
