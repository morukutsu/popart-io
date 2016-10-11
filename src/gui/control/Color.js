import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class Color extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        const colorFloatToInt = (c) => {
            return (c * 255.0).toFixed(0);
        };

        const colors = [colorFloatToInt(this.props.r), colorFloatToInt(this.props.g), colorFloatToInt(this.props.b)];

        const bgColorStyle = {
            backgroundColor: "rgba(" + colors[0] + ", " + colors[1] + ", " + colors[2] + ", 255)"
        };

        return (
            <div style={[styles.container, bgColorStyle]} />
        );
    }
};

const styles = {
    container: {
        height: 35,
        width: 35,
        //cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        //justifyContent: 'center',
        //backgroundColor: "#212121",
        borderRadius: 8,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        marginLeft: 4,
        marginRight: 4,
        marginTop: 30,
        border: '2px solid #1E1D20',
    },
};

export default Radium(Color);
