import React from 'react';
import { browserHistory } from 'react-router';
import styles from './style.css';
import GL from 'gl-react';
import { Surface } from 'gl-react-dom';
import { Effect, EffectCore }          from '../../popart/Effect';

export default class LoginPage extends React.Component {
    constructor() {
        super();
        this.update = this.update.bind(this); // binding
    }

    componentWillMount() {
        this.ec = new EffectCore();
        this.update();
    }

    update() {
        this.ec.tick(0.016);
        this.raf = window.requestAnimationFrame(this.update);

        // Trigger renger
        this.setState({
            dummy: 1
        });
    }

    componentWillUnmount () {
        cancelAnimationFrame(this.raf);
    }

    render() {
        return (
            <div className={styles.content}>
                hello world
                <Surface width={511} height={341}>
                    <Effect state={this.ec.getState() }/>
                </Surface>
            </div>
        );
    }
}
