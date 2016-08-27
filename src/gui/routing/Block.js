import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class Block extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={[styles.container, this.props.active ? styles.inactive : null]}
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
        width: 150,
        height: 60,
        backgroundColor: '#FD5A35',
        borderRadius: 4,

        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        fontSize: 20,
        color: 'white',

        ':hover': {
            backgroundColor: '#F77177',
        }
    },

    inactive: {
        backgroundColor: '#A63700'
    }
};

export default Radium(Block);
