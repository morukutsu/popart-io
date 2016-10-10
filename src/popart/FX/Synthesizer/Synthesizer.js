import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import BaseEffectCore                  from '../BaseEffectCore';
import NullDisplay                     from '../Null/Null';

const shaders = GL.Shaders.create({
    synthesizer_shader: {
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
        uniform float blending;
        uniform float waveform;

        // TODO: fix the value of PI
        #define PI      3.1415926535897
        #define HALF_PI 1.5707963267948

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
            value += (modulationValue * phaseMod) * PI;
            value += phase;

            // Synthesizer function
            float mult = 0.0;

            if (waveform > 0.75) {
                // Sin
                mult = abs(sin(value) );
            }
            else if (waveform > 0.5)
            {
                // Triangle
                float cv = mod(value, PI);
                mult = (cv < HALF_PI ? cv : 2.0*HALF_PI - cv) / HALF_PI; // tri
            }
            else if (waveform > 0.25)
            {
                // Sawtooth
                mult = (mod(value, PI)) / PI;
            }
            else
            {
                // Square
                mult = step(HALF_PI, mod(value, PI));
            }

            // Output front color and transition to the backdrop color
            vec4 synthColor = colorBack + (color * mult);

            // TODO: implement other color blending modes?

            // Blending
            vec4 outputColor;
            if (blending == 0.0) {
                // Blend A: mix
                outputColor = (inputColor * colorMod) + (synthColor * (1.0 - colorMod));
            } else {
                // Blend B: add
                outputColor = (inputColor * colorMod) + (synthColor);
            }

            gl_FragColor = outputColor;
        }`
    }
});

export class SynthesizerCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Synthesizer";

        this.IO = {
            'mute'       : new IO('mute',       'bool',  'input'),
            'waveform'   : new IO('waveform',   'float', 'input', 0, 1),
            'speed'      : new IO('speed',      'float', 'input', 0,  5),
            'x'          : new IO('x',          'float', 'input', -1, 1),
            'y'          : new IO('y',          'float', 'input', -1, 1),
            'count'      : new IO('count',      'float', 'input', 0, 50),
            'colorR'     : new IO('colorR',     'float', 'input', 0, 1),
            'colorG'     : new IO('colorG',     'float', 'input', 0, 1),
            'colorB'     : new IO('colorB',     'float', 'input', 0, 1),
            'colorBackR' : new IO('colorBackR', 'float', 'input', 0, 1),
            'colorBackG' : new IO('colorBackG', 'float', 'input', 0, 1),
            'colorBackB' : new IO('colorBackB', 'float', 'input', 0, 1),
            'phase'      : new IO('phase',      'float', 'input', 0, Math.PI),
            'phaseMod'   : new IO('phaseMod',   'float', 'input', 0, 1),
            'colorMod'   : new IO('colorMod',   'float', 'input', 0, 1),
            'countMod'   : new IO('countMod',   'float', 'input', 0, 1),
            'xMod'       : new IO('xMod',       'float', 'input', 0, 1),
            'yMod'       : new IO('yMod',       'float', 'input', 0, 1),
            'blending'   : new IO('blending',   'bool',  'input'),
            'out'        : new IO('out',        'image', 'output'),
        };

        // Default values
        this.IO.mute.set(false);
        this.IO.waveform.set(1.0);
        this.IO.speed.set(1.0);
        this.IO.x.set(0.0);
        this.IO.y.set(1.0);
        this.IO.count.set(1.0);
        this.IO.colorR.set(1.0);
        this.IO.colorG.set(1.0);
        this.IO.colorB.set(1.0);
        this.IO.colorBackR.set(0.0);
        this.IO.colorBackG.set(0.0);
        this.IO.colorBackB.set(0.0);
        this.IO.phase.set(0);
        this.IO.phaseMod.set(1);
        this.IO.colorMod.set(0);
        this.IO.countMod.set(0);
        this.IO.xMod.set(0);
        this.IO.yMod.set(0);
        this.IO.blending.set(false);

        this.buildInputList();
    }

    tick(dt) {
        this.time += dt * this.IO.speed.read();
    }

    tempoTick() {

    }
}

export const SynthesizerDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.synthesizer_shader}
            uniforms={{
                t:         state.time,
                color:     [state.IO.colorR.read(),     state.IO.colorG.read(),     state.IO.colorB.read(),     1.0],
                colorBack: [state.IO.colorBackR.read(), state.IO.colorBackG.read(), state.IO.colorBackB.read(), 1.0],
                x:         state.IO.x.read(),
                y:         state.IO.y.read(),
                count:     state.IO.count.read(),
                phase:     state.IO.phase.read(),
                phaseMod:  state.IO.phaseMod.read(),
                colorMod:  state.IO.colorMod.read(),
                countMod:  state.IO.countMod.read(),
                xMod:      state.IO.xMod.read(),
                yMod:      state.IO.yMod.read(),
                blending:  state.IO.blending.read() ? 0.0 : 1.0,
                waveform:  state.IO.waveform.read(),
            }}
        >
            <GL.Uniform name="modulation">
                { childrenToRender }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "Synthesizer"
});
