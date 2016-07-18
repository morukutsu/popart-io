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
                    onClick={() => this.props.onClick(elem)}
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
        height: 40,
        width: 150,
        borderRadius: 8,
        margin: 5,
        padding: 5,
        boxShadow: '0px 3px 0px #BBBBBB',

        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: '#FD5A35',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: 'white',

        ':hover': {
            backgroundColor: '#F77177',
        }
    }
};

export default Radium(Toolbar);
