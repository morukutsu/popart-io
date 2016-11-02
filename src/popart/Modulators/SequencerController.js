import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../gui/control/Knob';
import Button                          from '../../gui/control/Button';
import BaseController                  from '../FX/BaseController';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../gui/control/RefreshedComponents';
import IORefreshContainer              from '../../gui/IORefreshContainer';

const StepVisualizer = (props) => {
    let stepStyle = {
        width: 10, height: 10, borderRadius: 3, margin: 4
    };

    if (props.currentStep == props.step) {
        stepStyle.backgroundColor = "yellow";
    } else {
        stepStyle.backgroundColor = "black";
    }

    return <div style={stepStyle}/>;
};

const RefreshedStepVisualizer = (props) => {
    const selectFunction = (input) => {
        return {
            currentStep: input.read(),
        };
    };

    return (
        <IORefreshContainer io={props.input} selectFunction={selectFunction}>
            <StepVisualizer {...props} />
        </IORefreshContainer>
    );
};

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
                        <RefreshedKnob text="frequency"  {...this.knobsProps["frequency"]}  />
                        <RefreshedKnob text="multiplier" {...this.knobsProps["multiplier"]} steps={[
                            [0.125 / 2.0, 0.125, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0], // values
                            ['1/16', '1/8', '1/4', '1/2', '1', '2', '4', '8', '16']    // labels
                        ]}/>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.column}>
                            <RefreshedKnob  text="0" {...this.knobsProps["step0"]} />
                            <RefreshedStepVisualizer step={0} input={this.props.coreState.IO.currentStep} />
                        </div>
                        <div style={styles.column}>
                            <RefreshedKnob text="1" {...this.knobsProps["step1"]} />
                            <RefreshedStepVisualizer step={1} input={this.props.coreState.IO.currentStep} />
                        </div>
                        <div style={styles.column}>
                            <RefreshedKnob text="2" {...this.knobsProps["step2"]} />
                            <RefreshedStepVisualizer step={2} input={this.props.coreState.IO.currentStep} />
                        </div>
                        <div style={styles.column}>
                            <RefreshedKnob text="3" {...this.knobsProps["step3"]} />
                            <RefreshedStepVisualizer step={3} input={this.props.coreState.IO.currentStep} />
                        </div>
                    </div>
                    <div style={styles.row}>
                        <RefreshedButton input={this.props.coreState.IO.bpmLock} activeText="BPM Lock On" inactiveText="BPM Lock Off" swapActiveHighlight={true} onClick={(value) => this.props.onParameterChanged("bpmLock", value)} />
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

    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    main: {
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: '#464646',
    }
};

export default Radium(SequencerController);
