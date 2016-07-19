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

                <div style={styles.main}>
                    <div style={styles.row}>
                        <Knob text="multiplier" min={0} max={300} value={this.props.coreState.IO.multiplier.read() } onChange={(value) => this.props.onParameterChanged("multiplier", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="distance"   min={0} max={1}   value={this.props.coreState.IO.distance.read()   } onChange={(value) => this.props.onParameterChanged("distance", value)}   mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="smooth"     min={0} max={1}   value={this.props.coreState.IO.smooth.read()     } onChange={(value) => this.props.onParameterChanged("smooth", value)}     mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="thresh"     min={0} max={1}   value={this.props.coreState.IO.thresh.read()     } onChange={(value) => this.props.onParameterChanged("thresh", value)}     mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    </div>
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        width: 640,
        flexDirection: 'column',
        display: 'flex',
        margin: 10,
    },

    topBar: {
        height: 5,
        backgroundColor: '#FD5A35',
        marginBottom: 5,
        marginLeft: 1,
        marginRight: 1,
    },

    title: {
        height: 50,
        padding: 10,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FD5A35',
        color: 'white',
    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    },

    main: {
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: '#464646',
    }
};

export default Radium(RuttEtraController);
