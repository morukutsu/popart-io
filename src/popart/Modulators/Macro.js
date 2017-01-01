import IO            from '../IO/IO';
import uuid          from 'node-uuid';
import BaseModulator from './BaseModulator';

export default class Macro extends BaseModulator {
    constructor() {
        super();

        this.name = "Macro";

        this.IO = {
            'mute'   : new IO('mute',   'bool',  'input'),

            'macro1' : new IO('macro1', 'float', 'input', -1, 1),
            'macro2' : new IO('macro2', 'float', 'input', -1, 1),

            'output1' : new IO('output1', 'float', 'output'),
            'output2' : new IO('output2', 'float', 'output'),

        };

        this.time = 0.0;
        this.IO.mute.set(false);

        this.IO.macro1.set(0);
        this.IO.macro2.set(0);

        this.IO.output1.plug(this.IO.macro1);
        this.IO.output2.plug(this.IO.macro2);

        this.buildInputList();
        this.buildOutputList();
    }

    cleanup() {
    }

    tick(dt) {
        //this.IO.output.set(this.IO.macro1.pluggedToMe().read() );
    }

    tempoTick(period) {
    }
}
