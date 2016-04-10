import IO  from '../IO/IO';

export default class LFO {
    constructor() {
        this.IO = {
            'frequency' : new IO('float',  'input'), // in Hertz
            'waveform'  : new IO('string', 'input'), // wave form selector
            'pulseWidth': new IO('float',  'input'), // square wave pulse width
            'output'    : new IO('float',  'output') // [0..1] out LFO signal
        };

        this.time = 0.0;

        this.waveFormUpdaters = {
            'square': this.updateSquare.bind(this)
        };
    }

    tick(dt) {
        let currentWaveform = this.IO.waveform.read();
        this.waveFormUpdaters[currentWaveform](dt);
    }

    updateSquare(dt) {
        let periodInSecond = 1.0 / this.IO.frequency.read();
        let pulseWidth = this.IO.pulseWidth.read();
        
        // Set output to high for the first half period
        if (this.time < periodInSecond * pulseWidth ) {
            this.IO.output.set(1.0);
        } else {
            this.IO.output.set(0.0);
        }

        this.time += dt;
        if (this.time > periodInSecond) {
            this.time = 0.0;
        }
    }
}
