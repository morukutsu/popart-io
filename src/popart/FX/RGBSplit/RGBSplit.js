import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO                              from '../../IO/IO';
import NullDisplay                     from '../Null/Null';
import BaseEffectCore                  from '../BaseEffectCore';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     length;
        uniform vec2      direction;

        void main () {
            vec4 color = texture2D(child, uv);
            vec4 cLeft = texture2D(child, uv + (direction * length));

            vec4 r = vec4(cLeft.r, 0.0,     0.0, 1.0);
            vec4 g = vec4(0.0,     color.g, 0.0, 1.0);
            vec4 b = vec4(0.0,     0.0,     color.b, 1.0);

            gl_FragColor = r + g + b;
        }`
    }
});

export class RGBSplitCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "RGBSplit";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'length'    : new IO('length', 'float', 'input', 0, 0.5),
            'x'         : new IO('x',      'float', 'input', -1, 1),
            'y'         : new IO('y',      'float', 'input', -1, 1),
        };

        this.IO.length.set(0.01);
        this.IO.x.set(1.0);
        this.IO.y.set(0.0);

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

export const RGBSplitDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
                length:    state.IO.length.read(),
                direction: [ state.IO.x.read(), state.IO.y.read() ]
            }}
        >
            <GL.Uniform name="child">
                { childrenToRender }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "RGBSplit"
});
