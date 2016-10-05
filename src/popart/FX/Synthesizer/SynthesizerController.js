import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import BaseController                  from '../BaseController';

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
                        <Knob text="speed" {...this.knobsProps["speed"]} />
                        <Knob text="x"     {...this.knobsProps["x"]    } />
                        <Knob text="y"     {...this.knobsProps["y"]    } />
                        <Knob text="count" {...this.knobsProps["count"]} />
                        <Knob text="phase" {...this.knobsProps["phase"]} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="R (front)" {...this.knobsProps["colorR"]} />
                        <Knob text="G (front)" {...this.knobsProps["colorG"]} />
                        <Knob text="B (front)" {...this.knobsProps["colorB"]} />

                        <Knob text="R (back)" {...this.knobsProps["colorBackR"]} />
                        <Knob text="G (back)" {...this.knobsProps["colorBackG"]} />
                        <Knob text="B (back)" {...this.knobsProps["colorBackB"]} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="phase mod" {...this.knobsProps["phaseMod"]} />
                        <Knob text="color mod" {...this.knobsProps["colorMod"]} />
                        <Knob text="count mod" {...this.knobsProps["countMod"]} />
                        <Knob text="x mod"     {...this.knobsProps["xMod"]    } />
                        <Knob text="y mod"     {...this.knobsProps["yMod"]    } />
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
    }
};

export default Radium(SynthesizerController);
