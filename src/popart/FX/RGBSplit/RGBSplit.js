import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     length;

        void main () {
            vec4 color = texture2D(child, uv);
            vec4 cLeft = texture2D(child, uv - vec2(length, 0.0));

            vec4 r = vec4(cLeft.r, 0.0,     0.0, 1.0);
            vec4 g = vec4(0.0,     color.g, 0.0, 1.0);
            vec4 b = vec4(0.0,     0.0,     color.b, 1.0);

            gl_FragColor = r + g + b;
        }`
    }
});

export class RGBSplitCore {
    constructor() {
        this.IO = {
            'length' : new IO('float', 'input'),
        };

        this.IO.length.set(0.01);
    }

    tick(dt) {

    }

    getState() {
        return this;
    }
}

export const RGBSplitDisplay = GL.createComponent(({ children, state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{length: state.IO.length.read() }}
        >
            <GL.Uniform name="child">
                {children}
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "RGBSplit"
});
