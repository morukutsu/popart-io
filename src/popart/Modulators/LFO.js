import IO   from '../IO/IO';
import uuid from 'node-uuid';

export default class LFO {
    constructor() {
        this.uuid = uuid.v4();

        this.name = "LFO";

        this.IO = {
            'mute'      : new IO('mute',       'bool',   'input'),
            'frequency' : new IO('frequency',  'float',  'input', 0, 10), // in Hertz
            'waveform'  : new IO('waveform',   'string', 'input'),        // wave form selector
            'pulseWidth': new IO('pulseWidth', 'float',  'input'),        // square wave pulse width
            'output'    : new IO('output',     'float',  'output')        // [0..1] out LFO signal
        };

        this.time = 0.0;

        this.waveFormUpdaters = {
            'square': this.updateSquare.bind(this),
            'sine'  : this.updateSine.bind(this),
        };

        this.IO.mute.set(false);
        this.IO.frequency.set(0.05);
        this.IO.waveform.set('sine');

        this.buildInputList();
    }

    cleanup() {

    }

    loadParametersValues(parameters) {
        let IOValues = parameters.IO;

        this.uuid = parameters.uuid;
        this.time = parameters.time;

        // Use the current input list and look for corresponding IO values
        Object.keys(this.IO).forEach((key) => {
            if (!this.IO.hasOwnProperty(key)) {
                return;
            }

            let io = this.IO[key];
            let inputName = io.name;

            if (IOValues[inputName]) {
                this.IO[inputName].set(IOValues[inputName].currentValue);
                this.IO[inputName].uuid = IOValues[inputName].uuid;
                this.IO[inputName].pluggedToMe = IOValues[inputName].pluggedToMe;
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

    tick(dt) {
        if (this.IO.mute.read() ) {
            return;
        }

        let currentWaveform = this.IO.waveform.read();
        this.waveFormUpdaters[currentWaveform](dt);
    }

    tempoTick(period) {
        //this.IO.frequency.set(1.0 / period);
    }

    updateSquare(dt) {
        let periodInSeconds = 1.0 / this.IO.frequency.read();
        let pulseWidth = this.IO.pulseWidth.read();

        // Set output to high for the first half period
        if (this.time < periodInSeconds * pulseWidth ) {
            this.IO.output.set(1.0);
        } else {
            this.IO.output.set(0.0);
        }

        this.time += dt;
        if (this.time > periodInSeconds) {
            this.time = 0.0;
        }
    }

    updateSine(dt) {
        let periodInSeconds = 1.0 / this.IO.frequency.read();
        let sinusPeriod = 2 * Math.PI;
        let nDt = periodInSeconds / dt;
        let sinusIncrement = sinusPeriod / nDt;
        this.IO.output.set(Math.sin(this.time));
        this.time += sinusIncrement;
    }

    getState() {
        return this;
    }

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
    }

    getState() {
        return this;
    }
}
