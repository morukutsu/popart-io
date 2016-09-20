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

        float exponentialOut(float t) {
            return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
        }

        vec4 smoothEdge(float smoothFactor, vec4 color, float value, float threshold) {
            float diff = value - threshold;           // min 0, max 1-thresh
            diff = diff * (1.0 / (1.0 - threshold));  // min 0, max 1

            diff += 1.0 - smoothFactor;
            diff = clamp(diff, 0.0, 1.0);

            diff = exponentialOut(diff);

            color.rgb = color.rgb * (diff);

            return color /*+ color * (1.0 - diff)*/;
        }

        void main () {
            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;


            float dist   = 0.1;
            float radius = 0.3;

            float xMod    = mod(fragPos.x, dist) / dist;
            float yMod    = mod(fragPos.y, dist) / dist;
            float centerX = 0.5;
            float centerY = 0.5;

            float diffX = centerX - xMod;
            float diffY = centerY - yMod;
            float distanceToCenter = sqrt(diffX*diffX + diffY*diffY);

            vec4 color = texture2D(child, uv);

            // Draw the circles pixels
            if (distanceToCenter <= radius) {
                gl_FragColor = smoothEdge(smooth, color, radius - distanceToCenter, radius);
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
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
        };

        this.IO.smooth.set(0.0);

        this.inputList = [];
        this.buildInputList();
    }

    tick(dt) {
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
                smooth:      state.IO.smooth.read()
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
