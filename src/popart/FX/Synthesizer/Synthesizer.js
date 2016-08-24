import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO             from '../../IO/IO';
import BaseEffectCore from '../BaseEffectCore';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2  uv;
        uniform float t;
        uniform vec4 color, colorBack;
        uniform float x, y;
        uniform float count;
        uniform sampler2D modulation;
        uniform float phase;
        uniform float phaseMod, colorMod, countMod, xMod, yMod;

        // TODO: fix the value of PI
        #define PI 3.14

        void main () {
            // Fetch color from the previous effect
            vec4 inputColor = texture2D(modulation, uv);

            // Modulation is taken from the input Red channel
            // TODO: use pixel brightness instead?
            float modulationValue = (inputColor.r + inputColor.g + inputColor.b) / 3.0;

            // Compute oscillator frequency, TODO: countMod is not okay for the moment
            float freq = count + (modulationValue * countMod * 50.0);

            float oscX = x + (xMod * modulationValue);
            float oscY = y + (yMod * modulationValue);

            float value = freq * (t + (uv.y * oscY) + (uv.x * oscX));

            // Phase modulation
            // TODO: in the train, check sin period is PI or 2PI?
            value += (modulationValue * phaseMod) * PI;
            value += phase;

            // Synthesizer function
            float mult = abs(sin(value) );

            // TODO: implement other color blending modes?
            vec4 outputColor = (inputColor * colorMod) + (color * (1.0 - colorMod));
            //vec4 outputColor = (inputColor) + (color * colorMod);
            gl_FragColor = colorBack + (outputColor * mult);
        }`
    }
});

export class SynthesizerCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Synthesizer";

        this.IO = {
            'waveform' : new IO('waveform', 'float', 'input'),
            'speed'    : new IO('speed',    'float', 'input'),
            'x'        : new IO('x',        'float', 'input'),
            'y'        : new IO('y',        'float', 'input'),
            'count'    : new IO('count',    'float', 'input'),
            'color'    : new IO('color',    'color', 'input'),
            'colorBack': new IO('colorBack','color', 'input'),
            'phase'    : new IO('phase',    'float', 'input'),
            'phaseMod' : new IO('phaseMod', 'float', 'input'),
            'colorMod' : new IO('colorMod', 'float', 'input'),
            'countMod' : new IO('countMod', 'float', 'input'),
            'xMod'     : new IO('xMod',     'float', 'input'),
            'yMod'     : new IO('yMod',     'float', 'input'),
            'out'      : new IO('out',      'image', 'output'),
        };

        // Default values
        this.IO.waveform.set(1.0);
        this.IO.speed.set(1.0);
        this.IO.x.set(0.0);
        this.IO.y.set(1.0);
        this.IO.count.set(1.0);
        this.IO.color.set([1.0, 1.0, 1.0, 1.0]);
        this.IO.colorBack.set([0.0, 0.0, 0.0, 1.0]);
        this.IO.phase.set(0);
        this.IO.phaseMod.set(1);
        this.IO.colorMod.set(0);
        this.IO.countMod.set(0);
        this.IO.xMod.set(0);
        this.IO.yMod.set(0);

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
                t:         state.time,
                color:     state.IO.color.read(),
                colorBack: state.IO.colorBack.read(),
                x:         state.IO.x.read(),
                y:         state.IO.y.read(),
                count:     state.IO.count.read(),
                phase:     state.IO.phase.read(),
                phaseMod:  state.IO.phaseMod.read(),
                colorMod:  state.IO.colorMod.read(),
                countMod:  state.IO.countMod.read(),
                xMod:      state.IO.xMod.read(),
                yMod:      state.IO.yMod.read(),
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
