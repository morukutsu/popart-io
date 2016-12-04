import React, { Component, PropTypes }  from 'react';
import { Shaders, Node, GLSL, Uniform } from 'gl-react';
import IO                               from '../../IO/IO';
import NullDisplay                      from '../Null/Null';
import BaseEffectCore                   from '../BaseEffectCore';

const shaders = Shaders.create({
    shader: {
        frag: GLSL`
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     vignette;

        void main () {
            vec2 q = uv;
            vec4 c = texture2D(child, uv);

            // Vignette
            c *= 0.25 + 0.75 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), vignette);

            gl_FragColor = c;
        }`
    }
});

export class PhotoStyleCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "PhotoStyle";

        this.IO = {
            'mute'      : new IO('mute',     'bool',  'input'),
            'vignette'  : new IO('vignette', 'float', 'input', 0, 1),
        };

        this.IO.vignette.set(0.15);

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

export const PhotoStyleDisplay = (props) => {
    let state    = props.state;
    let children = props.children;

    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <Node
            shader={shaders.shader}
            uniforms={{
                vignette: state.IO.vignette.read(),
                child   : childrenToRender
            }}
        />
    );
};
