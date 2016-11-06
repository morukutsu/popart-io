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

        void main () {
            gl_FragColor = texture2D(child, uv);
        }`
    }
});

export class TemplateCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "RGBSplit";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'y'         : new IO('y',      'float', 'input', -1, 1),
        };

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

export const TemplateDisplay = GL.createComponent(({ children, state }) => {
    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
            }}
        >
            <GL.Uniform name="child">
                { childrenToRender }
            </GL.Uniform>
        </GL.Node>
    );
}, {
  displayName: "TemplateDisplay"
});
