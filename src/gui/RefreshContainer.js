import React, { Component, PropTypes } from 'react';
import Events                          from '../popart/Events';

export default class RefreshContainer extends Component {
    constructor() {
        super();

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        Events.on('refresh', this.onRefresh);
    }

    componentWillUnmount() {
        Events.removeListener('refresh', this.onRefresh);
    }

    onRefresh() {
        //console.log("Refresh container updating...");

        // Trigger render
        /*this.setState({
            dummy: 1
        });*/
    }

    render() {
        return this.props.children;
    }
};
