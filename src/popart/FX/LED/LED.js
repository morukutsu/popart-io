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
        uniform sampler2D previousFrame;

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

            vec4 color     = texture2D(child, uv);
            vec4 prevColor = texture2D(previousFrame, uv);

            vec4 circleColor;

            // Draw the circles pixels
            if (distanceToCenter <= radius) {
                float d = 1.0;

                if (smooth != 1.0)
                {
                    float normalizedSmoothFactor = smooth / (1.0 / radius);

                    d = 1.0 - smoothstep(normalizedSmoothFactor, radius, distanceToCenter);
                }

                circleColor = color * d;
            } else {
                circleColor = vec4(0.0, 0.0, 0.0, 1.0);
            }

            float luminance = 0.2126 * prevColor.r + 0.7152 * prevColor.g + 0.0722 * prevColor.b;

            /*if (luminance < 0.5) {
                prevColor = vec4(0.0, 0.0, 0.0, 0.0);
            }*/

            gl_FragColor = /*prevColor * 0.8 + */circleColor/* * 0.2*/;
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
        };

        this.IO.smooth.set(0.5);
        this.IO.repeat.set(0.1);
        this.IO.radius.set(0.1);

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
                previousFrame: null,
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
