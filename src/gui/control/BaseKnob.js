import React, { Component, PropTypes } from 'react';

class BaseKnob extends React.Component {
    constructor() {
        super();

        this.state = {
            isTweaking: false,
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

    handleMouseDown(event) {
        this.setState({
            isTweaking: true,
            valueWhenTweakingStarted: this.props.rawValue
        });

        this.props.onClick && this.props.onClick();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isTweaking && !nextProps.mouseEvents.mouseUp) {
            let diff = nextProps.mouseDisp.y;

            if (diff < -100) {
                diff = -100;
            }

            if (diff > 100) {
                diff = 100;
            }

            diff = this.scaleAndAddToCurrentValue(diff);
            this.props.onChange(diff);
        }

        if (nextProps.mouseEvents.mouseUp) {
            this.setState({
                isTweaking: false,
            });
        }
    }
};

export default BaseKnob;
