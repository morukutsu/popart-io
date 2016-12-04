import React, { Component, PropTypes }  from 'react';
import { Shaders, Node, GLSL, Uniform } from 'gl-react';
import IO                               from '../../IO/IO';
import BaseEffectCore                   from '../BaseEffectCore';
import NullDisplay                      from '../Null/Null';

const shaders = Shaders.create({
    mosaic: {
        frag: GLSL`
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
            'mute'   : new IO('mute',   'bool',  'input'),
            'length' : new IO('length', 'float', 'input', 0, 1),
        };

        this.IO.length.set(1);

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

export const MosaicDisplay = (props) => {
    let state    = props.state;
    let children = props.children;

    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <Node
            shader={shaders.mosaic}
            uniforms={{
                length: state.IO.length.read(),
                child :  childrenToRender
            }}
        />
    );
};
