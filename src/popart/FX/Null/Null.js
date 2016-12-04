import React, { Component, PropTypes } from 'react';
import { Shaders, Node, GLSL }         from 'gl-react';

const shaders = Shaders.create({
    null_shader: {
        frag: GLSL`
        precision highp float;
        varying vec2 uv;
        void main () {
            vec2 pos = uv;
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }`
    }
});

const NullDisplay = (props) => {
    return (
        <Node
            shader={shaders.null_shader}
        />
    );
};

export default NullDisplay;
