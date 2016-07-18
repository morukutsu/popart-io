import React, { Component, PropTypes } from 'react';
import { Surface } from 'gl-react-dom';

class EffectView extends React.Component {
    constructor() {
        super();

        this.state = {

        };
    }

    componentWillMount() {
    }

    render() {
        return (
            <Surface width={640} height={360} style={styles.surface}>
                { this.props.children }
            </Surface>
        );
    }
}

const styles = {
    surface: {
        margin: 10,
    }
};

export default EffectView;
