import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Block                           from '../routing/Block';
import Actions                         from '../../actions/Actions.js';
import { DragDropContext }             from 'react-dnd';
import HTML5Backend                    from 'react-dnd-html5-backend';
import Knob                            from '../control/Knob';

class Deck extends React.Component {
    constructor() {
        super();
    }

    /** Render individual blocks **/
    renderEmptyBlock() {
        return <Block name="" color="#3A3A3A"/>;
    }

    /** Render lists of blocks **/
    renderBlocks(side) {
        let blocks = [];

        for (var i = 0; i < 4; i++) {
            blocks.push(
                <Block
                    key={i}
                    position={i}
                    type="effect"
                    onPress={() => 0 }
                    onRightClick={() => 0 }
                    name={"" + i}
                    active={true}
                    color="#FD5A35"
                    hoverColor="#F77177"
                />
            );
        }

        return blocks;
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.line}>
                    <div>
                        <Block header={true} name={"Left"} color="#3A3A3A"/>
                        { this.renderBlocks("left") }
                    </div>
                    <div>
                        <Block header={true} name={"Right"} color="#3A3A3A"/>
                        { this.renderBlocks("right") }
                    </div>
                </div>
            </div>
        );
    }
}

// <Knob text="crossfade" min={-1} max={1} value={0} rawValue={0} onChange={() => 0}/>

const styles = {
    container: {
        backgroundColor: '#101010',
        padding: 5,
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 307,
    },

    line: {
        flexDirection: 'row',
        display: 'flex'
    }
};

export default DragDropContext(HTML5Backend)(Deck);
