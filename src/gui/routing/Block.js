import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import { DragSource }                  from 'react-dnd';
import { DropTarget }                  from 'react-dnd';
import HTML5Backend                    from 'react-dnd-html5-backend';
import flow                            from 'lodash/flow';
import Actions                         from '../../actions/Actions.js';

const blockSource = {
    beginDrag(props) {
        return props;
    }
};

const blockTarget = {
    drop(props, monitor) {
        const item = monitor.getItem();
        if (item) {
            if (props.type === item.type && props.type == "effect") {
                Actions.moveEffect(item.position, props.position);
            }
        }
    }
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

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

        const { connectDragSource, isDragging, connectDropTarget, isOver } = this.props;

        return connectDropTarget(connectDragSource(
            <div
                style={[styles.container, this.props.active ? styles.inactive : null, colorStyle, sizeStyle]}
                onClick={this.props.onPress}
                onContextMenu={this.props.onRightClick}
            >
                <div>{ this.props.name }</div>
            </div>
        ));
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

export default flow(
    DragSource("block", blockSource, collectSource),
    DropTarget("block", blockTarget, collectTarget)
)(Radium(Block));
