import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../gui/control/Knob';
import Button                          from '../../gui/control/Button';
import BaseController                  from '../FX/BaseController';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../gui/control/RefreshedComponents';

class SequencerController extends BaseController {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.title}>
                    <div style={{flex: 1}}>Sequencer</div>

                    <div style={styles.alignedRight}>
                        { this.renderTitleButtons() }
                    </div>
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <RefreshedKnob text="frequency" {...this.knobsProps["frequency"]} />
                    </div>
                    <div style={styles.row}>
                        <RefreshedKnob text="0" {...this.knobsProps["step0"]} />
                        <RefreshedKnob text="1" {...this.knobsProps["step1"]} />
                        <RefreshedKnob text="2" {...this.knobsProps["step2"]} />
                        <RefreshedKnob text="3" {...this.knobsProps["step3"]} />
                    </div>
                    <div style={styles.row}>
                        <RefreshedButton input={this.props.coreState.IO.bpmLock} activeText="BPM Lock On" inactiveText="BPM Lock Off" onClick={(value) => this.props.onParameterChanged("bpmLock", value)} />
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
        flex: 1,
        margin: 10,
    },

    topBar: {
        height: 5,
        backgroundColor: '#FD5A35',
        marginBottom: 5,
        marginLeft: 1,
        marginRight: 1,
    },

    alignedRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1
    },

    title: {
        height: 50,
        padding: 10,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FD5A35',
        color: 'white',
        flex: 1,
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

export default Radium(SequencerController);
