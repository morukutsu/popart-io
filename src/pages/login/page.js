import React from 'react';
import { browserHistory } from 'react-router';
import styles from './style.css';
import GL from 'gl-react';
import { Surface } from 'gl-react-dom';
 
 const shaders = GL.Shaders.create({
  helloGL: {
    frag: `
precision highp float;
varying vec2 uv;
uniform float blue;
void main () {
  gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
}`
  }
});

export default class LoginPage extends React.Component {
    /*signUp() {
        browserHistory.push('/home');
    }*/
    
    render() {
        return (
            <div className={styles.content}>
                hello world
                <Surface width={511} height={341}>
                    <GL.Node
                        shader={shaders.helloGL}
                        uniforms={{blue: 0.5}}
                      />
                </Surface>
            </div>
        );
    }
}
