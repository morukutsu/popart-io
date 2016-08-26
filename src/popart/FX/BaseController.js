import React, { Component, PropTypes } from 'react';
import Button                          from '../../gui/control/Button';

export default class BaseController extends React.Component {
    constructor() {
        super();
    }

    renderTitleButtons() {
        return (
            <Button text="mute" value={this.props.coreState.IO.mute.read() } onClick={(value) => this.props.onParameterChanged("mute", value)} />
        );
    }
}
