import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Knob extends React.Component {
    constructor() {
        super();
        
        this.state = {
            isTweaking: false
        };
    }

    scale(event) {
        let value = event.target.value;
        let range         = this.props.max - this.props.min;
        let scalingFactor = range / 100.0;
        value             = this.props.min + (value * scalingFactor);

        this.props.onChange(value);
    }
    
    mouseDown(event) {
        this.setState({
            isTweaking: true
        });
    }
    
    render() {
        if (this.props.globalEvents && this.props.globalEvents.mouseDispY) {
            console.log(this.props.globalEvents.mouseDispY);
        }
        
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
                
                <div style={styles.circle} onMouseDown={this.mouseDown.bind(this)}>
                    <div style={styles.smallCircle}>
                    </div>
                </div>
                
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
