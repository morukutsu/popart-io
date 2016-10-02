import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';
import IO  from '../../IO/IO';
import MUX from '../../IO/MUX';

const shaders = GL.Shaders.create({
    shader: {
        frag: `
        precision highp float;
        varying vec2 uv;
        uniform vec4 squareColor;
        uniform vec2 resolution;
        uniform float posX, posY, squareW, squareH;
        void main () {
            // Compute fragment position without aspect ratio normalization
            vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 fragPos = vec2(1.0 / resolution.x, 1.0 / resolution.x);
            fragPos = fragPos * fragCoord;
            fragPos.y += ((resolution.x - resolution.y) / 2.0) / resolution.x;

            vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
            if (fragPos.x > posX            &&
                fragPos.x <= posX + squareW &&
                fragPos.y > posY            &&
                fragPos.y <= posY + squareH
            )
            {
                color = squareColor;
            }
            gl_FragColor = color;
        }`
    }
});

export class SquareCore {
    constructor() {
        this.IO = {
            'x'           : new IO('float', 'input'),
            'y'           : new IO('float', 'input'),
            'w'           : new IO('float', 'input'),
            'h'           : new IO('float', 'input'),
            'squareColor' : new IO('color', 'input'),
        };
    }

    tick(dt) {
    }

    tempoTick() {

    }

    getState() {
        return this;
    }
}

export const SquareDisplay = GL.createComponent(({ state }) => {
    return (
        <GL.Node
            shader={shaders.shader}
            uniforms={{
                resolution:  [1280, 720], // TODO: set dynamically
                posX:        state.IO.x.read(),
                posY:        state.IO.y.read(),
                squareW:     state.IO.w.read(),
                squareH:     state.IO.h.read(),
                squareColor: state.IO.squareColor.read()
            }}
        />
    );
}, {
  displayName: "SquareDisplay"
});
