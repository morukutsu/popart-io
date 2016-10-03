import uuid from 'node-uuid';

export default class IO {
    constructor(name, type, inputOrOutput, modulateMin, modulateMax) {
        this.uuid = uuid.v4();

        this.name            = name;
        this.type            = type;
        this.inputOrOutput   = inputOrOutput;
        this.modulateBounds  = [modulateMin, modulateMax];

        this.pluggedIo       = null;
        this.modulationRange = 0.5;

        // When the IO is an output, we keep a list of every Inputs connected to it
        this.pluggedToMe = {};

        this.isClamped   = false;
        this.isScaled    = false;
        this.isModulated = false;

        if (modulateMin !== undefined && modulateMax !== undefined) {
            this.clamp(true, modulateMin, modulateMax);
        }
    }

    set(value) {
        this.currentValue = value;
    }

    read() {
        let outputValue = this.currentValue;
        if (this.pluggedIo) {
            if (this.isModulated) {
                let modulateRange = this.modulateBounds[1] - this.modulateBounds[0];
                outputValue = this.currentValue + (this.pluggedIo.read() * this.getModulationRange() * modulateRange / 2.0);
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

    readAsBool() {
        return this.read() >= 0.5;
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
        if (!this.isPlugged() ) {
            console.log("[Warning] Trying to unplug simething unplugged!");
            return;
        }

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
