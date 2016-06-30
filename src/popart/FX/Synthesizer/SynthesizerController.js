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

                <div style={styles.row}>
                    <Knob text="speed" min={0} max={5}  value={this.props.coreState.IO.speed.read() } onChange={(value) => this.props.onParameterChanged("speed", value)} globalEvents={this.props.globalEvents} mouseDispY={this.props.mouseDispY} />
                    <Knob text="x"     min={0} max={1}  value={this.props.coreState.IO.x.read()     } onChange={(value) => this.props.onParameterChanged("x",     value)} globalEvents={this.props.globalEvents} mouseDispY={this.props.mouseDispY} />
                    <Knob text="y"     min={0} max={1}  value={this.props.coreState.IO.y.read()     } onChange={(value) => this.props.onParameterChanged("y",     value)} globalEvents={this.props.globalEvents} mouseDispY={this.props.mouseDispY} />
                    <Knob text="count" min={0} max={50} value={this.props.coreState.IO.count.read() } onChange={(value) => this.props.onParameterChanged("count", value)} globalEvents={this.props.globalEvents} mouseDispY={this.props.mouseDispY} />
                </div>
            </div>
        );
    }
};

/*
<Knob text="x"     min={0} max={1}  value={0} onChange={(value) => this.props.onParameterChanged("x",     value)} />
<Knob text="y"     min={0} max={1}  value={0} onChange={(value) => this.props.onParameterChanged("y",     value)} />
<Knob text="count" min={0} max={50} value={0} onChange={(value) => this.props.onParameterChanged("count", value)} />
*/

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
    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    }
};

export default Radium(SynthesizerController);
