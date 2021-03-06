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
        uniform float     amount;

        float luminance(vec4 c) {
            return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
        }

        void main () {
            gl_FragColor = texture2D(child, uv) * (1.0 - amount) + texture2D(previousFrame, uv) * amount;
        }`
    }
});

export class FeedbackCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Feedback";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'amount'    : new IO('amount', 'float', 'input', 0, 1),
        };

        this.IO.amount.set(0.5);

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
                        previousFrame: Backbuffer,
                        amount:        state.IO.amount.read()
                    }}
                />
            </LinearCopy>
        );
    }
}
