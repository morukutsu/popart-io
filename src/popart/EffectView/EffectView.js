import React, { Component, PropTypes } from 'react';
import { Surface }                     from 'gl-react-dom';
import EffectFactory                   from '../FX/EffectFactory';
import NullDisplay                     from '../FX/Null/Null';
import Events                          from '../Events';

class EffectView extends React.Component {
    constructor() {
        super();

        this.state = {

        };

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        Events.on('refresh', this.onRefresh);
    }

    componentWillUnmount() {
        Events.removeListener('refresh', this.onRefresh);
    }

    onRefresh() {
        // Trigger render
        this.setState({
            dummy: 1
        });
    }

    renderEffects() {
        // TODO: here we have to use a graph to display all the effects correctly
        // Currently the routing is done from left to right
        if (this.props.effectInstances.length > 0) {
            // Traverse to create the component chain
            let children = null;

            for (var i = 0; i < this.props.effectInstances.length; i++) {
                let currentEffect = this.props.effectInstances[i];

                let displayComponentName = currentEffect.name + "Display";
                let component = EffectFactory.lookupComponentByName(displayComponentName);

                // Create the react component
                let componentInstance = React.createElement(component, {
                    state:    currentEffect.getState(),
                    children: children
                });

                // Set the current component to be the children of the next one
                children = componentInstance;
            }

            // Return the last instianciated compnent
            return children;
        } else {
            return (<NullDisplay />);
        }
    }

    render() {
        return (
            <Surface
                width={640}
                height={360}
                style={styles.surface}
                ref="surface"
            >
                { this.renderEffects() }
            </Surface>
        );
    }
}

const styles = {
    surface: {
        margin: 10,
    }
};

export default EffectView;
