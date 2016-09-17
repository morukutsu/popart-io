import React, { Component, PropTypes } from 'react';
import RefreshManager                  from '../../popart/RefreshManager';

class BaseKnob extends React.Component {
    constructor() {
        super();

        this.state = {
            isTweaking:  false,
            mouseUp:     false,
            mouseStartX: 0,
            mouseStartY: 0,
        };
    }

    scaleAndAddToCurrentValue(value) {
        // Compute scaling factor to scale [-100, 100] to [min, max]
        let range         = this.props.max - this.props.min;
        let scalingFactor = range / 100.0;

        // Retrieve the value registered when the user clicked on the Knob
        let currentValue = (-this.props.min + this.state.valueWhenTweakingStarted) * (100.0 / (range));

        // Clamp the new value to [0, 100]
        let nextValue = currentValue + value;
        if (nextValue < 0) {
            nextValue = 0;
        }

        if (nextValue > 100) {
            nextValue = 100;
        }

        // Rescale to [min, max]
        nextValue = this.props.min + (nextValue * scalingFactor);
        return nextValue;
    }

    handleMouseUp(event) {
        if (event.button != 0) {
            return;
        }

        this.setState({
            mouseUp: true
        });
    }

    handleMouseDown(event) {
        RefreshManager.scheduleRefresh();

        this.setState({
            isTweaking: true,
            valueWhenTweakingStarted: this.props.rawValue
        });

        this.props.onClick && this.props.onClick();

        if (event.button != 0) {
            return;
        }

        this.setState({
            mouseUp: false,
            nextMouseDisp: {
                x: 0,
                y: 0,
            },
            mouseStartX: event.screenX,
            mouseStartY: event.screenY,
        });
    }

    handleMouseMove(event) {
        this.setState({
            nextMouseDisp: {
                x: this.state.mouseStartX - event.screenX,
                y: this.state.mouseStartY - event.screenY,
            },
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.isTweaking) {
            let diff = nextState.nextMouseDisp.y;

            if (diff < -100) {
                diff = -100;
            }

            if (diff > 100) {
                diff = 100;
            }

            diff = this.scaleAndAddToCurrentValue(diff);
            this.props.onChange(diff);

            if (nextState.mouseUp) {
                this.setState({
                    isTweaking: false,
                    mouseUp: false,
                });
            }
        }
    }
};

export default BaseKnob;
