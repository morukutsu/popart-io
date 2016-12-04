import React, { Component, PropTypes } from 'react';
import { Shaders, Node, GLSL, Bus, Backbuffer, LinearCopy }    from 'gl-react';
import IO                              from '../../IO/IO';
import NullDisplay                     from '../Null/Null';
import BaseEffectCore                  from '../BaseEffectCore';

const shaders = Shaders.create({
    shader: {
        frag: GLSL`
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child, previousFrame;

        void main () {
            gl_FragColor = texture2D(child, uv) * 0.3 + texture2D(previousFrame, uv) * 0.7;
        }`
    }
});

export class FeedbackCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Feedback";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'y'         : new IO('y',      'float', 'input', -1, 1),
        };

        this.IO.y.set(0.0);

        this.buildInputList();
    }

    tick(dt) {

    }

    tempoTick() {

    }

    getState() {
        return this;
    }
}

export class FeedbackDisplay extends Component {
    render() {
        let state    = this.props.state;
        let children = this.props.children;

        let childrenToRender = children ? children : <NullDisplay />;
        if (state.IO.mute.read() ) {
            return childrenToRender;
        }

        return (
            <LinearCopy>
                <Node
                    backbuffering
                    shader={shaders.shader}
                    uniforms={{
                        child:         () => childrenToRender,
                        previousFrame: Backbuffer
                    }}
                />
            </LinearCopy>
        );
    }
}
