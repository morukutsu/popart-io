import uuid from 'node-uuid';

export default class IO {
    constructor(name, type, inputOrOutput) {
        this.uuid = uuid.v4();

        this.name            = name;
        this.type            = type;
        this.inputOrOutput   = inputOrOutput;
        this.pluggedIo       = null;
        this.modulationRange = 1.0;

        // When the IO is an output, we keep a list of every Inputs connected to it
        this.pluggedToMe = {};

        this.isClamped   = false;
        this.isScaled    = false;
        this.isModulated = false;

        // TODO: generate a UUID for each new component or IO
    }

    set(value) {
        this.currentValue = value;
    }

    read() {
        let outputValue = this.currentValue;
        if (this.pluggedIo) {
            if (this.isModulated) {
                outputValue = this.currentValue + this.pluggedIo.read();
            } else {
                outputValue = this.pluggedIo.read();
            }
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

    readRaw() {
        return this.currentValue;
    }

    // Connect an output to an input
    // io:     an output
    // entity: the entity containing the input
    plug(io, entity) {
        this.pluggedIo     = io;       // output (io) is connected to input (this)
        this.pluggedEntity = entity;

        this.pluggedIo.pluggedToMe[this.uuid] = this;
    }

    unplug() {
        delete this.pluggedIo.pluggedToMe[this.uuid];

        this.pluggedIo     = null;
        this.pluggedEntity = null;
        this.isModulated   = false;
    }

    // Combined with plugging, it allows to modulate the current value instead of
    // replacing the input value directly
    modulate(enable) {
        this.isModulated = enable;
    }

    getModulationRange() {
        return this.modulationRange;
    }

    setModulationRange(range) {
        this.modulationRange = range;
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
