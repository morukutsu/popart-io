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

            'output' : new IO('output', 'float', 'output'),
        };

        this.time = 0.0;
        this.IO.mute.set(false);
        this.IO.macro1.set(0);

        this.IO.output.plug(this.IO.macro1);
        //this.IO.output.set(1);


        this.buildInputList();
    }

    cleanup() {
    }

    tick(dt) {
        //this.IO.output.set(this.IO.macro1.pluggedToMe().read() );
    }

    tempoTick(period) {
    }
}
