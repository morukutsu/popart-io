import React from 'react';
import { browserHistory } from 'react-router';
import styles from './style.css';
import GL from 'gl-react';
import { Surface } from 'gl-react-dom';
import { Effect, EffectCore }          from '../../popart/Effect';
import { StrobeCore, StrobeDisplay }   from '../../popart/FX/Strobe/Strobe';
import LFO from '../../popart/Modulators/LFO';

export default class LoginPage extends React.Component {
    constructor() {
        super();
        this.update = this.update.bind(this); // binding
    }

    componentWillMount() {
        this.ec = new StrobeCore();
        this.lfo = new LFO();
        this.lfo.IO.frequency.set(10);
        this.lfo.IO.waveform.set('square');
        this.lfo.IO.pulseWidth.set(0.9);

        this.ec.IO.trigger.plug(this.lfo.IO.output);
        this.update();
    }

    update() {
        this.ec.tick(0.016);
        this.lfo.tick(0.016);

        this.raf = window.requestAnimationFrame(this.update);

        // Trigger renger
        this.setState({
            dummy: 1
        });
    }

    componentWillUnmount () {
        cancelAnimationFrame(this.raf);
    }

    render() {
        return (
            <div className={styles.content}>
                hello world
                <Surface width={511} height={341}>
                    <StrobeDisplay state={this.ec.getState() }/>
                </Surface>
            </div>
        );
    }
}
