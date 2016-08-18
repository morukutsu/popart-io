import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import RouteToMenu                     from '../../../gui/routing/RouteToMenu';

class MosaicController extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.title}>
                    Mosaic
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <Knob text="length" min={0} max={1} value={this.props.coreState.IO.length.read() } onChange={(value) => this.props.onParameterChanged("length", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
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

export default Radium(MosaicController);
