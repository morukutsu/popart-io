import React, { Component, PropTypes }  from 'react';
import { Shaders, Node, GLSL, Uniform } from 'gl-react';
import IO                               from '../../IO/IO';
import BaseEffectCore                   from '../BaseEffectCore';
import NullDisplay                      from '../Null/Null';

const shaders = Shaders.create({
    shader_led: {
        frag: GLSL`
        precision highp float;
        varying vec2      uv;
        uniform sampler2D child;
        uniform float     smooth;
        uniform vec2      resolution;
        uniform float     repeat;
        uniform float     radius;
        uniform vec4      color;

        void main () {
            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;

            // Centering
            float scale = (1.0 / repeat) / 2.0;
            float disp = (1.0 - repeat) * 1.0;

            // Point circle centers coordinates
            float xMod    = mod(fragPos.x - disp / 2.0, repeat) / repeat;
            float yMod    = mod(fragPos.y - disp / 2.0, repeat) / repeat;
            float centerX = 0.5;
            float centerY = 0.5;

            float diffX = centerX - xMod;
            float diffY = centerY - yMod;
            float distanceToCenter = sqrt(diffX*diffX + diffY*diffY);

            // Draw the circles pixels
            float normalizedSmoothFactor = smooth / (1.0 / radius);
            normalizedSmoothFactor       = clamp(normalizedSmoothFactor, 0.0, radius);

            float d = 1.0 - smoothstep(normalizedSmoothFactor, radius, distanceToCenter);

            vec4 texColor = texture2D(child, uv);

            gl_FragColor = mix(color, texColor, d);
        }`
    },
});

export class LEDCore extends BaseEffectCore {
    constructor() {
        super();

        this.name = "LED";

        this.IO = {
            'mute'   : new IO('mute',   'bool',  'input'),
            'smooth' : new IO('smooth', 'float', 'input', 0, 1),
            'repeat' : new IO('repeat', 'float', 'input', 0, 1),
            'radius' : new IO('radius', 'float', 'input', 0, 0.5),
            'colorR' : new IO('colorR',     'float', 'input', 0, 1),
            'colorG' : new IO('colorG',     'float', 'input', 0, 1),
            'colorB' : new IO('colorB',     'float', 'input', 0, 1),
        };

        this.IO.smooth.set(0.5);
        this.IO.repeat.set(0.1);
        this.IO.radius.set(0.1);
        this.IO.colorR.set(0.0);
        this.IO.colorG.set(0.0);
        this.IO.colorB.set(0.0);

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

export const LEDDisplay = (props) => {
    let state    = props.state;
    let children = props.children;

    let childrenToRender = children ? children : <NullDisplay />;
    if (state.IO.mute.read() ) {
        return childrenToRender;
    }

    return (
        <Node
            shader={shaders.shader_led}
            uniforms={{
                resolution:  [props.width * props.ratio, props.height * props.ratio],
                smooth:      state.IO.smooth.read(),
                repeat:      state.IO.repeat.read(),
                radius:      state.IO.radius.read(),
                color :      [state.IO.colorR.read(), state.IO.colorG.read(), state.IO.colorB.read(), 1.0],
                child :      childrenToRender
            }}
        />
    );
};
