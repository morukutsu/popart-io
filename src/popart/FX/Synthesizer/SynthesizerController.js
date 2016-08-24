import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob from '../../../gui/control/Knob';
import RouteToMenu from '../../../gui/routing/RouteToMenu';

class SynthesizerController extends React.Component {
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
                </div>

                <div style={styles.main}>
                    <div style={styles.row}>
                        <Knob text="speed" min={0}  max={5}       value={this.props.coreState.IO.speed.read() } onChange={(value) => this.props.onParameterChanged("speed", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="x"     min={-1} max={1}       value={this.props.coreState.IO.x.read()     } onChange={(value) => this.props.onParameterChanged("x",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="y"     min={-1} max={1}       value={this.props.coreState.IO.y.read()     } onChange={(value) => this.props.onParameterChanged("y",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="count" min={0}  max={50}      value={this.props.coreState.IO.count.read() } onChange={(value) => this.props.onParameterChanged("count", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="phase" min={0}  max={Math.PI} value={this.props.coreState.IO.phase.read() } onChange={(value) => this.props.onParameterChanged("phase", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="R (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[0] } onChange={(value) => this.handleColorParameterChanged("color", 0, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="G (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[1] } onChange={(value) => this.handleColorParameterChanged("color", 1, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="B (front)" min={0} max={1} value={this.props.coreState.IO.color.read()[2] } onChange={(value) => this.handleColorParameterChanged("color", 2, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />

                        <Knob text="R (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[0] } onChange={(value) => this.handleColorParameterChanged("colorBack", 0, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="G (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[1] } onChange={(value) => this.handleColorParameterChanged("colorBack", 1, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="B (back)" min={0} max={1} value={this.props.coreState.IO.colorBack.read()[2] } onChange={(value) => this.handleColorParameterChanged("colorBack", 2, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    </div>

                    <div style={styles.row}>
                        <Knob text="phase mod" min={0} max={1} value={this.props.coreState.IO.phaseMod.read() } onChange={(value) => this.props.onParameterChanged("phaseMod", value) } mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="color mod" min={0} max={1} value={this.props.coreState.IO.colorMod.read() } onChange={(value) => this.props.onParameterChanged("colorMod", value) } mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="count mod" min={0} max={1} value={this.props.coreState.IO.countMod.read() } onChange={(value) => this.props.onParameterChanged("countMod", value) } mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="x mod"     min={0} max={1} value={this.props.coreState.IO.xMod.read() }     onChange={(value) => this.props.onParameterChanged("xMod", value) }     mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                        <Knob text="y mod"     min={0} max={1} value={this.props.coreState.IO.yMod.read() }     onChange={(value) => this.props.onParameterChanged("yMod", value) }     mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    </div>
                </div>
            </div>
        );
    }
};

/*
<RouteToMenu
    availableInputs={this.props.coreState.availableInputs}
    inputList={this.props.coreState.inputList}
/>
*/

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

export default Radium(SynthesizerController);
