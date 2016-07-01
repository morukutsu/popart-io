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
                    <Knob text="speed" min={0} max={5}  value={this.props.coreState.IO.speed.read() } onChange={(value) => this.props.onParameterChanged("speed", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="x"     min={0} max={1}  value={this.props.coreState.IO.x.read()     } onChange={(value) => this.props.onParameterChanged("x",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="y"     min={0} max={1}  value={this.props.coreState.IO.y.read()     } onChange={(value) => this.props.onParameterChanged("y",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="count" min={0} max={50} value={this.props.coreState.IO.count.read() } onChange={(value) => this.props.onParameterChanged("count", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                </div>
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
        fontWeight: 'bold',
        backgroundColor: '#9C89B8',
    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    }
};

export default Radium(SynthesizerController);
