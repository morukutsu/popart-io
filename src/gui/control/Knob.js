import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import Arc                             from './Arc';
import BaseKnob                        from './BaseKnob';
import ModulationKnob                  from './ModulationKnob';

class Knob extends BaseKnob {
    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isTweaking || this.refs.modulationKnob.state.isTweaking) {
            return true;
        } else {
            return nextProps.text        !== this.props.text || nextProps.min   !== this.props.min ||
                   nextProps.max         !== this.props.max  || nextProps.value !== this.props.value ||
                   nextProps.isModulated !== this.props.isModulated || nextProps.rawValue !== this.props.rawValue;
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

        return (
            <div style={styles.outerContainer}>
                <ModulationKnob
                    ref='modulationKnob'
                    min={0}
                    max={1}
                    rawValue={this.props.modulationRange}
                    onChange={this.props.onModulationRangeChanged}
                    mouseEvents={this.props.mouseEvents}
                    mouseDisp={this.props.mouseDisp}
                    visible={this.props.isModulated}
                />

                <div
                    style={styles.container}
                    onDragStart={(e) => { e.preventDefault(); return false; }}
                    onMouseDown={this.handleMouseDown.bind(this)}
                >
                    <div style={[styles.circle]}>
                        <div style={arcStyle}>
                            <Arc completed={modulationRange} offset={arcOffset} stroke="#FFFFFF" diameter={60} strokeWidth={10} />
                        </div>

                        <div style={rotateStyle}>
                            <div style={[styles.smallCircle, this.props.isModulated ? styles.modulated : null]}/>
                        </div>
                    </div>

                    <div style={styles.numberText}>
                        { valueToDisplay.toFixed(1) }
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
        margin: 12,
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

    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none',
        color:      'white',
        fontSize:   12,
        marginTop:  0
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
    }
};

export default Radium(Knob);
