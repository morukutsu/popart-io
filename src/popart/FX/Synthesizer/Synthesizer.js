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
        uniform float phase;
        uniform float phaseMod;
        uniform float colorMod;
        uniform float countMod;

        void main () {
            // Fetch color from the previous effect
            vec4 inputColor = texture2D(modulation, uv);

            // Modulation is taken from the input Red channel
            float modulationValue = inputColor.r;

            float freq  = count + (modulationValue * countMod * 50.0);
            float value = freq * (t + uv.y * y + uv.x * x);

            // Phase modulation
            value += (modulationValue * phaseMod);
            value += phase;

            // Synthesizer function
            float mult = abs(sin(value) );

            vec4 outputColor = (inputColor * colorMod) + (color * (1.0 - colorMod));
            gl_FragColor = outputColor * mult;
        }`
    }
});

export class SynthesizerCore {
    constructor() {
        this.name = "Synthesizer";

        this.IO = {
            'waveform' : new IO('waveform', 'float', 'input'),
            'speed'    : new IO('speed',    'float', 'input'),
            'x'        : new IO('x',        'float', 'input'),
            'y'        : new IO('y',        'float', 'input'),
            'count'    : new IO('count',    'float', 'input'),
            'color'    : new IO('color',    'color', 'input'),
            'phase'    : new IO('phase',    'float', 'input'),
            'phaseMod' : new IO('phaseMod', 'float', 'input'),
            'colorMod' : new IO('colorMod', 'float', 'input'),
            'countMod' : new IO('countMod', 'float', 'input'),
            'out'      : new IO('out',      'image', 'output'),
        };

        // Default values
        this.IO.waveform.set(1.0);
        this.IO.speed.set(1.0);
        this.IO.x.set(0.0);
        this.IO.y.set(1.0);
        this.IO.count.set(1.0);
        this.IO.color.set([1.0, 1.0, 1.0, 1.0]);
        this.IO.phase.set(0);
        this.IO.phaseMod.set(1);
        this.IO.colorMod.set(0);
        this.IO.countMod.set(0);

        this.time = 0.0;

        this.availableInputs = [];

        this.inputList = [];
        Object.keys(this.IO).forEach((parameterName) => {
            let parameter = this.IO[parameterName];
            if (parameter.inputOrOutput == "input") {
                this.inputList.push(parameter);
            }
        });
    }

    tick(dt) {
        this.time += dt * this.IO.speed.read();
    }

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
    }

    onAvailableInputsChanged(inputList) {
        this.availableInputs = inputList;
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
                t:        state.time,
                color:    state.IO.color.read(),
                x:        state.IO.x.read(),
                y:        state.IO.y.read(),
                count:    state.IO.count.read(),
                phase:    state.IO.phase.read(),
                phaseMod: state.IO.phaseMod.read(),
                colorMod: state.IO.colorMod.read(),
                countMod: state.IO.countMod.read(),
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
