import React from 'react';
import { browserHistory } from 'react-router';
import GL from 'gl-react';
import alt from '../../alt';
import Actions from '../../actions/Actions.js';
import Store   from '../../stores/Store.js';
import connectToStores from 'alt-utils/lib/connectToStores';

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
import RuttEtraController   from '../../popart/FX/RuttEtra/RuttEtraController';
import EffectView from '../../popart/EffectView/EffectView';
import EffectFactory from '../../popart/FX/EffectFactory';
import NullDisplay                     from '../../popart/FX/Null/Null';


import Block   from '../../gui/routing/Block.js';
import Panel   from '../../gui/routing/Panel.js';
import Toolbar from '../../gui/routing/Toolbar.js';
import Menu    from '../../gui/menu/Menu.js';

import LFO from '../../popart/Modulators/LFO';

class Page extends React.Component {
    constructor() {
        super();

        this.update = this.update.bind(this); // binding
        this.prevTimestamp = 0.0;

        this.mouseEvents = {
            mouseUp: false,
        };

        this.mouseStartX = 0;
        this.mouseStartY = 0;
    }

    static getStores() {
        return [Store];
    }

    static getPropsFromStores() {
        return Store.getState();
    }

    componentWillMount() {
        this.update();
    }

    update(timestamp) {
        if (!timestamp) {
            this.raf = window.requestAnimationFrame(this.update);
            return;
        }

        let dt = (timestamp - this.prevTimestamp) / 1000.0;

        this.props.effectInstances.forEach((instance) => {
            instance.tick(dt);
        });

        this.props.modulatorsInstances.forEach((instance) => {
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

    handleMouseUp(event) {
        if (event.button != 0) {
            return;
        }

        this.mouseEvents = {
            mouseUp: true,
        };
    }

    handleMouseDown(event) {
        if (event.button != 0) {
            return;
        }

        this.mouseEvents = {
            mouseUp: false,
        };

        this.nextMouseDisp = {
            x: 0,
            y: 0,
        };

        this.mouseStartX = event.screenX;
        this.mouseStartY = event.screenY;
    }

    handleMouseMove(event) {
        this.nextMouseDisp = {
            x: this.mouseStartX - event.screenX,
            y: this.mouseStartY - event.screenY,
        };
    }

    handleAddFx(id) {
        // TODO: every instanciated element should have a unique id
        let coreComponentName = id + "Core";
        let component = EffectFactory.lookupComponentByName(coreComponentName);

        // Instantiate the core component
        let effect = new component();
        Actions.addEffect(effect);
    }

    handleAddModulator(name) {
        let component = EffectFactory.lookupComponentByName(name);
        let effect = new component();
        Actions.addModulator(effect);
    }

    handleParameterSelected(parameter) {
        Actions.selectParameter(parameter);
    }

    renderEffects() {
        // TODO: here we have to use a graph to display all the effects correctly
        // Currently the routing is done from left to right
        if (this.props.effectInstances.length > 0) {
            // Traverse to create the component chain
            let children = null;

            for (var i = 0; i < this.props.effectInstances.length; i++) {
                let currentEffect = this.props.effectInstances[i];

                let displayComponentName = currentEffect.name + "Display";
                let component = EffectFactory.lookupComponentByName(displayComponentName);

                // Create the react component
                let componentInstance = React.createElement(component, {
                    state:    currentEffect.getState(),
                    children: children
                });

                // Set the current component to be the children of the next one
                children = componentInstance;
            }

            // Return the last instianciated compnent
            return children;
        } else {
            return (<NullDisplay />);
        }
    }

    renderController() {
        if (this.props.effectInstances.length > 0) {
            let activeEntity = this.props.effectInstances[this.props.activeEntity];
            let controllerComponentName = activeEntity.name + "Controller";
            let component = EffectFactory.lookupComponentByName(controllerComponentName);

            return React.createElement(component, {
                coreState:                activeEntity.getState(),
                onParameterChanged:       activeEntity.onParameterChanged.bind(activeEntity),
                onParameterSelected:      this.handleParameterSelected,
                modulators:               this.props.modulatorsInstances,
                selectedParameter:        this.props.selectedParameter,
                mouseEvents:              this.mouseEvents,
                mouseDisp:                this.nextMouseDisp,
            });
        } else {
            return (<div></div>);
        }
    }

    render() {
        let effectBlocks = this.props.effectInstances.map((instance, i) => (
            <Block
                key={i}
                onPress={() => Actions.selectEffect(i) }
                onRightClick={() => Actions.deleteEffect(i) }
                name={instance.name}
                active={instance.IO.mute.read() }
                color="#FD5A35"
                hoverColor="#F77177"
            />
        ));

        let modulatorBlocks = this.props.modulatorsInstances.map((instance, i) => (
            <Block
                key={i}
                name={instance.name}
                active={instance.IO.mute.read() }
                color="#873DB9"
                hoverColor="#CF72FF"
            />
        ));

        return (
            <div
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
            >
                <Menu />

                <div style={styles.mainPanel}>
                    <div style={styles.leftPanel}>
                        <Panel
                            effects={effectBlocks}
                            modulators={modulatorBlocks}
                        />
                    </div>

                    <div style={styles.rightPanel}>
                        <EffectView>
                            { this.renderEffects() }
                        </EffectView>

                        { this.renderController() }
                    </div>
                </div>

                <Toolbar
                    effectList={this.props.effectList}
                    modulatorsList={this.props.modulatorsList}
                    onEffectClick={this.handleAddFx.bind(this)}
                    onModulatorClick={this.handleAddModulator.bind(this)}
                />

                <div onClick={ () => Actions.save() } style={{size: 20, backgroundColor: "white", width: 80, cursor: "pointer", margin: 5}}>Save</div>

                <div onClick={ () => Actions.load(EffectFactory) } style={{size: 20, backgroundColor: "white", width: 80, cursor: "pointer", margin: 5}}>Load</div>
            </div>
        );
    }
};

const styles = {
    mainPanel: {
        flexDirection: 'row',
        display: 'flex'
    },

    leftPanel: {
        flex: 1,
        margin: 10
    },

    rightPanel: {
        flex: 1,
    },

    surface: {
        margin: 10
    }
};

export default connectToStores(Page);
