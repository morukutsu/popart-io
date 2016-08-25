import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class Menu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                <div key={0} style={styles.item}>File</div>
                <div key={1} style={styles.item}>Edit</div>
                <div key={2} style={styles.item}>Render</div>
            </div>
        );
    }
};

const styles = {
    container: {
        backgroundColor: '#090909',
        WebkitAppRegion: "drag",
        display: 'flex',
        flexDirection: 'row',
        padding: 4
    },

    item: {
        color: "lightGrey",
        marginRight: 20,
        cursor: 'pointer',

        ':hover': {
            backgroundColor: '#F77177',
        }
    }
};

export default Radium(Menu);
