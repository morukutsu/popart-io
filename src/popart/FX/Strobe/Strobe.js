import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';
import MUX from '../../IO/MUX';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform vec4 c;
        uniform sampler2D child;
        void main () {
            vec4 childColor = texture2D(child, uv);
            vec4 blinkColor = vec4(c.r, c.g, c.b, c.a);
            gl_FragColor    = childColor + blinkColor;
        }`
    }
});

export class StrobeCore {
    constructor() {
        this.time = 0.0;
        this.cycleTime = 0.0;
        this.isOn = false;

        this.IO = {
            'onColor' : new IO('color', 'input'),
            'offColor': new IO('color', 'input'),
            'trigger' : new IO('bool',  'input'),
        };

        this.muxCurrentColor = new MUX(this.IO.onColor, this.IO.offColor, this, 'isOn');
    }

    tick(dt) {
        // Internal oscillator
        if (this.IO.trigger.isPlugged() ) {
            // TODO: only works for boolean
            this.isOn = this.IO.trigger.read();
        }
    }

    getState() {
        return this;
    }
}

export const StrobeDisplay = GL.createComponent(({ children, state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{c: state.muxCurrentColor.read()}}
        >
            <GL.Uniform
                name="child"
            >
                {children}
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "StrobeDisplay"
});
