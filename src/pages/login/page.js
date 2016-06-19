import React from 'react';
import { browserHistory } from 'react-router';
import styles from './style.css';
import GL from 'gl-react';
import { Surface } from 'gl-react-dom';
import { Effect, EffectCore }          from '../../popart/Effect';
import { StrobeCore, StrobeDisplay }   from '../../popart/FX/Strobe/Strobe';
import { SquareCore, SquareDisplay }   from '../../popart/FX/Square/Square';
import { ImageCore,  ImageDisplay }   from '../../popart/FX/Image/Image';
import { BlurCore,  BlurDisplay }   from '../../popart/FX/Blur/Blur';
import { MosaicCore,  MosaicDisplay }   from '../../popart/FX/Mosaic/Mosaic';
import { RGBSplitCore,  RGBSplitDisplay }   from '../../popart/FX/RGBSplit/RGBSplit';
import { RuttEtraCore,  RuttEtraDisplay }   from '../../popart/FX/RuttEtra/RuttEtra';
import { SynthesizerCore,  SynthesizerDisplay }   from '../../popart/FX/Synthesizer/Synthesizer';

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
        this.blur   = new BlurCore();
        this.mosaic = new MosaicCore();
        this.rgbSplit = new RGBSplitCore();
        this.ruttEtra = new RuttEtraCore();
        this.synthesizer = new SynthesizerCore();

        this.strobe.IO.onColor.set([0.2, 0.1, 0.4, 0.0]);
        this.strobe.IO.offColor.set([0.4, 0.2, 0.8, 0]);

        this.image.IO.image.set('http://favim.com/orig/201105/22/girl-lake-sad-sea-sit-Favim.com-52488.jpg');

        // Modulation
        this.lfo = new LFO();
        this.lfo.IO.frequency.set(1);
        this.lfo.IO.waveform.set('square');
        //this.lfo.IO.pulseWidth.set(0.5);

        this.sineLfo = new LFO();
        this.sineLfo.IO.frequency.set(0.05);
        this.sineLfo.IO.waveform.set('sine');

        this.strobe.IO.trigger.plug(this.lfo.IO.output);

        //this.square.IO.x.plug(this.sineLfo.IO.output);
        this.square.IO.w.set(0.2);
        this.square.IO.h.set(0.2);
        //this.square.IO.squareColor.set([0.0, 0.25, 1.0, 1.0]);
        this.square.IO.squareColor.set([1.0, 1.0, 1.0, 1.0]);
        this.square.IO.x.set(0.5 - 0.2 / 2);
        this.square.IO.y.set(0.5 - 0.2 / 2);

        this.image.IO.y.plug(this.sineLfo.IO.output);
        this.image.IO.y.scale(true, 0.35);
        this.image.IO.y.clamp(true, 0.0, 1.0);

        this.blur.IO.intensity.set(0.5);
        //this.blur.IO.intensity.plug(this.sineLfo.IO.output);
        //this.blur.IO.intensity.scale(true, 40);

        this.mosaic.IO.length.plug(this.sineLfo.IO.output);
        //this.mosaic.IO.length.scale(true, 0.8);
        this.mosaic.IO.length.clamp(true, 0.1, 1.0);

        //this.synthesizer.IO.x.plug(this.sineLfo.IO.output);
        //this.synthesizer.IO.count.plug(this.sineLfo.IO.output);
        this.synthesizer.IO.count.set(5.0);
        this.synthesizer.IO.speed.set(0.2);
        this.synthesizer.IO.color.set([0.8, 0.0, 0.3, 1.0]);

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
        this.blur.tick(dt);
        this.mosaic.tick(dt);
        this.synthesizer.tick(dt);

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
                <Surface width={1280} height={720}>
                    <RuttEtraDisplay state={this.ruttEtra.getState() }>
                        <SynthesizerDisplay state={this.synthesizer.getState() }/>
                    </RuttEtraDisplay>
                </Surface>
            </div>
        );
    }

    /*
    <StrobeDisplay state={this.strobe.getState() }>
        <ImageDisplay state={this.image.getState() }/>
    </StrobeDisplay>
    */

    /*
    <RGBSplitDisplay state={this.rgbSplit.getState() }>
        <MosaicDisplay state={this.mosaic.getState() }>
            <StrobeDisplay state={this.strobe.getState() }>
                <BlurDisplay state={this.blur.getState() }>
                    <SquareDisplay state={this.square.getState() }/>
                </BlurDisplay>
            </StrobeDisplay>
        </MosaicDisplay>
    </RGBSplitDisplay>
    */

    /*
    <RuttEtraDisplay state={this.ruttEtra.getState() }>
        <RGBSplitDisplay state={this.rgbSplit.getState() }>
            <MosaicDisplay state={this.mosaic.getState() }>
                <StrobeDisplay state={this.strobe.getState() }>
                    <BlurDisplay state={this.blur.getState() }>
                        <SquareDisplay state={this.square.getState() }/>
                    </BlurDisplay>
                </StrobeDisplay>
            </MosaicDisplay>
        </RGBSplitDisplay>
    </RuttEtraDisplay>
    */
}
