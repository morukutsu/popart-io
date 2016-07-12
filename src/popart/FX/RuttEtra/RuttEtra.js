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
            float x = uv.x * 1280.0;
            float y = uv.y * 720.0;

            /*x = ceil(x / 2.0) * 2.0;
            y = ceil(y / 2.0) * 2.0;*/

            vec2 pos = vec2(x / 1280.0, y / 720.0);

            // Sample current pixel and compute its luminance
            vec4 c = texture2D(child, pos);
            float luminance = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

            // Initial horizontal scanlines
            float sampleY = pos.y - (luminance * 0.2);
            if (sin(sampleY * 200.0) < 0.9)
                c = vec4(0.0, 0.0, 0.0, 0.0);

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
    }

    tick(dt) {

    }

    onParameterChanged(parameter, value) {
        this.IO[parameter].set(value);
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
