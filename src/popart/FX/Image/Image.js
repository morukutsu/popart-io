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
        uniform float x, y;
        void main () {
            vec2 pos = uv + vec2(x, y);
            gl_FragColor = texture2D(child, pos);
        }`
    }
});

export class ImageCore {
    constructor() {
        this.time = 0.0;

        this.IO = {
            'image': new IO('string', 'input'),
            'x'    : new IO('float', 'input'),
            'y'    : new IO('float', 'input')
        };

        this.IO.x.set(0);
        this.IO.y.set(0);
    }

    tick(dt) {
        // Internal oscillator
        this.time += dt;
    }

    tempoTick() {

    }

    getState() {
        return this;
    }
}

export const ImageDisplay = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
                x: state.IO.x.read(),
                y: state.IO.y.read()
            }}
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
