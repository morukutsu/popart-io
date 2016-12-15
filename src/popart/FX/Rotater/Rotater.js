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
        uniform float     phase, t;
        uniform vec2      resolution;
        uniform vec2      center;

        mat2 zrot(float t)
        {
            return mat2(cos(t), -sin(t), sin(t), cos(t));
        }

        mat2 scale(vec2 _scale)
        {
            return mat2(_scale.x, 0.0, 0.0, _scale.y);
        }

        void main ()
        {
            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;

            // Rotate
            vec2 pos = fragPos - center;
            pos = pos * (zrot(t + phase) * scale(vec2(1.0, resolution.x / resolution.y)));
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
            'mute'      : new IO('mute', 'bool',  'input'),
            'phase'     : new IO('phase', 'float', 'input', 0, Math.PI),
            'direction' : new IO('direction', 'float', 'input', -1, 1),
            'speed'     : new IO('speed', 'float', 'input', 0, 10),
            'centerX'   : new IO('centerX', 'float', 'input', 0, 1),
            'centerY'   : new IO('centerY', 'float', 'input', 0, 1),
        };

        this.IO.phase.set(0);
        this.IO.direction.set(1);
        this.IO.speed.set(1);
        this.IO.centerX.set(0.5);
        this.IO.centerY.set(0.5);

        this.buildInputList();
    }

    tick(dt) {
        this.time += dt * this.IO.speed.read() * this.IO.direction.read();
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
                    child:      () => childrenToRender,
                    phase:      state.IO.phase.read(),
                    center:     [state.IO.centerX.read(), state.IO.centerY.read() ],
                    t:          state.time,
                    resolution: [this.props.width * this.props.ratio, this.props.height * this.props.ratio],
                }}
            />
        );
    }
}
