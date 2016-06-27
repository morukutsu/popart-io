import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Knob extends React.Component {
    constructor() {
        super();
    }

    scale(event) {
        let value = event.target.value;
        let range         = this.props.max - this.props.min;
        let scalingFactor = range / 100.0;
        value             = this.props.min + (value * scalingFactor);

        this.props.onChange(value);
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    onChange={this.scale.bind(this)}
                />

                <div style={styles.text}>
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
        fontWeight: 'bold'
    }
};

export default Radium(Knob);
