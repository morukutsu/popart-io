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
            </div>
        );
    }
};

const styles = {
    container: {
        height: 45,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: "#212121",
    },

    icon: {
         color: 'white',
         cursor: 'pointer',

         transition: 'color 0.1s',

         ':hover': {
             color: '#0093D4',
         }
    }
};

export default Radium(TransportMenu);
