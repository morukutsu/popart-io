import React, { Component, PropTypes } from 'react';
import Button                          from '../../gui/control/Button';
import Matrix                          from '../../gui/routing/Matrix';

export default class BaseController extends React.Component {
    constructor() {
        super();
    }

    renderTitleButtons() {
        return (
            <Button activeText="Off" inactiveText="On" value={this.props.coreState.IO.mute.read() } onClick={(value) => this.props.onParameterChanged("mute", value)} />
        );
    }

    renderMatrix() {
        return (
            <Matrix
                instance={this.props.coreState}
                modulators={this.props.modulators}
            />
        );
    }
}
