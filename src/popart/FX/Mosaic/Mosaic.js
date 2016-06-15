import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    mosaic: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     length;

        void main () {
            vec2 samplingUV = vec2(mod(uv.x / length, 1.0), mod(uv.y / length, 1.0));
            vec4 c = texture2D(child, samplingUV);
            gl_FragColor = c;
        }`
    },
});

export class MosaicCore {
    constructor() {
        this.IO = {
            'length' : new IO('float', 'input'),
        };

        this.IO.length.set(1);
    }

    tick(dt) {
    }

    getState() {
        return this;
    }
}

export const MosaicDisplay = GL.createComponent(({ children, state }) => {
    return (
        <GL.Node
            shader={shaders.mosaic}
            uniforms={{length: state.IO.length.read() }}
        >
            <GL.Uniform name="child">
                {children}
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "Mosaic"
});
