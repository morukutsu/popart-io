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
        void main () {
            gl_FragColor = vec4(c.r, c.g, c.b, c.a);
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
            //'speed'   : new IO('color', 'input'),
        };

        this.IO.onColor.set([1.0, 0, 0, 0.3]);
        this.IO.offColor.set([0.0, 0, 0, 1]);

        this.muxCurrentColor = new MUX(this.IO.onColor, this.IO.offColor, this, 'isOn');
    }

    tick(dt) {
        // Internal oscillator
        if (this.IO.trigger.isPlugged() ) {
            this.isOn = this.IO.trigger.read();
        } else {
            this.time      += dt;
            this.cycleTime += dt * 2;
            if (this.cycleTime > 1.0) {
                this.cycleTime = 0.0;

                // Change current color
                this.isOn = !this.isOn;
            }
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
            uniforms={{c: state.muxCurrentColor.read()}}
        />
    );
}, {
  displayName: "StrobeDisplay"
});
