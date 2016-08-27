import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import MdBlock                         from 'react-icons/lib/md/block';
import MdCheck                         from 'react-icons/lib/md/check';

class Button extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <div
                style={styles.container}
                onClick={() => this.props.onClick(!this.props.value)}
            >
                <div style={[styles.text, this.props.value ? styles.activeText : null]} >
                    { this.props.value ? this.props.activeText : this.props.inactiveText }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        height: 35,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#212121",
        borderRadius: 8,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
    },

    text: {
        fontWeight: 'bold',
        userSelect: 'none',
        color:      'white',
        fontSize:   16,
    },

    activeText: {
        color: "grey",
    }
};

export default Radium(Button);
