import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform float c;
        void main () {
            gl_FragColor = vec4(c, c, c, 1.0);
        }`
    }
});

export class StrobeCore {
    constructor() {
        this.currentColor = 1.0;
        this.time = 0.0;
        this.cycleTime = 0.0;
    }

    tick(dt) {
        //this.blue = Math.abs(Math.sin(this.time));
        // Simple pattern
        this.time      += dt;
        this.cycleTime += dt * 2;
        if (this.cycleTime > 1.0) {
            this.cycleTime = 0.0;

            // Change current color
            this.currentColor = this.currentColor == 1.0 ? 0.0 : 1.0;
        }
    }

    getState() {
        return this;
    }
}

export const StrobeDisplay = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{c: state.currentColor}}
        />
    );
}, {
  displayName: "StrobeDisplay"
});
