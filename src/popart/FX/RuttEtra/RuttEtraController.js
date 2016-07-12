import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob from '../../../gui/control/Knob';
import RouteToMenu from '../../../gui/routing/RouteToMenu';

class RuttEtraController extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.title}>
                    Rutt Etra
                </div>

                <div style={styles.row}>
                    <Knob
                        text="length"
                        min={0}
                        max={Math.PI}
                        value={this.props.coreState.IO.length.read() }
                        onChange={(value) => this.props.onParameterChanged("length", value)}
                        onClick={() => this.props.onParameterSelected("length", this.props.coreState.IO.length)}
                        mouseEvents={this.props.mouseEvents}
                        mouseDisp={this.props.mouseDisp}
                    />
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

export default Radium(RuttEtraController);
