import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Knob extends React.Component {
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
        console.log(currentValue);
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
            valueWhenTweakingStarted: this.props.value
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

    render() {
        // Scale to [0, 100]
        let range = this.props.max - this.props.min;

        // Move to 0..range instead of min..max
        let scaledValue = this.props.value - this.props.min;
        scaledValue = scaledValue * (100.0 / (range));

        // Compute angle for the knob rotation
        let angle = scaledValue * (360/100);
        angle = angle.toFixed(0) - 70;
        angle = Math.min(angle, 250);

        let rotateStyle = {
            transform: 'rotate(' + angle + 'deg)',
        };

        return (
            <div style={styles.outerContainer}>
                <div
                    style={styles.container}
                    onDragStart={(e) => { e.preventDefault(); return false; }}
                    onMouseDown={this.handleMouseDown.bind(this)}
                >
                    <div style={[styles.circle, rotateStyle]} >
                        <div style={styles.smallCircle}>
                        </div>
                    </div>

                    <div style={styles.numberText}>
                        { this.props.value.toFixed(1) }
                    </div>
                </div>

                <div style={styles.text} >
                    { this.props.text }
                </div>
            </div>
        );
    }
};

const styles = {
    outerContainer: {
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    container: {
        width: 60,
        height: 60,
        cursor: 'pointer',
        textAlign: 'center',
    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none'
    },

    circle: {
        width: 60,
        height: 60,
        border: '2px solid black',
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    smallCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'black',
        position: 'relative',
        left: -18,
    },

    numberText: {
        position: 'relative',
        fontWeight: 'bold',
        top:  -40,
        fontSize: 14,
    }
};

export default Radium(Knob);
