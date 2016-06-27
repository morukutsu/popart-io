import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';

class Panel extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                { this.props.children }
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
};

export default Radium(Panel);
