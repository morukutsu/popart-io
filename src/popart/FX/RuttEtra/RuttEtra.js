import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import BaseEffectCore                  from '../BaseEffectCore';
import NullDisplay                     from '../Null/Null';

const shaders = GL.Shaders.create({
    shader_ruttetra: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     multiplier, distance, smooth, thresh;
        uniform vec4      color;
        uniform float     xWindow, yWindow;

        void main () {
            float x = uv.x;
            float y = uv.y;

            vec2 pos = vec2(x, y);

            // Sample current pixel and compute its luminance
            vec4 c = texture2D(child, pos);
            float luminance = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

            // X-windowing
            luminance *= smoothstep(0.0, xWindow, x);
            luminance *= 1.0 - smoothstep(1.0 - xWindow, 1.0, x);

            // Y-windowing
            luminance *= smoothstep(0.0, yWindow, y);
            luminance *= 1.0 - smoothstep(1.0 - yWindow, 1.0, y);

            // Initial horizontal scanlines
            float sampleY = pos.y - (luminance * distance);
            float sinValue = sin(sampleY * multiplier);

            // Edges and Smoothing
            float diff = sinValue - thresh;       // min 0, max 1-thresh
            diff = diff * (1.0 / (1.0 - thresh)); // min 0, max 1

            float m = smoothstep(0.0, smooth, diff);
            c = c * m + color * (1.0 - m);

            gl_FragColor = c;
        }`
    }
});

export class RuttEtraCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "RuttEtra";

        this.IO = {
            'mute'       : new IO('mute',       'bool',  'input'),
            'multiplier' : new IO('multiplier', 'float', 'input', 0, 300),
            'distance'   : new IO('distance',   'float', 'input', 0, 1),
            'smooth'     : new IO('smooth',     'float', 'input', 0, 1),
            'thresh'     : new IO('thresh',     'float', 'input', 0, 1),
            'colorR'     : new IO('colorR',     'float', 'input', 0, 1),
            'colorG'     : new IO('colorG',     'float', 'input', 0, 1),
            'colorB'     : new IO('colorB',     'float', 'input', 0, 1),
            'xWindow'    : new IO('xWindow',    'float', 'input', 0, 1),
            'yWindow'    : new IO('yWindow',    'float', 'input', 0, 1),
        };

        this.IO.mute.set(false);
        this.IO.multiplier.set(60);
        this.IO.distance.set(0.1);
        this.IO.smooth.set(1.0);
        this.IO.thresh.set(0.9);
        this.IO.colorR.set(0.0);
        this.IO.colorG.set(0.0);
        this.IO.colorB.set(0.0);
        this.IO.xWindow.set(0.0);
        this.IO.yWindow.set(0.0);

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

export const RuttEtraDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.shader_ruttetra}
            uniforms={{
                multiplier: state.IO.multiplier.read(),
                distance:   state.IO.distance.read(),
                smooth:     state.IO.smooth.read(),
                thresh:     state.IO.thresh.read(),
                color:      [state.IO.colorR.read(), state.IO.colorG.read(), state.IO.colorB.read(), 1.0],
                xWindow:    state.IO.xWindow.read(),
                yWindow:    state.IO.yWindow.read()
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
