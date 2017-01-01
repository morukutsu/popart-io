import IO            from '../IO/IO';
import uuid          from 'node-uuid';
import BaseModulator from './BaseModulator';

export default class LFO extends BaseModulator {
    constructor() {
        super();

        this.name = "LFO";

        this.IO = {
            'mute'      : new IO('mute',       'bool',   'input'),
            'waveform'   : new IO('waveform',   'float', 'input', 0, 1),
            'frequency' : new IO('frequency',  'float',  'input', 0, 10), // in Hertz
            'multiplier': new IO('multiplier', 'float',  'input', 0, 1, [0.125/2.0, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0]),
            'bpmLock'   : new IO('bpmLock',    'bool',   'input'),
            //'waveform'  : new IO('waveform',   'string', 'input'),        // wave form selector
            'pulseWidth': new IO('pulseWidth', 'float',  'input'),        // square wave pulse width
            'output'    : new IO('output',     'float',  'output')        // [0..1] out LFO signal
        };

        // TODO: LFO phase?

        this.time = 0.0;

        this.waveFormUpdaters = {
            'square': this.updateSquare.bind(this),
            'sine'  : this.updateSine.bind(this),
        };

        this.IO.mute.set(false);
        this.IO.waveform.set(1.0);
        this.IO.frequency.set(0.05);
        this.IO.multiplier.set(0.5);
        this.IO.bpmLock.set(false);
        this.IO.pulseWidth.set(0.5);

        this.buildInputList();
        this.buildOutputList();
    }

    cleanup() {

    }

    tick(dt) {
        if (this.IO.mute.read() ) {
            return;
        }

        let currentWaveform = this.IO.waveform.read();

        if (currentWaveform > 0.75) {
            this.waveFormUpdaters['sine'](dt);
        } else if (currentWaveform < 0.25) {
            this.waveFormUpdaters['square'](dt);
        }
    }

    tempoTick(period) {
        if (this.IO.bpmLock.read()) {
            this.IO.frequency.set(1.0 / (period * this.IO.multiplier.read() ));
        }
    }

    updateSquare(dt) {
        let periodInSeconds = 1.0 / this.IO.frequency.read();
        let pulseWidth = this.IO.pulseWidth.read();

        // Set output to high for the first half period
        if (this.time < periodInSeconds * pulseWidth ) {
            this.IO.output.set(1.0);
        } else {
            this.IO.output.set(-1.0);
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
