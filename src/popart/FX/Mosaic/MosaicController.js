import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import BaseController                  from '../BaseController';

class MosaicController extends BaseController {
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

                    <div style={styles.alignedRight}>
                        { this.renderTitleButtons() }
                    </div>
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <Knob text="length" {...this.knobsProps["length"]}  />
                    </div>
                </div>

                { this.renderDropMenu() }
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

    alignedRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1
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
