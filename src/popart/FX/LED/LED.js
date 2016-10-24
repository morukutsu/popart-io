import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import BaseEffectCore                  from '../BaseEffectCore';
import NullDisplay                     from '../Null/Null';

const shaders = GL.Shaders.create({
    shader_led: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     smooth;
        uniform vec2      resolution;
        uniform float     repeat;
        uniform float     radius;
        uniform vec4      color;
        //uniform sampler2D previousFrame;

        void main () {
            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;

            // Centering
            float scale = (1.0 / repeat) / 2.0;
            float disp = (1.0 - repeat) * 1.0;

            // Point circle centers coordinates
            float xMod    = mod(fragPos.x - disp / 2.0, repeat) / repeat;
            float yMod    = mod(fragPos.y - disp / 2.0, repeat) / repeat;
            float centerX = 0.5;
            float centerY = 0.5;

            float diffX = centerX - xMod;
            float diffY = centerY - yMod;
            float distanceToCenter = sqrt(diffX*diffX + diffY*diffY);

            // Draw the circles pixels
            float normalizedSmoothFactor = smooth / (1.0 / radius);
            normalizedSmoothFactor       = clamp(normalizedSmoothFactor, 0.0, radius);

            float d = 1.0 - smoothstep(normalizedSmoothFactor, radius, distanceToCenter);

            vec4 texColor = texture2D(child, uv);

            gl_FragColor = mix(color, texColor, d);
        }`
    },
});

export class LEDCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "LED";

        this.IO = {
            'mute'   : new IO('mute',   'bool',  'input'),
            'smooth' : new IO('smooth', 'float', 'input', 0, 1),
            'repeat' : new IO('repeat', 'float', 'input', 0, 1),
            'radius' : new IO('radius', 'float', 'input', 0, 0.5),
            'colorR' : new IO('colorR',     'float', 'input', 0, 1),
            'colorG' : new IO('colorG',     'float', 'input', 0, 1),
            'colorB' : new IO('colorB',     'float', 'input', 0, 1),
        };

        this.IO.smooth.set(0.5);
        this.IO.repeat.set(0.1);
        this.IO.radius.set(0.1);
        this.IO.colorR.set(0.0);
        this.IO.colorG.set(0.0);
        this.IO.colorB.set(0.0);

        this.inputList = [];
        this.buildInputList();
    }

    tick(dt) {
    }

    tempoTick() {

    }

    getState() {
        return this;
    }
}

export const LEDDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.shader_led}
            uniforms={{
                resolution:  [640, 360], // TODO: set dynamically
                smooth:      state.IO.smooth.read(),
                repeat:      state.IO.repeat.read(),
                radius:      state.IO.radius.read(),
                color :      [state.IO.colorR.read(), state.IO.colorG.read(), state.IO.colorB.read(), 1.0],
                //previousFrame: null,
            }}
        >
            <GL.Uniform name="child">
                { childrenToRender }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "LED"
});
