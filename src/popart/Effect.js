import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';

const shaders = GL.Shaders.create({
    helloGL: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform float blue;
        void main () {
            gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
        }`
    }
});

export class EffectCore {
    constructor() {
        this.blue = 1.0;
        this.time = 0.0;
    }

    tick(dt) {
        this.blue = Math.abs(Math.sin(this.time));
        this.time += dt * 1;
    }

    getState() {
        return this;
    }
}

export const Effect = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.helloGL}
            uniforms={{blue: state.blue}}
        />
    );
}, {
  displayName: "Effect"
});
