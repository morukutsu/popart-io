import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob from '../../../gui/control/Knob';

class SynthesizerController extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.title}>
                    Synthesizer
                </div>

                <Knob text="speed" min={0} max={5} onChange={(value) => this.props.onParameterChanged("speed", value)} />
                <Knob text="x"     min={0} max={1} onChange={(value) => this.props.onParameterChanged("x",     value)} />
                <Knob text="y"     min={0} max={1} onChange={(value) => this.props.onParameterChanged("y",     value)} />
                <Knob text="count" min={0} max={50} onChange={(value) => this.props.onParameterChanged("count", value)} />
            </div>
        );
    }
};

const styles = {
    container: {
        flex: 1,
        width: 640,
        flexDirection: 'column',
        display: 'flex',
        margin: 10,
        backgroundColor: '#F0E6EF'
    },

    title: {
        flex: 1,
        height: 50,
        fontSize: 20,
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#9C89B8',
        ':hover': {
            backgroundColor: 'rgb(240, 240, 240)',
        }
    }
};

export default Radium(SynthesizerController);
