import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import Arc                             from './Arc';
import BaseKnob                        from './BaseKnob';
import ModulationKnob                  from './ModulationKnob';

class Knob extends BaseKnob {
    constructor() {
        super();

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp   = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isTweaking || this.refs.modulationKnob.state.isTweaking)
        {
            return true;
        } else {
            return nextProps.text        !== this.props.text || nextProps.min   !== this.props.min ||
                   nextProps.max         !== this.props.max  || nextProps.value !== this.props.value ||
                   nextProps.isModulated !== this.props.isModulated || nextProps.rawValue !== this.props.rawValue ||
                   Radium.getState(nextState, 'container', ':hover') !== Radium.getState(this.state, 'container', ':hover');
        }

        return true;
    }

    handleDragStart(e) {
        e.preventDefault();
        return false;
    }

    // in an array or ordered values like [0, 1, 2, 3, 4]
    // given a value like: 3.5
    // returns 3 (the index of the lower bound of the interval [3, 4])
    searchIndex(array, valueToFind)
    {
        // Special case: if the value < the lowest element or the highest, early exit
        if (valueToFind <= array[0])
            return 0;

        if (valueToFind >= array[array.length - 1])
            return array.length - 1;

        let lowBound  = 0;
        let highBound = array.length - 1;

        let found = false;
        while (!found)
        {
            let middleBound = lowBound + Math.floor((highBound - lowBound) / 2);

            if (valueToFind < array[middleBound])
            {
                // Value is in the first half of the array
                highBound = middleBound;
            }
            else
            {
                // Value is in the other half
                lowBound = middleBound;
            }

            // If the interval size is 1, we found where is our value
            if (highBound - lowBound == 1)
                found = true;
        }

        return lowBound;
    }

    // Given an array, return an array a equal sized steps between 0 and 1
    makeSteps(array)
    {
        let knobSteps = [];
        let stepIncrement = 1.0 / array.length;

        let currentIncrement = 0.0;
        array.forEach(() => {
            knobSteps.push(currentIncrement);
            currentIncrement += stepIncrement;
        });

        return knobSteps;
    }

    render() {
        let valueToDisplay = this.state.isTweaking ? this.props.rawValue : this.props.value;
        if (this.props.steps) {
            valueToDisplay = this.props.rawValue;
        }

        // Scale to [0, 100]
        let range = this.props.max - this.props.min;

        // Move to 0..range instead of min..max
        let scaledValue = valueToDisplay - this.props.min;
        scaledValue = scaledValue * (100.0 / (range));

        // Compute angle for the knob rotation
        let angle = scaledValue * (360/100);
        angle = angle.toFixed(0) - 90;
        angle = Math.min(angle, 270);

        let rotateStyle = {
            transform: 'rotate(' + angle + 'deg)',
        };

        let arcStyle = {
            position: 'absolute',
            top: 10,
            right: 0,
            height: 0,
            padding: 0,
            margin: 0,
            display: this.props.isModulated ? 'block' : 'none',
            zIndex: 0
        };

        // Modulator arc parameters
        let modulationRange = this.props.modulationRange;

        // Scale the raw value to [0, 1] then offset it by half the modulation range
        // => center the knob on the middle of the arc
        let scaledRawValue = (this.props.rawValue - this.props.min) / range - modulationRange / 2.0;
        let arcOffset = scaledRawValue;

        // When the raw value is close to the beggining or the end of the range
        // Modulation range or offset must be adjusted so it does not overflow
        if (arcOffset < 0.0) {
            modulationRange += arcOffset;
        }

        if (arcOffset > 1.0 - modulationRange) {
            modulationRange -= arcOffset - (1.0 - modulationRange);
        }

        arcOffset = Math.max(0.0, arcOffset);

        // Clamp value to display
        if (this.props.steps) {
            let knobSteps = this.makeSteps(this.props.steps[0]);
            let valueIndex = this.searchIndex(knobSteps, this.props.rawValue);

            valueToDisplay = this.props.steps[1][valueIndex];
        } else {
            valueToDisplay = valueToDisplay.toFixed(1);
        }

        // Hover logic
        let hoverStyle = null;
        if (Radium.getState(this.state, 'container', ':hover') || (this.state.isTweaking) ) {
            hoverStyle = styles.hoverStyle;
        }

        return (
            <div style={styles.outerContainer}>
                <ModulationKnob
                    ref='modulationKnob'
                    min={0}
                    max={1}
                    rawValue={this.props.modulationRange}
                    onChange={this.props.onModulationRangeChanged}
                    visible={this.props.isModulated}
                />

                <div
                    key="container"
                    style={styles.container}
                    onDragStart={this.handleDragStart}
                    onMouseDown={this.handleMouseDown}
                >
                    <div style={[styles.circle, hoverStyle]}>
                        <div style={arcStyle}>
                            <Arc completed={modulationRange} offset={arcOffset} stroke="#FFFFFF" diameter={60} strokeWidth={10} />
                        </div>

                        <div style={rotateStyle}>
                            <div style={[styles.smallCircle, this.props.isModulated ? styles.modulated : null]}/>
                        </div>
                    </div>

                    <div style={styles.numberText}>
                        { valueToDisplay }
                    </div>
                </div>

                <div style={styles.text} >
                    { this.props.text }
                </div>

                {
                    this.state.isTweaking ?
                    <div
                        style={styles.mouseReactiveArea}
                        onMouseUp={this.handleMouseUp}
                        onMouseMove={this.handleMouseMove}
                    />
                    :
                    null
                }

            </div>
        );
    }
};

const styles = {
    outerContainer: {
        margin: 8,
        display: 'flex',
        flexDirection: 'column',
        width: 60,
        position: 'relative',
    },

    container: {
        width: 60,
        height: 60,
        cursor: 'pointer',
        textAlign: 'center',
        //zIndex: 1,
        alignItems: 'center',

        ':hover': {},
    },

    hoverStyle: {
        backgroundColor: '#F77177'
    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none',
        color:      'white',
        fontSize:   12,
        marginTop:  0,
        width: 60,
        textAlign: 'center'
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

        transition: 'background-color 0.2s',
    },

    modulated: {
        backgroundColor: '#FD5A35',
        color:           '#FD5A35',
    },

    smallCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        position: 'relative',
        left: -20,
        //zIndex: 0
    },

    numberText: {
        position: 'relative',
        fontWeight: 'bold',
        top:  -40,
        fontSize: 12,
        color: 'white',
    },

    mouseReactiveArea: {
        width: 2000,
        height: 2000,
        /*backgroundColor: '#FD5A35',
        opacity: 0.3,*/
        position: 'absolute',
        top:  -1000 + 60 / 2,
        left: -1000 + 60 / 2,
        zIndex: 1,
    }
};

export default Radium(Knob);
