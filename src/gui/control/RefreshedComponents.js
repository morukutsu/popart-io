import React, { Component, PropTypes } from 'react';
import IORefreshContainer              from '../IORefreshContainer';
import Knob                            from './Knob';
import Button                          from './Button';
import Color                           from './Color';

const RefreshedKnob = (props) => {
    const selectFunction = (input) => {
        return {
            input:                     input,
            min:                       input.modulateBounds[0],
            max:                       input.modulateBounds[1],
            value:                     input.read(),
            rawValue:                  input.readRaw(),
            isModulated:               input.isPlugged(),
            modulationRange:           input.getModulationRange(),
        };
    };

    return (
        <IORefreshContainer io={props.input} selectFunction={selectFunction}>
            <Knob {...props} />
        </IORefreshContainer>
    );
}

const RefreshedColor = (props) => {
    const selectFunction = (inputs) => {
        return {
            r: inputs[0].read(),
            g: inputs[1].read(),
            b: inputs[2].read(),
        };
    };

    return (
        <IORefreshContainer io={props.inputs} selectFunction={selectFunction}>
            <Color {...props} />
        </IORefreshContainer>
    );
}

const RefreshedButton = (props) => {
    const selectFunction = (input) => {
        return {
            value: input.read(),
        };
    };

    return (
        <IORefreshContainer io={props.input} selectFunction={selectFunction}>
            <Button {...props} />
        </IORefreshContainer>
    );
}

export {
    RefreshedKnob,
    RefreshedColor,
    RefreshedButton
}
