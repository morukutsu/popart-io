import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2  uv;
        uniform float t;
        uniform vec4 color;
        uniform float x, y;
        uniform float count;
        uniform sampler2D modulation;

        void main () {
            float modulationValue = texture2D(modulation, uv).r;

            float freq  = count;
            float value = freq * (t + uv.y * y + uv.x * x);

            // Phase modulation
            value += modulationValue;

            float mult  = abs(sin(value) );

            gl_FragColor = color * mult;
        }`
    }
});

export class SynthesizerCore {
    constructor() {
        this.IO = {
            'waveform': new IO('float', 'input'),
            'speed'   : new IO('float', 'input'),
            'x'       : new IO('float', 'input'),
            'y'       : new IO('float', 'input'),
            'count'   : new IO('float', 'input'),
            'color'   : new IO('color', 'input'),
        };

        // Default values
        this.IO.waveform.set(1.0);
        this.IO.speed.set(1.0);
        this.IO.x.set(0.0);
        this.IO.y.set(1.0);
        this.IO.count.set(1.0);
        this.IO.color.set([1.0, 1.0, 1.0, 1.0]);

        this.time = 0.0;
    }

    tick(dt) {
        this.time += dt * this.IO.speed.read();
    }

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
    }

    getState() {
        return this;
    }
}

export const SynthesizerDisplay = GL.createComponent(({ children, state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
                t:     state.time,
                color: state.IO.color.read(),
                x:     state.IO.x.read(),
                y:     state.IO.y.read(),
                count: state.IO.count.read(),
            }}
        >
            <GL.Uniform name="modulation">
                { children ? children : <img src="/white.png" /> }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "Synthesizer"
});
