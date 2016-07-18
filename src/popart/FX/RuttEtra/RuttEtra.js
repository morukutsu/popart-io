import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        //uniform float     length;

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
            float sampleY = pos.y - (luminance * 0.1); // sampling distance, parameter

            float sinValue = sin(sampleY * 150.0); // parameter
            float thresh = 0.9;

            if (sinValue < thresh)
                c = vec4(0.0, 0.0, 0.0, 0.0);
            else
            {
                float diff = sinValue - thresh; // min 0, max 0.1
                diff = diff * 10.0;             // min 0, max 1

                c.rgb = c.rgb * diff; // DIFF: soft or hard, parameter
            }

            gl_FragColor = c;
        }`
    }
});

export class RuttEtraCore {
    constructor() {
        this.name = "RuttEtra";

        this.IO = {
            'length' : new IO('float', 'input'),
        };

        this.IO.length.set(0.01);

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
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{/*length: state.IO.length.read() */}}
        >
            <GL.Uniform name="child">
                {children}
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "RuttEtra"
});
