import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Block extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
                onClick={this.props.onPress}
            >
                <div>{this.props.name}</div>
            </div>
        );
    }
};

const styles = {
    container: {
        width: 150,
        height: 80,
        margin: 10,
        backgroundColor: '#74b1be',
        //border: '1px solid rgb(50, 200, 250)',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        fontSize: 20,

        ':hover': {
            backgroundColor: 'rgb(240, 240, 240)',
        }
    },
};

export default Radium(Block);
