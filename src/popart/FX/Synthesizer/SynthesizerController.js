import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import RouteToMenu                     from '../../../gui/routing/RouteToMenu';
import BaseController                  from '../BaseController';

class SynthesizerController extends BaseController {
    constructor() {
        super();
    }

    handleColorParameterChanged(parameterName, colorChannel, colorValue) {
        let value = this.props.coreState.IO[parameterName].read();
        value[colorChannel] = colorValue;
        this.props.onParameterChanged(parameterName, value);
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
                        <Knob text="speed" min={0}  max={5}       {...this.knobsProps["speed"]} />
                        <Knob text="x"     min={-1} max={1}       {...this.knobsProps["x"]} />
                        <Knob text="y"     min={-1} max={1}       {...this.knobsProps["y"]} />
                        <Knob text="count" min={0}  max={50}      {...this.knobsProps["count"]} />
                        <Knob text="phase" min={0}  max={Math.PI} {...this.knobsProps["phase"]} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="R (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[0] } rawValue={this.props.coreState.IO.color.read()[0] } onChange={(value) => this.handleColorParameterChanged("color", 0, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="G (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[1] } rawValue={this.props.coreState.IO.color.read()[1] } onChange={(value) => this.handleColorParameterChanged("color", 1, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="B (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[2] } rawValue={this.props.coreState.IO.color.read()[2] } onChange={(value) => this.handleColorParameterChanged("color", 2, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />

                        <Knob text="R (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[0] } rawValue={this.props.coreState.IO.colorBack.read()[0] } onChange={(value) => this.handleColorParameterChanged("colorBack", 0, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="G (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[1] } rawValue={this.props.coreState.IO.colorBack.read()[1] } onChange={(value) => this.handleColorParameterChanged("colorBack", 1, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="B (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[2] } rawValue={this.props.coreState.IO.colorBack.read()[2] } onChange={(value) => this.handleColorParameterChanged("colorBack", 2, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="phase mod" min={0} max={1} {...this.knobsProps["phaseMod"]} />
                        <Knob text="color mod" min={0} max={1} {...this.knobsProps["colorMod"]} />
                        <Knob text="count mod" min={0} max={1} {...this.knobsProps["countMod"]} />
                        <Knob text="x mod"     min={0} max={1} {...this.knobsProps["xMod"]} />
                        <Knob text="y mod"     min={0} max={1} {...this.knobsProps["yMod"]} />
                    </div>
                </div>

                { this.renderParameterDetails() }
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
