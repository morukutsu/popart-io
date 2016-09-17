import React              from 'react';
import { browserHistory } from 'react-router';
import GL                 from 'gl-react';
import alt                from '../../alt';
import Actions            from '../../actions/Actions.js';
import Store              from '../../stores/Store.js';
import connectToStores    from 'alt-utils/lib/connectToStores';

import EffectView         from '../../popart/EffectView/EffectView';
import EffectFactory      from '../../popart/FX/EffectFactory';
import Block              from '../../gui/routing/Block.js';
import Panel              from '../../gui/routing/Panel.js';
import Toolbar            from '../../gui/routing/Toolbar.js';
import Menu               from '../../gui/menu/Menu.js';
import Events             from '../../popart/Events';
import RefreshManager     from '../../popart/RefreshManager';

class Page extends React.Component {
    constructor() {
        super();

        this.update = this.update.bind(this); // binding
        this.prevTimestamp = 0.0;
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
        /*if (RefreshManager.getRefreshFlag() ) {
            this.setState({
                dummy: 1
            });

            RefreshManager.clearRefresh();
        }*/

        this.setState({
            dummy: 1
        });

        this.prevTimestamp = timestamp;

        Events.emit('refresh');
    }

    componentWillUnmount () {
        cancelAnimationFrame(this.raf);
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

    renderController() {
        // Generic code to manage the effect controllers and the modulator controllers
        let list           = this.props.lastSelectedEntityType == 'effect' ? this.props.effectInstances : this.props.modulatorsInstances;
        let activeEntityId = this.props.lastSelectedEntityType == 'effect' ? this.props.activeEntity    : this.props.activeModulator;

        if (list.length > 0) {
            let activeEntity            = list[activeEntityId];
            let controllerComponentName = activeEntity.name + "Controller";
            let component               = EffectFactory.lookupComponentByName(controllerComponentName);

            return React.createElement(component, {
                coreState:                activeEntity.getState(),
                onParameterChanged:       activeEntity.onParameterChanged.bind(activeEntity),
                onModulationRangeChanged: activeEntity.onModulationRangeChanged ? activeEntity.onModulationRangeChanged.bind(activeEntity) : null,
                onParameterSelected:      this.handleParameterSelected,
                modulators:               this.props.modulatorsInstances,
                selectedParameter:        this.props.selectedParameter,
            });
        } else {
            return (<div></div>);
        }
    }

    render() {
        return (
            <div>
                <Menu />

                <div style={styles.mainPanel}>
                    <div style={styles.leftPanel}>
                        <Panel
                            effectInstances={this.props.effectInstances}
                            modulatorsInstances={this.props.modulatorsInstances}
                        />
                    </div>

                    <div style={styles.rightPanel}>
                        <EffectView
                            effectInstances={this.props.effectInstances}
                        />

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
        flexGrow: 1,
        flexShrink: 2,
        margin: 10
    },

    rightPanel: {
        flex: 1,
        flexBasis: 640
    },

    surface: {
        margin: 10
    }
};

export default connectToStores(Page);
