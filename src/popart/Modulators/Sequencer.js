import IO   from '../IO/IO';
import uuid from 'node-uuid';
import BaseModulator from './BaseModulator';

export default class Sequencer extends BaseModulator {
    constructor() {
        super();

        this.name = "Sequencer";

        this.IO = {
            'mute'      : new IO('mute',       'bool',   'input'),
            'frequency' : new IO('frequency',  'float',  'input', 0, 10), // in Hertz
            'multiplier': new IO('multiplier', 'float',  'input', 0, 1, [0.125/2.0, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0]),
            'bpmLock'   : new IO('bpmLock',    'bool',   'input'),

            'currentStep': new IO('currentStep', 'float',  'input', 0, 4), // TODO: internal parameters?

            'step0'     : new IO('step0',      'float',  'input', -1, 1),
            'step1'     : new IO('step1',      'float',  'input', -1, 1),
            'step2'     : new IO('step2',      'float',  'input', -1, 1),
            'step3'     : new IO('step3',      'float',  'input', -1, 1),

            'output'    : new IO('output',     'float',  'output')       // [0..1] out LFO signal
        };

        this.IO.mute.set(false);
        this.IO.frequency.set(0.05);
        this.IO.bpmLock.set(false);
        this.IO.currentStep.set(0);
        this.IO.multiplier.set(0.5);

        this.IO.step0.set(0.0);
        this.IO.step1.set(0.0);
        this.IO.step2.set(0.0);
        this.IO.step3.set(0.0);

        this.buildInputList();
        this.buildOutputList();
    }

    cleanup() {

    }

    sync() {
        super.sync();
        this.IO.currentStep.set(0);
    }

    tick(dt) {
        if (this.IO.mute.read() ) {
            return;
        }

        const periodInSeconds = 1.0 / (this.IO.frequency.read());

        this.IO.output.set(this.IO["step" + this.IO.currentStep.read()].read() );

        this.time += dt;
        if (this.time > periodInSeconds) {
            this.time = 0.0;
            this.IO.currentStep.set((this.IO.currentStep.read() + 1) % 4);
        }
    }

    tempoTick(period) {
        if (this.IO.bpmLock.read()) {
            this.IO.frequency.set(1.0 / (period * this.IO.multiplier.read() ));
        }
    }
}
