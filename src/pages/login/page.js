import React from 'react';
import { browserHistory } from 'react-router';
import stylesCss from './style.css';
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
import SynthesizerController   from '../../popart/FX/Synthesizer/SynthesizerController';

import Block from '../../gui/routing/Block.js';
import Panel from '../../gui/routing/Panel.js';
import Toolbar from '../../gui/routing/Toolbar.js';

//import seaImage from '../../popart/data/image.jpg';

import LFO from '../../popart/Modulators/LFO';

export default class LoginPage extends React.Component {
    constructor() {
        super();
        this.update = this.update.bind(this); // binding
        this.prevTimestamp = 0.0;

        this.state = {
            effectList: ["SynthesizerDisplay", "RuttEtraDisplay"],
            effectTree: {},
            effectInstances: [],
            mouseEvents: {
                mouseUp: false,
            },
            mouseStartX: 0,
            mouseStartY: 0,
        };
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

        /*this.synthesizer = new SynthesizerCore();
        this.synthesizer2 = new SynthesizerCore();

        this.entities = [
            this.synthesizer,
            this.synthesizer2
        ];*/

        this.activeEntity = 0;

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
        //this.synthesizer2.IO.count.set(5.0);
        //this.synthesizer2.IO.speed.set(0.01);
        //this.synthesizer2.IO.x.set(0.5);

        //this.synthesizer.IO.color.set([0.8, 0.0, 0.3, 1.0]);

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

        //this.synthesizer.tick(dt);
        //this.synthesizer2.tick(dt);
        this.state.effectInstances.forEach((instance) => {
            instance.tick(dt);
        });

        this.raf = window.requestAnimationFrame(this.update);

        // Trigger render
        this.setState({
            dummy: 1
        });

        this.prevTimestamp = timestamp;
    }

    componentWillUnmount () {
        cancelAnimationFrame(this.raf);
    }

    //<SquareDisplay state={this.square.getState() }/>

    /*
    <Surface width={640} height={360} style={styles.surface}>
    <SynthesizerDisplay state={this.synthesizer.getState() }>
        <SynthesizerDisplay state={this.synthesizer2.getState() }/>
    </SynthesizerDisplay>
                        </Surface>

    */

    handleMouseUp(event) {
        this.setState({
            mouseEvents: {
                mouseUp: true,
            }
        });
    }

    handleMouseDown(event) {
        this.setState({
            mouseEvents: {
                mouseUp: false,
            },
            mouseDisp: {
                x: 0,
                y: 0
            },
            mouseStartX: event.screenX,
            mouseStartY: event.screenY,
        });
    }

    handleMouseMove(event) {
        this.setState({
            mouseDisp: {
                x: this.state.mouseStartX - event.screenX,
                y: this.state.mouseStartY - event.screenY,
            }
        });
    }

    handleAddFx(id) {
        // TODO: use the id for the factory
        let effect = new SynthesizerCore();
        let instances = this.state.effectInstances;
        instances.push(effect);

        this.setState({
            effectInstances: instances
        });
    }

    lookupComponentByName(name) {
        if (name == "SynthesizerDisplay") {
            return SynthesizerDisplay;
        }

        return null;
    }

    renderEffects() {
        if (this.state.effectInstances.length > 0) {
            let displayComponentName = this.state.effectInstances[0].name + "Display";
            let component = this.lookupComponentByName(displayComponentName);

            return React.createElement(component, {
                state: this.state.effectInstances[0].getState()
            });
        } else {
            return (<div></div>);
        }
    }

    renderController() {
        if (this.state.effectInstances.length > 0) {
            let activeEntity = this.state.effectInstances[this.activeEntity];

            return (
                <SynthesizerController
                    coreState={activeEntity.getState()}
                    onParameterChanged={activeEntity.onParameterChanged.bind(activeEntity)}
                    mouseEvents={this.state.mouseEvents}
                    mouseDisp={this.state.mouseDisp}
                />
            );
        } else {
            return (<div></div>);
        }
    }

    render() {
        let blocks = this.state.effectInstances.map((instance, i) => (
            <Block key={i} onPress={() => { this.activeEntity = i; }}/>
        ));

        return (
            <div
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
            >
                <div style={styles.mainPanel}>
                    <div style={styles.leftPanel}>
                        <Panel>
                            { blocks }
                        </Panel>
                    </div>

                    <div style={styles.rightPanel}>
                        <Surface width={640} height={360} style={styles.surface}>
                            { this.renderEffects() }
                        </Surface>

                        { this.renderController() }
                    </div>
                </div>

                <Toolbar
                    effectList={this.state.effectList}
                    onClick={this.handleAddFx.bind(this)}
                />
            </div>
        );
    }
};

/*

<Surface width={640} height={360} style={styles.surface}>
    <SynthesizerDisplay state={this.synthesizer.getState() }>
        <SynthesizerDisplay state={this.synthesizer2.getState() }/>
    </SynthesizerDisplay>
</Surface>

*/

/*

<SynthesizerController
    coreState={this.state.effectInstances[this.activeEntity].getState()}
    onParameterChanged={this.state.effectInstances[this.activeEntity].onParameterChanged.bind(this.entities[this.activeEntity])}
    mouseEvents={this.state.mouseEvents}
    mouseDisp={this.state.mouseDisp}
/>

*/

const styles = {
    mainPanel: {
        flexDirection: 'row',
        display: 'flex'
    },

    leftPanel: {
        flex: 1,
    },

    rightPanel: {
        flex: 1,
    },

    surface: {
        margin: 10
    }
};

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
