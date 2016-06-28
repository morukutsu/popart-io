import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Knob extends React.Component {
    constructor() {
        super();

        this.state = {
            isTweaking: false,
            currentValue: 0
        };
    }

    scale(value) {
        let range         = this.props.max - this.props.min;
        let scalingFactor = range / 100.0;
        value             = this.props.min + (value * scalingFactor);

        this.props.onChange(value);
    }

    handleMouseDown(event) {
        this.setState({
            isTweaking: true,
            valueWhenTweakingStarted: this.state.currentValue
        });
    }

    handleMouseUp(event) {

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isTweaking && !nextProps.globalEvents.mouseUp) {
            let diff = nextProps.mouseDispY;
            if (diff < -100) {
                diff = -100;
            }

            if (diff > 100) {
                diff = 100;
            }

            // Rescale to 0-100
            diff = (100 + diff) / 2.0;

            this.scale(diff);
        }
    }

    render() {
        return (
            <div
                style={styles.container}
                onDragStart={(e) => { e.preventDefault(); return false; }}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    onChange={(event) => { this.scale(event.target.value) }}
                />

                <div style={styles.circle} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)}>
                    <div style={styles.smallCircle}>
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
    container: {
        width: 100,
        height: 100,
        margin: 5,
    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none'
    },

    circle: {
        width: 60,
        height: 60,
        border: '1px solid black',
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'rotate(-90deg)',
        cursor: 'pointer'
    },

    smallCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'black',
        position: 'relative',
        left: -20,
    },

    numberText: {

    }
};

export default Radium(Knob);
