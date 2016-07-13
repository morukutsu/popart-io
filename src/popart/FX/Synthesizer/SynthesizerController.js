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

                <div style={styles.row}>
                    <Knob text="speed" min={0} max={5}  value={this.props.coreState.IO.speed.read()      } onChange={(value) => this.props.onParameterChanged("speed", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="x"     min={0} max={1}  value={this.props.coreState.IO.x.read()          } onChange={(value) => this.props.onParameterChanged("x",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="y"     min={0} max={1}  value={this.props.coreState.IO.y.read()          } onChange={(value) => this.props.onParameterChanged("y",     value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="count" min={0} max={50} value={this.props.coreState.IO.count.read()      } onChange={(value) => this.props.onParameterChanged("count", value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />

                    <Knob
                        text="phase"
                        min={0}
                        max={Math.PI}
                        value={this.props.coreState.IO.phase.read() }
                        onChange={(value) => this.props.onParameterChanged("phase", value)}
                        onClick={() => this.props.onParameterSelected("phase", this.props.coreState.IO.phase)}
                        mouseEvents={this.props.mouseEvents}
                        mouseDisp={this.props.mouseDisp}
                    />
                </div>

                <div style={styles.row}>
                    <Knob text="R" min={0} max={1} value={this.props.coreState.IO.color.read()[0] } onChange={(value) => this.handleColorParameterChanged("color", 0, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="G" min={0} max={1} value={this.props.coreState.IO.color.read()[1] } onChange={(value) => this.handleColorParameterChanged("color", 1, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                    <Knob text="B" min={0} max={1} value={this.props.coreState.IO.color.read()[2] } onChange={(value) => this.handleColorParameterChanged("color", 2, value)} mouseEvents={this.props.mouseEvents} mouseDisp={this.props.mouseDisp} />
                </div>

                <RouteToMenu
                    availableInputs={this.props.coreState.availableInputs}
                    inputList={this.props.coreState.inputList}
                />
            </div>
        );
    }
};

const styles = {
    container: {
        flex: 1,
        width: 640,
        flexDirection: 'column',
        display: 'flex',
        margin: 10,
        backgroundColor: '#F0E6EF'
    },

    title: {
        flex: 1,
        height: 50,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#9C89B8',
    },

    row: {
        display: 'flex',
        flexDirection: 'row'
    }
};

export default Radium(SynthesizerController);
