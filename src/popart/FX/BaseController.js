import React, { Component, PropTypes } from 'react';
import Button                          from '../../gui/control/Button';
import ParameterDetails                from '../../gui/routing/ParameterDetails';

export default class BaseController extends React.Component {
    constructor() {
        super();

        this.knobsProps = {};
    }

    componentWillMount() {
        this.updateKnobsProps(this.props);
    }

    componentWillUpdate(nextProps, nextState) {
        this.updateKnobsProps(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    updateKnobsProps(props) {
        // We build the props programmatically to simplify the Knobs rendering code
        props.coreState.inputList.forEach((input) => {
            this.knobsProps[input.name] = {
                input:                     input,
                min:                       input.modulateBounds[0],
                max:                       input.modulateBounds[1],
                value:                     input.read(),
                rawValue:                  input.readRaw(),
                isModulated:               input.isPlugged(),
                modulationRange:           input.getModulationRange(),
                onChange:                  (value) => props.onParameterChanged(input.name, value),
                onClick:                   () => props.onParameterSelected(input),
                onModulationRangeChanged:  (value) => props.onModulationRangeChanged(input.name, value),
            };
        });
    }

    renderTitleButtons() {
        return (
            <Button activeText="On" inactiveText="Off" value={!this.props.coreState.IO.mute.read() } onClick={(value) => this.props.onParameterChanged("mute", !value)} />
        );
    }

    renderParameterDetails() {
        return (
            <ParameterDetails
                selectedParameter={this.props.selectedParameter}
                modulators={this.props.modulators}
            />
        );
    }
}
