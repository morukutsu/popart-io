import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class RouteToMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        let inputs = this.props.inputList.map((input, i) => {
            let selectedValue = input.pluggedIo ? input.pluggedIo.name : "none";
            let options = this.props.availableInputs.map((availableInput, k) => {
                return (
                    <option key={k}>
                        { availableInput.name }
                    </option>
                );
            });

            return (
                <div
                    style={styles.parameter}
                    key={i}
                >
                    <span style={styles.parameterName}>
                        { input.name }
                    </span>

                    <select
                        value={selectedValue}
                    >
                        <option>none</option>
                        { options }
                    </select>
                </div>
            );
        });

        return (
            <div
                style={styles.container}
                onClick={this.props.onPress}
            >
                <div>Route to...</div>
                <div>
                    { inputs }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        width: 250,
        margin: 10,
        padding: 5,
        backgroundColor: '#74b1be',
        //justifyContent: 'center',
        fontWeight: 'bold',
        //cursor: 'pointer',
        //display: 'flex',
        //flexDirection: 'column',
        fontSize: 20,
    },

    parameter: {
        display: 'flex',
        alignItems: 'row',
    },

    parameterName: {
        width: 150
    }
};

export default Radium(RouteToMenu);
