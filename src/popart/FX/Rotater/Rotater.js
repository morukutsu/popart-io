import React, { Component, PropTypes } from 'react';
import { Shaders, Node, GLSL, Bus, Backbuffer, LinearCopy }    from 'gl-react';
import IO                              from '../../IO/IO';
import NullDisplay                     from '../Null/Null';
import BaseEffectCore                  from '../BaseEffectCore';

const shaders = Shaders.create({
    shader: {
        frag: GLSL`
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     amount, t;
        uniform vec2      resolution;

        mat2 zrot(float t)
        {
            return mat2(cos(t), -sin(t), sin(t), cos(t));
        }

        mat2 scale(vec2 _scale) {
            return mat2(_scale.x,0.0,
                0.0,_scale.y);
        }

        void main () {
            amount;

            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;

            vec2 center = vec2(0.5, 0.5);

            vec2 pos = fragPos - center;

            pos = pos * (zrot(t) * scale(vec2(1.0, resolution.x / resolution.y)));
            pos += center;

            pos = mod(pos, 1.0);

            vec4 newColor = texture2D(child, pos);
            gl_FragColor  = newColor;
        }`
    }
});

export class RotaterCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "Rotater";

        this.IO = {
            'mute'      : new IO('mute',   'bool',  'input'),
            'amount'    : new IO('amount', 'float', 'input', 0, 1),
        };

        this.IO.amount.set(0.9);

        this.buildInputList();
    }

    tick(dt) {
        this.time += dt;
    }

    tempoTick() {

    }

    getState() {
        return this;
    }
}

export class RotaterDisplay extends Component {
    render() {
        let state    = this.props.state;
        let children = this.props.children;

        let childrenToRender = children ? children : <NullDisplay />;
        if (state.IO.mute.read() ) {
            return childrenToRender;
        }

        return (
            <Node
                shader={shaders.shader}
                uniforms={{
                    child:   () => childrenToRender,
                    amount:  state.IO.amount.read(),
                    t:       state.time,
                    resolution:  [640, 360], // TODO: set dynamically problems with that on Retina displays
                }}
            />
        );
    }
}
