import React, { Component, PropTypes } from 'react';
import Events                          from '../popart/Events';

export default class IORefreshContainer extends Component {
    constructor() {
        super();

        this.onRefresh = this.onRefresh.bind(this);
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        return this.props.io !== nextProps.io;
        //return true;
    }*/

    componentWillMount() {
        Events.on('refresh', this.onRefresh);
    }

    componentWillUnmount() {
        Events.removeListener('refresh', this.onRefresh);
    }

    onRefresh() {
        // TODO: only update the parameters which changed during the frame

        // Trigger render
        this.setState({
            dummy: 1
        });
    }

    render() {
        // Inject IO props into children props
        const input = this.props.io;
        const childrenWithProps = React.cloneElement(this.props.children, this.props.selectFunction(input));
        return childrenWithProps;
    }
};
