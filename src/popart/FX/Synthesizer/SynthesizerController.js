import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import Color                           from '../../../gui/control/Color';
import BaseController                  from '../BaseController';
import Button                          from '../../../gui/control/Button';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../../gui/control/RefreshedComponents';

class SynthesizerController extends BaseController {
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

                    <div style={styles.alignedRight}>
                        { this.renderTitleButtons() }
                    </div>
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <RefreshedKnob text="speed" {...this.knobsProps["speed"]} />
                        <RefreshedKnob text="x"     {...this.knobsProps["x"]    } />
                        <RefreshedKnob text="y"     {...this.knobsProps["y"]    } />
                        <RefreshedKnob text="count" {...this.knobsProps["count"]} />
                        <RefreshedKnob text="phase" {...this.knobsProps["phase"]} />
                        <RefreshedKnob text="waveform" {...this.knobsProps["waveform"]} />
                    </div>

                    <div style={styles.row}>
                        <RefreshedKnob text="R (front)" {...this.knobsProps["colorR"]} />
                        <RefreshedKnob text="G (front)" {...this.knobsProps["colorG"]} />
                        <RefreshedKnob text="B (front)" {...this.knobsProps["colorB"]} />
                        <RefreshedColor inputs={[this.props.coreState.IO.colorR, this.props.coreState.IO.colorG, this.props.coreState.IO.colorB]} />

                        <RefreshedKnob text="R (back)" {...this.knobsProps["colorBackR"]} />
                        <RefreshedKnob text="G (back)" {...this.knobsProps["colorBackG"]} />
                        <RefreshedKnob text="B (back)" {...this.knobsProps["colorBackB"]} />
                        <RefreshedColor inputs={[this.props.coreState.IO.colorBackR, this.props.coreState.IO.colorBackG, this.props.coreState.IO.colorBackB]} />
                    </div>

                    <div style={styles.row}>
                        <RefreshedKnob text="phase mod" {...this.knobsProps["phaseMod"]} />
                        <RefreshedKnob text="color mod" {...this.knobsProps["colorMod"]} />
                        <div style={[styles.alignButton, styles.width50]}>
                            <RefreshedButton input={this.props.coreState.IO.blending} activeText="Add" inactiveText="Mix" onClick={(value) => this.props.onParameterChanged("blending", !value)} />
                        </div>
                        <RefreshedKnob text="count mod" {...this.knobsProps["countMod"]} />
                        <RefreshedKnob text="x mod"     {...this.knobsProps["xMod"]    } />
                        <RefreshedKnob text="y mod"     {...this.knobsProps["yMod"]    } />
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

    alignButton: {
        marginTop: 30,
    },

    width50: {
        width: 50
    }
};

export default Radium(SynthesizerController);
