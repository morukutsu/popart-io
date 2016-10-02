import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import MdPlayArrow                     from 'react-icons/lib/md/play-arrow';
import MdStop                          from 'react-icons/lib/md/stop';
import MdPause                         from 'react-icons/lib/md/pause';
import Actions                         from '../../actions/Actions';

class TransportMenu extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                {
                    !this.props.isPaused ?
                    <MdPause     size="40" style={styles.icon} onClick={Actions.togglePlay} />
                    :
                    <MdPlayArrow size="40" style={styles.icon} onClick={Actions.togglePlay} />
                }

                <MdStop size="40" style={styles.icon}/>

                <input type="number" style={styles.input} value={this.props.bpm} onChange={(e) => Actions.changeBpm(e.target.value)}/>
                <span style={styles.bpmText}>bpm</span>
            </div>
        );
    }
};

const styles = {
    container: {
        height: 45,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#101010',
        padding: 5,
    },

    icon: {
         color: 'white',
         cursor: 'pointer',

         transition: 'color 0.1s',

         ':hover': {
             color: '#0093D4',
         }
    },

    input: {
        textAlign: 'center',
        marginTop: 4,
        width: 60,
        height: 30,
        border:          "none",
        borderRadius: 8,
        backgroundColor: "black",
        fontSize: 24,
        fontWeight: "bold",
        color: "#FD5A35"
    },

    bpmText: {
        color: 'white',
        marginLeft: 4
    }
};

export default Radium(TransportMenu);
