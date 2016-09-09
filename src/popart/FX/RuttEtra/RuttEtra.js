import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import BaseEffectCore                  from '../BaseEffectCore';
import NullDisplay                     from '../Null/Null';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float multiplier, distance, smooth, thresh;

        float tri(float v) {
            return abs(fract(v*5.0)*2.0-1.0);
        }

        void main () {
            float x = uv.x;
            float y = uv.y;

            vec2 pos = vec2(x, y);

            // Sample current pixel and compute its luminance
            vec4 c = texture2D(child, pos);
            float luminance = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

            // Initial horizontal scanlines
            float sampleY = pos.y - (luminance * distance);

            float sinValue = sin(sampleY * multiplier);

            if (sinValue < thresh)
                c = vec4(0.0, 0.0, 0.0, 0.0);
            else
            {
                float diff = sinValue - thresh;       // min 0, max 1-thresh
                diff = diff * (1.0 / (1.0 - thresh));  // min 0, max 1

                diff += 1.0 - smooth;
                diff = clamp(diff, 0.0, 1.0);

                c.rgb = c.rgb * (diff) ;
                smooth;
            }

            gl_FragColor = c;
        }`
    }
});

export class RuttEtraCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "RuttEtra";

        this.IO = {
            'mute'       : new IO('mute',       'bool',  'input', false, true),
            'multiplier' : new IO('multiplier', 'float', 'input', 0, 300),
            'distance'   : new IO('distance',   'float', 'input', 0, 1),
            'smooth'     : new IO('smooth',     'float', 'input', 0, 1),
            'thresh'     : new IO('thresh',     'float', 'input', 0, 1),
        };

        this.IO.mute.set(false);
        this.IO.multiplier.set(60);
        this.IO.distance.set(0.1);
        this.IO.smooth.set(1.0);
        this.IO.thresh.set(0.9);

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

export const RuttEtraDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
                multiplier: state.IO.multiplier.read(),
                distance:   state.IO.distance.read(),
                smooth:     state.IO.smooth.read(),
                thresh:     state.IO.thresh.read(),
            }}
        >
            <GL.Uniform name="child">
                { childrenToRender }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "RuttEtra"
});
