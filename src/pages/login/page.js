import React from 'react';
import { browserHistory } from 'react-router';
import styles from './style.css';
import GL from 'gl-react';
import { Surface } from 'gl-react-dom';
import { Effect, EffectCore }          from '../../popart/Effect';
import { StrobeCore, StrobeDisplay }   from '../../popart/FX/Strobe/Strobe';
import { SquareCore, SquareDisplay }   from '../../popart/FX/Square/Square';
import { ImageCore,  ImageDisplay }   from '../../popart/FX/Image/Image';

//import seaImage from '../../popart/data/image.jpg';

import LFO from '../../popart/Modulators/LFO';

export default class LoginPage extends React.Component {
    constructor() {
        super();
        this.update = this.update.bind(this); // binding
        this.prevTimestamp = 0.0;
    }

    componentWillMount() {
        // FX
        this.strobe = new StrobeCore();
        this.square = new SquareCore();
        this.image  = new ImageCore();

        this.strobe.IO.onColor.set([0.2, 0.5, 0.6, 0.0]);
        this.strobe.IO.offColor.set([0.0, 0, 0, 0]);

        this.image.IO.image.set('http://favim.com/orig/201105/22/girl-lake-sad-sea-sit-Favim.com-52488.jpg');

        // Modulation
        this.lfo = new LFO();
        this.lfo.IO.frequency.set(5);
        this.lfo.IO.waveform.set('square');
        this.lfo.IO.pulseWidth.set(0.1);

        this.sineLfo = new LFO();
        this.sineLfo.IO.frequency.set(0.2);
        this.sineLfo.IO.waveform.set('sine');

        this.strobe.IO.trigger.plug(this.lfo.IO.output);

        this.square.IO.x.plug(this.sineLfo.IO.output);
        this.update();
    }

    update(timestamp) {
        if (!timestamp) {
            this.raf = window.requestAnimationFrame(this.update);
            return;
        }

        let dt = (timestamp - this.prevTimestamp) / 1000.0;
        this.strobe.tick(dt);
        this.lfo.tick(dt);
        this.sineLfo.tick(dt);
        this.square.tick(dt);

        this.raf = window.requestAnimationFrame(this.update);

        // Trigger renger
        this.setState({
            dummy: 1
        });

        this.prevTimestamp = timestamp;
    }

    componentWillUnmount () {
        cancelAnimationFrame(this.raf);
    }

    //<SquareDisplay state={this.square.getState() }/>
    render() {
        return (
            <div className={styles.content}>
                <Surface width={511} height={341}>
                    <StrobeDisplay state={this.strobe.getState() }>
                        <ImageDisplay state={this.image.getState() }/>
                    </StrobeDisplay>
                </Surface>
            </div>
        );
    }
}
