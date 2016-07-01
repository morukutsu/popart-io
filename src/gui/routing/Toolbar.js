import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Toolbar extends React.Component {
    constructor() {
        super();
    }

    render() {
        let effects = this.props.effectList.map((elem, i) => {
            return (
                <div
                    key={i}
                    style={styles.effect}
                    onClick={() => this.props.onClick(i)}
                >
                    {elem}
                </div>
            );
        });

        return (
            <div
                style={styles.container}
            >
                { effects }
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row'
    },

    effect: {
        backgroundColor: '#74b1be',
        margin: 10,
        padding: 5,
        cursor: 'pointer',
        fontWeight: 'bold',

        ':hover': {
            backgroundColor: 'rgb(240, 240, 240)',
        }
    }
};

export default Radium(Toolbar);
