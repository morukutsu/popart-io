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
        uniform float     phase, t, scaleX, scaleY;
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

            // Compute scaling matrix
            mat2 scaleMtx = scale(vec2(
                1.0 / scaleX,
                (1.0 / scaleY) * (resolution.x / resolution.y)
            ));

            // Compute rotation matrix
            mat2 rotationMtx = zrot(t + phase);

            // Apply matrices
            vec2 pos = fragPos - center;
            pos = pos * (rotationMtx * scaleMtx);
            pos += center;

            // Modulo textels out of the picture rectangle
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
            'scaleX'   : new IO('scaleX', 'float', 'input', 0, 10),
            'scaleY'   : new IO('scaleY', 'float', 'input', 0, 10),
        };

        this.IO.phase.set(0);
        this.IO.direction.set(1);
        this.IO.speed.set(1);
        this.IO.centerX.set(0.5);
        this.IO.centerY.set(0.5);
        this.IO.scaleX.set(1.0);
        this.IO.scaleY.set(1.0);

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
                    scaleX:     state.IO.scaleX.read(),
                    scaleY:     state.IO.scaleY.read(),
                }}
            />
        );
    }
}
