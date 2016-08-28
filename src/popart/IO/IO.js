import uuid from 'node-uuid';

export default class IO {
    constructor(name, type, inputOrOutput) {
        this.uuid = uuid.v4();

        this.name          = name;
        this.type          = type;
        this.inputOrOutput = inputOrOutput;
        this.pluggedIo     = null;

        // When the IO is an output, we keep a list of every Inputs connected to it
        this.pluggedToMe   = [];

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

    // Connect an output to an input
    // io:     an output
    // entity: the entity containing the input
    plug(io, entity) {
        this.pluggedIo     = io;
        this.pluggedEntity = entity;
    }

    unplug() {
        this.pluggedIo     = null;
        this.pluggedEntity = null;
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
