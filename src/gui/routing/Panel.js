import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdChevronRight                  from 'react-icons/lib/md/chevron-right';
import MdAddCircleOutline              from 'react-icons/lib/md/add-circle-outline';
import Actions                         from '../../actions/Actions.js';
import Block                          from './Block.js';

var MIN_GRID_WIDTH = 4;

class Panel extends React.Component {
    constructor() {
        super();

        this.renderedEffectInstancesCount    = 0;
        this.renderedModulatorsInstanceCount = 0;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.renderedEffectInstancesCount     !== nextProps.effectInstances.length ||
            this.renderedModulatorsInstanceCount  !== nextProps.modulatorsInstances.length)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    getStageCount() {
        return this.props.effectInstances.length + 1;
    }

    renderHeader() {
        let stages    = [];
        let numStages = this.getStageCount();

        for (var i = 0; i < numStages; i++) {
            let text = "Stage " + i;

            if (i == numStages - 1) {
                text = ""
            }

            if (i == numStages - 2) {
                text = "Output"
            }

            stages.push(text);
        }

        let stagesComponents = stages.map((elem, index) => (
            <div
                key={index}
                style={styles.headerBlock}
            >
                { elem }
                <MdChevronRight/>
            </div>
        ));

        let fillers = [];
        if (stagesComponents.length < MIN_GRID_WIDTH) {
            for (var i = 0; i < MIN_GRID_WIDTH - stagesComponents.length; i++) {
                fillers.push(
                    <div
                        key={"fillers" + i}
                        style={styles.headerBlock}
                    >
                    </div>
                );
            }
        }

        return [stagesComponents, fillers];
    }

    renderEmptyBlocks() {
        let numberOfEmptyBlocks = this.getStageCount() - this.props.effectInstances.length;
        let emptyBlocks = [];

        for (var i = 0; i < numberOfEmptyBlocks; i++) {
            emptyBlocks.push(
                <div
                    key={i}
                    style={styles.emptyBlock}
                >
                    Add
                    <MdAddCircleOutline style={{margin: 5}}/>
                </div>
            );
        }

        let fillers = [];
        if (this.getStageCount() < MIN_GRID_WIDTH) {
            for (var i = 0; i < MIN_GRID_WIDTH - (this.getStageCount() ); i++) {
                fillers.push(
                    <div
                        key={"fillers" + i}
                        style={styles.emptyBlock}
                    >
                    </div>
                );
            }
        }

        return [emptyBlocks, fillers];
    }

    renderEmptyModulatorBlocks() {
        let numberOfEmptyBlocks = 1;
        let emptyBlocks = [];

        for (var i = 0; i < numberOfEmptyBlocks; i++) {
            emptyBlocks.push(
                <div
                    key={i}
                    style={styles.emptyBlock}
                >
                    Add
                    <MdAddCircleOutline style={{margin: 5}}/>
                </div>
            );
        }

        let fillers = [];
        if (this.getStageCount() < MIN_GRID_WIDTH) {
            for (var i = 0; i < MIN_GRID_WIDTH - (this.props.modulatorsInstances.length + 1); i++) {
                fillers.push(
                    <div
                        key={"fillers" + i}
                        style={styles.emptyBlock}
                    >
                    </div>
                );
            }
        }

        return [emptyBlocks, fillers];
    }

    renderModulatorsHeader() {
        let MODULATORS_GRID_SIZE = 4;

        let modulators = [];
        for (var i = 0; i < MODULATORS_GRID_SIZE; i++) {
            modulators.push(
                <div
                    key={i}
                    style={styles.headerBlock}
                >
                    Modulator { i }
                </div>
            );
        }

        return modulators;
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

        this.renderedEffectInstancesCount = effectBlocks.length;

        let modulatorBlocks = this.props.modulatorsInstances.map((instance, i) => (
            <Block
                key={i}
                onPress={() => Actions.selectModulator(i) }
                onRightClick={() => Actions.deleteModulator(i) }
                name={instance.name}
                active={instance.IO.mute.read() }
                color="#873DB9"
                hoverColor="#CF72FF"
            />
        ));

        this.renderedModulatorsInstanceCount = modulatorBlocks.length;

        return (
            <div
                style={styles.container}
            >
                <div style={styles.internalContainer}>
                    <div style={styles.row}>
                        { this.renderHeader() }
                    </div>
                    <div style={styles.row}>
                        { effectBlocks }
                        { this.renderEmptyBlocks() }
                    </div>

                    <div style={styles.row}>
                        { this.renderModulatorsHeader() }
                    </div>
                    <div style={styles.row}>
                        { modulatorBlocks }
                        { this.renderEmptyModulatorBlocks() }
                    </div>
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
    },

    internalContainer: {
        backgroundColor: '#101010',
        padding: 5,
        alignItems: 'initial'
    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    },

    columnn: {
        display: 'flex',
        flexDirection: 'column',
    },

    headerBlock: {
        width: 125,
        height: 40,
        backgroundColor: '#3A3A3A',

        borderRadius: 4,

        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        fontSize: 20,
        color: 'white',
    },

    emptyBlock: {
        width: 125,
        height: 60,
        backgroundColor: '#3A3A3A',

        borderRadius: 4,

        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        fontSize: 20,
        color: 'white',
    }
};

export default Radium(Panel);
