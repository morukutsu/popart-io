import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import Arc                             from './Arc';
import BaseKnob                        from './BaseKnob';

class ModulationKnob extends BaseKnob {
    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps, nextState) {
        /*if (this.state.isTweaking) {
            return true;
        } else {
            return nextProps.text        !== this.props.text || nextProps.min   !== this.props.min ||
                   nextProps.max         !== this.props.max  || nextProps.value !== this.props.value ||
                   nextProps.isModulated !== this.props.isModulated || nextProps.rawValue !== this.props.rawValue;
        }*/

        return true;
    }

    render() {
        let onDragStart = null;
        let onMouseDown = null;

        if (this.props.visible) {
            onDragStart = (e) => { e.preventDefault(); return false; };
        }

        if (this.props.visible) {
            onMouseDown = this.handleMouseDown.bind(this);
        }

        return (
            <div style={styles.outerContainer}>
                <div
                    style={[styles.circle, this.props.visible ? styles.visible : styles.hidden ]}
                    onDragStart={onDragStart}
                    onMouseDown={onMouseDown}
                />

                {
                    this.state.isTweaking ?
                    <div
                        style={styles.mouseReactiveArea}
                        onMouseUp={this.handleMouseUp.bind(this)}
                        onMouseMove={this.handleMouseMove.bind(this)}
                    />
                    :
                    null
                }
            </div>
        );
    }
};

const styles = {
    outerContainer: {
        position: 'relative',
    },

    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightBlue',
    },

    hidden: {
        backgroundColor: 'transparent'
    },

    visible: {
        cursor: 'pointer',
    },

    mouseReactiveArea: {
        width: 500,
        height: 500,
        /*backgroundColor: '#FD5A35',
        opacity: 0.3,*/
        position: 'absolute',
        top:  -250 + 10 / 2,
        left: -250 + 10 / 2,
        zIndex: 10
    }
};

export default Radium(ModulationKnob);
