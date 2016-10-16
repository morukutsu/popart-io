import uuid from 'node-uuid';

export default class IO {
    constructor(name, type, inputOrOutput, modulateMin, modulateMax, steps) {
        this.uuid = uuid.v4();

        this.name            = name;
        this.type            = type;
        this.inputOrOutput   = inputOrOutput;
        this.modulateBounds  = [modulateMin, modulateMax];
        this.steps           = steps;

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

        if (this.steps) {
            let knobSteps  = this.makeSteps(this.steps);
            let valueIndex = this.searchIndex(knobSteps, outputValue);
            outputValue    = this.steps[valueIndex];
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

    // steps management
    // in an array or ordered values like [0, 1, 2, 3, 4]
    // given a value like: 3.5
    // returns 3 (the index of the lower bound of the interval [3, 4])
    searchIndex(array, valueToFind)
    {
        // Special case: if the value < the lowest element or the highest, early exit
        if (valueToFind <= array[0])
            return 0;

        if (valueToFind >= array[array.length - 1])
            return array.length - 1;

        let lowBound  = 0;
        let highBound = array.length - 1;

        let found = false;
        while (!found)
        {
            let middleBound = lowBound + Math.floor((highBound - lowBound) / 2);

            if (valueToFind < array[middleBound])
            {
                // Value is in the first half of the array
                highBound = middleBound;
            }
            else
            {
                // Value is in the other half
                lowBound = middleBound;
            }

            // If the interval size is 1, we found where is our value
            if (highBound - lowBound == 1)
                found = true;
        }

        return lowBound;
    }

    // Given an array, return an array a equal sized steps between 0 and 1
    makeSteps(array)
    {
        let knobSteps = [];
        let stepIncrement = 1.0 / array.length;

        let currentIncrement = 0.0;
        array.forEach(() => {
            knobSteps.push(currentIncrement);
            currentIncrement += stepIncrement;
        });

        return knobSteps;
    }
};
