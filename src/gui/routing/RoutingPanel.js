import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Block                           from './Block';
import Actions                         from '../../actions/Actions.js';
import { DragDropContext }             from 'react-dnd';
import HTML5Backend                    from 'react-dnd-html5-backend';
import BetweenBlockTarget              from './BetweenBlockTarget';

class RoutingPanel extends React.Component {
    constructor() {
        super();
    }

    /** Render individual blocks **/
    renderEmptyBlock() {
        return <Block name="" color="#3A3A3A"/>;
    }

    renderHeaderBlock(index, title) {
        return <Block key={index} header={true} name={title} color="#3A3A3A"/>;
    }

    /** Render lists of blocks **/
    renderEffectsHeader() {
        return this.props.effectInstances.map((elem, index) => {
            return this.renderHeaderBlock(index, "Stage " + index);
        });
    }

    renderModulatorsHeader() {
        return this.props.modulatorsInstances.map((elem, index) => {
            return this.renderHeaderBlock(index, "Modulator " + index);
        });
    }

    renderEffects() {
        return this.props.effectInstances.map((instance, i) => (
            <Block
                key={i}
                position={i}
                type="effect"
                onPress={() => Actions.selectEffect(i) }
                onRightClick={() => Actions.deleteEffect(i) }
                name={instance.name}
                active={instance.IO.mute.read() }
                color="#FD5A35"
                hoverColor="#F77177"
            />
        ));
    }

    renderModulators() {
        return this.props.modulatorsInstances.map((instance, i) => (
            <Block
                key={i}
                position={i}
                type="modulator"
                onPress={() => Actions.selectModulator(i) }
                onRightClick={() => Actions.deleteModulator(i) }
                name={instance.name}
                active={instance.IO.mute.read() }
                color="#873DB9"
                hoverColor="#CF72FF"
            />
        ));
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.line}>
                    { this.renderEffectsHeader() }
                </div>
                <div style={styles.line}>
                    { this.renderEffects() }
                </div>
                <div style={styles.line}>
                    { this.renderModulatorsHeader() }
                </div>
                <div style={styles.line}>
                    { this.renderModulators() }
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        backgroundColor: '#101010',
        padding: 5,
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },

    line: {
        flexDirection: 'row',
        display: 'flex'
    }
};

export default DragDropContext(HTML5Backend)(RoutingPanel);
