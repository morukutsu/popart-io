import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import MdPlayArrow                     from 'react-icons/lib/md/play-arrow';
import MdStop                          from 'react-icons/lib/md/stop';
import MdPause                         from 'react-icons/lib/md/pause';
import Actions                         from '../../actions/Actions';
import Button                          from '../control/Button';

class TransportMenu extends React.Component {
    constructor() {
        super();

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

        this.tapBpm = this.tapBpm.bind(this);

        this.state = {
            slidingWindow: []
        };
    }

    tapBpm() {
        // Retrieve time difference between the two last taps
        const timestamp = Date.now();
        let   diff      = timestamp - this.state.timestamp;
        if (!diff) {
            diff = 0;
        }

        // Use a sliding window to compute the average BPM
        let slidingWindow = this.state.slidingWindow.slice(0);

        // Clear reset the bpm computation if the difference is too high (10 seconds)
        if (diff > 10 * 1000) {
            diff = 0;
            slidingWindow = [];
        }

        // Compute the current BPM
        let periodInSeconds = diff / 1000.0;
        let freq            = 1.0 / periodInSeconds;
        let bpm             = freq * 60.0;

        const SLIDING_WINDOW_SIZE = 8;
        let length = 0;
        if (isFinite(bpm)) {
            length = slidingWindow.push(bpm);
        }

        if (length > SLIDING_WINDOW_SIZE) {
            // Remove the last element of the sliding window
            slidingWindow.splice(0, 1);
        }

        if (length >= SLIDING_WINDOW_SIZE / 2) {
            // Compute the sliding window
            let bpmSum = 0;
            slidingWindow.forEach((val) => {
                bpmSum += val;
            });

            let avgBpm = (bpmSum / slidingWindow.length).toFixed(0);
            Actions.changeBpm(avgBpm);
        }

        this.setState({
            timestamp:     timestamp,
            slidingWindow: slidingWindow
        });
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

                <MdStop size="40" style={styles.icon} onClick={Actions.stop}/>

                <input  type="number" style={styles.input} value={this.props.bpm} onChange={(e) => Actions.changeBpm(e.target.value)}/>
                <span   style={styles.bpmText}>bpm</span>
                <Button mode="press" value={true} activeText="Tap"  onClick={this.tapBpm} />
                <Button mode="press" value={true} activeText="Sync" onClick={Actions.sync} />

                <span style={styles.bpmText}>view</span>
                <Button value={!this.props.isPatternMode} activeText="Pattern" inactiveText="Pattern" onClick={() => Actions.togglePatternMode(true)} />
                <Button value={this.props.isPatternMode} activeText="Deck" inactiveText="Deck" onClick={() => Actions.togglePatternMode(false)} />
            </div>
        );
    }
};

// <Button mode="press" value={true} activeText="Auto" onClick={Actions.autoBpm} />

const styles = {
    container: {
        //height: 50,
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
