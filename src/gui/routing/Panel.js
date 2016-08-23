import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdChevronRight                  from 'react-icons/lib/md/chevron-right';
import MdAddCircleOutline              from 'react-icons/lib/md/add-circle-outline';

var STAGE_COUNT = 4;

class Panel extends React.Component {
    constructor() {
        super();
    }

    getStageCount() {
        if (this.props.children.length < STAGE_COUNT) {
            return STAGE_COUNT;
        } else {
            return this.props.children.length + 1;
        }
    }

    renderHeader() {
        let stages = [];
        for (var i = 0; i < this.getStageCount(); i++) {
            stages.push(i);
        }

        return stages.map((elem, index) => (
            <div
                key={index}
                style={styles.headerBlock}
            >
                Stage { index }
                <MdChevronRight/>
            </div>
        ));
    }

    renderEmptyBlocks() {
        let numberOfEmptyBlocks = this.getStageCount() - this.props.children.length;
        let emptyBlocks = [];

        for (var i = 0; i < numberOfEmptyBlocks; i++) {
            emptyBlocks.push(
                <div
                    key={i}
                    style={styles.headerBlock}
                >
                    <MdAddCircleOutline/>
                    Add
                </div>
            );
        }

        return emptyBlocks;
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.row}>
                    { this.renderHeader() }
                </div>
                <div style={styles.row}>
                    { this.props.children }
                    { this.renderEmptyBlocks() }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {

    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    },

    columnn: {
        display: 'flex',
        flexDirection: 'column'
    },

    headerBlock: {
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
