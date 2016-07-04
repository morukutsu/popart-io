import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class RouteToMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        let tweakableParameters = this.props.tweakableParameters.map((elem, i) => (
            <div
                style={styles.parameter}
                key={i}
                onClick={() => this.props.onParameterSelected(elem)}
            >
                { elem.name }
            </div>
        ));

        return (
            <div
                style={styles.container}
                onClick={this.props.onPress}
            >
                <div>Route to...</div>
                <div>
                    { tweakableParameters }
                </div>
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
        //justifyContent: 'center',
        fontWeight: 'bold',
        //cursor: 'pointer',
        //display: 'flex',
        //flexDirection: 'column',
        fontSize: 20,
    },

    parameter: {
        cursor: 'pointer',
    }
};

export default Radium(RouteToMenu);
