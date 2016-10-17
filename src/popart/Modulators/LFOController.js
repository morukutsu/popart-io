import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../gui/control/Knob';
import Button                          from '../../gui/control/Button';
import BaseController                  from '../FX/BaseController';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../gui/control/RefreshedComponents';
import IORefreshContainer              from '../../gui/IORefreshContainer';

const LFOVisualizer = (props) => {
    let stepStyle = {
        width: 10, height: 10, borderRadius: 3, margin: 4
    };

    let v     = Math.abs(props.value);
    let color = (255.0 * v).toFixed(0);

    stepStyle.backgroundColor = "rgba(" + color + ", " + color + ", " + 0 + ", 1.0)";

    return <div style={stepStyle}/>;
};

const RefreshedLFOVisualizer = (props) => {
    const selectFunction = (input) => {
        return {
            value: input.read(),
        };
    };

    return (
        <IORefreshContainer io={props.input} selectFunction={selectFunction}>
            <LFOVisualizer {...props} />
        </IORefreshContainer>
    );
};

class LFOController extends BaseController {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div style={styles.title}>
                    <div style={{flex: 1}}>LFO</div>

                    <div style={styles.alignedRight}>
                        { this.renderTitleButtons() }
                    </div>
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <div style={styles.column}>
                            <RefreshedKnob text="waveform" {...this.knobsProps["waveform"]} steps={[
                                [0, 0.25, 0.50, 0.75],       // values
                                ['sqr', 'saw', 'tri', 'sin'] // labels
                            ]}/>
                            <RefreshedLFOVisualizer input={this.props.coreState.IO.output} />
                        </div>
                        <RefreshedKnob text="frequency" {...this.knobsProps["frequency"]} />
                        <RefreshedKnob text="multiplier" {...this.knobsProps["multiplier"]} steps={[
                            [0.125 / 2.0, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0], // values
                            ['1/16', '1/8', '1/4', '1/2', '1', '2', '4', '8', '16']    // labels
                        ]}/>
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
    },

    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Radium(LFOController);
