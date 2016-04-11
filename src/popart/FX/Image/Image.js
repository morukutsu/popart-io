import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';
import MUX from '../../IO/MUX';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform sampler2D child;
        void main () {
            gl_FragColor = texture2D(child, uv);
        }`
    }
});

export class ImageCore {
    constructor() {
        this.time = 0.0;

        this.IO = {
            'image': new IO('string', 'input'),
        };
    }

    tick(dt) {
        // Internal oscillator
        this.time += dt;
    }

    getState() {
        return this;
    }
}

export const ImageDisplay = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
        >
            <GL.Uniform
                name="child"
            >
                <img src={state.IO.image.read() } />
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "SquareDisplay"
});
