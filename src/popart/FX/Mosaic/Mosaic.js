import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import BaseEffectCore                  from '../BaseEffectCore';

const shaders = GL.Shaders.create({
    mosaic: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     length;

        void main () {
            // Scaling
            vec2 samplingUV = vec2((uv.x / length), (uv.y / length));

            // Centering
            float scale = (1.0 / length) / 2.0;
            float disp = (1.0 - length) * scale;

            // Moisaic
            samplingUV = mod(samplingUV - vec2(disp, disp), 1.0);

            gl_FragColor = texture2D(child, samplingUV);
        }`
    },
});

export class MosaicCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Mosaic";

        this.IO = {
            'length' : new IO('length', 'float', 'input'),
        };

        this.IO.length.set(1);

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

export const MosaicDisplay = GL.createComponent(({ children, state }) => {
    return (
        <GL.Node
            shader={shaders.mosaic}
            uniforms={{length: state.IO.length.read() }}
        >
            <GL.Uniform name="child">
                {children}
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "Mosaic"
});
