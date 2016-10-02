import IO   from '../IO/IO';
import uuid from 'node-uuid';

export default class Sequencer {
    constructor() {
        this.uuid = uuid.v4();

        this.name = "Sequencer";

        this.IO = {
            'mute'      : new IO('mute',       'bool',   'input'),
            'frequency' : new IO('frequency',  'float',  'input', 0, 10), // in Hertz
            'bpmLock'   : new IO('bpmLock',    'bool',   'input'),

            'step0'     : new IO('step0',      'float',  'input', -1, 1),
            'step1'     : new IO('step1',      'float',  'input', -1, 1),
            'step2'     : new IO('step2',      'float',  'input', -1, 1),
            'step3'     : new IO('step3',      'float',  'input', -1, 1),

            'output'    : new IO('output',     'float',  'output')       // [0..1] out LFO signal
        };

        this.time = 0.0;

        this.IO.mute.set(false);
        this.IO.frequency.set(0.05);
        this.IO.bpmLock.set(false);

        this.IO.step0.set(0.0);
        this.IO.step1.set(0.0);
        this.IO.step2.set(0.0);
        this.IO.step3.set(0.0);

        this.buildInputList();

        this.currentStep = 0;
    }

    cleanup() {

    }

    sync() {
        this.time = 0.0;
        this.currentStep = 0;
    }

    tick(dt) {
        if (this.IO.mute.read() ) {
            return;
        }

        const periodInSeconds = 1.0 / this.IO.frequency.read();

        this.IO.output.set(this.IO["step" + this.currentStep].read() );

        this.time += dt;
        if (this.time > periodInSeconds) {
            this.time = 0.0;
            this.currentStep = (this.currentStep + 1) % 4
        }
    }

    tempoTick(period) {
        if (this.IO.bpmLock.read()) {
            this.IO.frequency.set(1.0 / period);
        }
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
