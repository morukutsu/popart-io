import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class Block extends React.Component {
    constructor() {
        super();
    }

    render() {
        const colorStyle = {
            backgroundColor: this.props.color,
            ':hover': {
                backgroundColor: this.props.hoverColor
            }
        };

        const sizeStyle = this.props.header ? styles.headerBlockSize : styles.normalBlockSize;

        return (
            <div
                style={[styles.container, this.props.active ? styles.inactive : null, colorStyle, sizeStyle]}
                onClick={this.props.onPress}
                onContextMenu={this.props.onRightClick}
            >
                <div>{ this.props.name }</div>
            </div>
        );
    }
};

const styles = {
    container: {
        borderRadius: 4,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        fontSize: 20,
        color: 'white',
        flexShrink: 0,

        transition: 'background-color 0.2s',
    },

    inactive: {
        backgroundColor: '#A63700'
    },

    headerBlockSize: {
        width: 125,
        height: 40,
    },

    normalBlockSize: {
        width: 125,
        height: 60,
    }
};

export default Radium(Block);
