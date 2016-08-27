import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdChevronRight                  from 'react-icons/lib/md/chevron-right';
import MdAddCircleOutline              from 'react-icons/lib/md/add-circle-outline';

class Panel extends React.Component {
    constructor() {
        super();
    }

    getStageCount() {
        return this.props.effects.length + 1;
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

        return stages.map((elem, index) => (
            <div
                key={index}
                style={styles.headerBlock}
            >
                { elem }
                <MdChevronRight/>
            </div>
        ));
    }

    renderEmptyBlocks() {
        let numberOfEmptyBlocks = this.getStageCount() - this.props.effects.length;
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

        return emptyBlocks;
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
        return (
            <div
                style={styles.container}
            >
                <div style={styles.internalContainer}>
                    <div style={styles.row}>
                        { this.renderHeader() }
                    </div>
                    <div style={styles.row}>
                        { this.props.effects }
                        { this.renderEmptyBlocks() }
                    </div>

                    <div style={styles.row}>
                        { this.renderModulatorsHeader() }
                    </div>
                    <div style={styles.row}>
                        { this.props.modulators }
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
        width: 150,
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
        width: 150,
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
