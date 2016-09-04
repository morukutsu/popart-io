import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import Arc                             from './Arc';

class Knob extends React.Component {
    constructor() {
        super();

        this.state = {
            isTweaking: false,
        };

        //this.shouldComponentUpdateBase = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isTweaking) {
            return true;
        } else {
            return nextProps.text        !== this.props.text || nextProps.min   !== this.props.min ||
                   nextProps.max         !== this.props.max  || nextProps.value !== this.props.value ||
                   nextProps.isModulated !== this.props.isModulated || nextProps.rawValue !== this.props.rawValue;
        }
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

    render() {
        let valueToDisplay = this.state.isTweaking ? this.props.rawValue : this.props.value;

        // Scale to [0, 100]
        let range = this.props.max - this.props.min;

        // Move to 0..range instead of min..max
        let scaledValue = valueToDisplay - this.props.min;
        scaledValue = scaledValue * (100.0 / (range));

        // Compute angle for the knob rotation
        let angle = scaledValue * (360/100);
        angle = angle.toFixed(0) - 70;
        angle = Math.min(angle, 250);

        let rotateStyle = {
            transform: 'rotate(' + angle + 'deg)',
        };

        let arcStyle = {
            position: 'relative',
            top: -97,
            height: 0,
            display: this.props.isModulated ? 'block' : 'none',
        };

        return (
            <div style={styles.outerContainer}>
                <div
                    style={styles.container}
                    onDragStart={(e) => { e.preventDefault(); return false; }}
                    onMouseDown={this.handleMouseDown.bind(this)}
                >
                    <div style={[styles.circle, rotateStyle]} >
                        <div style={[styles.smallCircle, this.props.isModulated ? styles.modulated : null]}>
                        </div>
                    </div>

                    <div style={styles.numberText}>
                        { valueToDisplay.toFixed(1) }
                    </div>
                </div>

                <div style={styles.text} >
                    { this.props.text }
                </div>

                <div style={arcStyle}>
                    <Arc completed={0.2} stroke="#FD5A35" diameter={80}/>
                </div>
            </div>
        );
    }
};

const styles = {
    outerContainer: {
        margin: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 70,
    },

    container: {
        width: 60,
        height: 60,
        cursor: 'pointer',
        textAlign: 'center',
        zIndex: 1,
    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none',
        color:      'white',
        fontSize:   12,
        marginTop: 10
    },

    circle: {
        width: 60,
        height: 60,
        border: '2px solid #1E1D20',
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666666',
    },

    modulated: {
        backgroundColor: '#FD5A35',
        color:           '#FD5A35',
    },

    smallCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        position: 'relative',
        left: -18,
        boxShadow: '0px 2px 2px #BBBBBB',
    },

    numberText: {
        position: 'relative',
        fontWeight: 'bold',
        top:  -40,
        fontSize: 12,
        color: 'white',
    }
};

export default Radium(Knob);
