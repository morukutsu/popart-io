import React, { Component, PropTypes } from 'react';
import GL                              from 'gl-react';

const shaders = GL.Shaders.create({
    null_shader: {
        frag: `
        precision highp float;
        varying vec2 uv;
        void main () {
            vec2 pos = uv;
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }`
    }
});

const NullDisplay = GL.createComponent(({ width, height }) => {
    return (
        <GL.Node
            shader={shaders.null_shader}
        />
    );
}, {
  displayName: "NullDisplay"
});

export default NullDisplay;
