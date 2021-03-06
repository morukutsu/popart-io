import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import BaseController                  from '../BaseController';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../../gui/control/RefreshedComponents';

class RGBSplitController extends BaseController {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                { this.renderTitle() }

                <div style={styles.main}>
                    <div style={styles.row}>
                        <RefreshedKnob text="length" {...this.knobsProps["length"]} />
                        <RefreshedKnob text="x"      {...this.knobsProps["x"]    }  />
                        <RefreshedKnob text="y"      {...this.knobsProps["y"]    }  />
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

export default Radium(RGBSplitController);
