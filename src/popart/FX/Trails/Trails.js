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
            vec4 newColor      = texture2D(child, uv);
            float newLuminance = luminance(newColor);

            vec4 oldColor = texture2D(previousFrame, uv);
            float oldLuminance = luminance(oldColor);

            if (newLuminance >= oldLuminance) {
                gl_FragColor = newColor;
            } else {
                // Fade old color to black
                vec4 c = oldColor;
                c.rgb = c.rgb * (0.8 + amount * 0.2);

                gl_FragColor = c;
            }
        }`
    }
});

export class TrailsCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Trails";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'amount'    : new IO('amount', 'float', 'input', 0, 1),
        };

        this.IO.amount.set(0.9);

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

export class TrailsDisplay extends Component {
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
