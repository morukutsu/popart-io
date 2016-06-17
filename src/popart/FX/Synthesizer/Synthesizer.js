import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2  uv;
        uniform float t;

        void main () {
            float freq = 7.0;
            float mult = abs(sin(freq * (t + uv.y)));
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * mult;
        }`
    }
});

export class SynthesizerCore {
    constructor() {
        this.IO = {
            'length' : new IO('float', 'input'),
        };

        this.IO.length.set(0.01);

        this.time = 0.0;
    }

    tick(dt) {
        this.time += dt;
    }

    getState() {
        return this;
    }
}

export const SynthesizerDisplay = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{t: state.time}}
        >
        </GL.Node>
    );
}, {
  displayName: "RuttEtra"
});
