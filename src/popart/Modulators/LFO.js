import IO            from '../IO/IO';
import uuid          from 'node-uuid';
import BaseModulator from './BaseModulator';

export default class LFO extends BaseModulator {
    constructor() {
        super();

        this.name = "LFO";

        this.IO = {
            'mute'      : new IO('mute',       'bool',   'input'),
            'frequency' : new IO('frequency',  'float',  'input', 0, 10), // in Hertz
            'bpmLock'   : new IO('bpmLock',    'bool',   'input'),
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
        this.IO.bpmLock.set(false);

        this.buildInputList();
    }

    cleanup() {

    }

    tick(dt) {
        if (this.IO.mute.read() ) {
            return;
        }

        let currentWaveform = this.IO.waveform.read();
        this.waveFormUpdaters[currentWaveform](dt);
    }

    tempoTick(period) {
        if (this.IO.bpmLock.read()) {
            this.IO.frequency.set(1.0 / period);
        }
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
}
