import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';

const shaders = GL.Shaders.create({
    blur: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform sampler2D child;
        uniform vec2 d;

        vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
            vec4 color = vec4(0.0);
            vec2 off1 = vec2(1.3846153846) * direction;
            vec2 off2 = vec2(3.2307692308) * direction;
            color += texture2D(image, uv) * 0.2270270270;
            color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
            color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
            color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
            color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
            return color;
        }

        void main () {
            vec4 blurred = blur9(child, uv, vec2(1280, 720), d);
            gl_FragColor = blurred;
        }`
    },
});

export class BlurCore {
    constructor() {
        this.IO = {
            'intensity' : new IO('float', 'input'),
        };
    }

    tick(dt) {
    }

    getState() {
        return this;
    }
}

export const BlurDisplay = GL.createComponent(({ children, state }) => {
    let directionV = [0, state.IO.intensity.read()];
    let directionH = [state.IO.intensity.read(), 0];

    return (
        <GL.Node
            shader={shaders.blur}
            uniforms={{d: directionV}}
        >
            <GL.Uniform name="child">
                <GL.Node
                    shader={shaders.blur}
                    uniforms={{d: directionH}}
                >
                    <GL.Uniform name="child">
                        {children}
                    </GL.Uniform>
                </GL.Node>
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "Blur"
});
