import React, { Component, PropTypes } from 'react';
import Button                          from '../../gui/control/Button';
import DropMenu                        from '../../gui/menu/DropMenu.js';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../gui/control/RefreshedComponents';

export default class BaseController extends React.Component {
    constructor() {
        super();

        this.knobsProps = {};
    }

    componentWillMount() {
        this.updateKnobsProps(this.props);
    }

    componentWillUpdate(nextProps, nextState) {
        this.updateKnobsProps(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    updateKnobsProps(props) {
        // We build the props programmatically to simplify the Knobs rendering code
        props.coreState.inputList.forEach((input) => {
            this.knobsProps[input.name] = {
                input:                     input,
                min:                       input.modulateBounds[0],
                max:                       input.modulateBounds[1],
                value:                     input.read(),
                rawValue:                  input.readRaw(),
                isModulated:               input.isPlugged(),
                modulationRange:           input.getModulationRange(),
                onChange:                  (value) => props.onParameterChanged(input.name, value),
                onModulationRangeChanged:  (value) => props.onModulationRangeChanged(input.name, value),
                onRightClick:              (event) => { props.onParameterSelected(input); this.setDropMenuPosition(event); },
            };
        });
    }

    setDropMenuPosition(event) {
        this.setState({
            dropMenuX: event.pageX,
            dropMenuY: event.pageY
        });
    }

    buildParameterList() {
        if (this.props.modulators) {
            let list = [{
                name:    "None",
                onClick:  () => this.connect(-1, this.props.selectedParameter),
            }];

            return list.concat(this.props.modulators.map((modulator, index) => {
                let selected = false;
                if (this.props.selectedParameter.pluggedIo) {
                    if (modulator.uuid == this.props.selectedParameter.pluggedEntity.uuid) {
                        selected = true;
                    }
                }

                return {
                    name:     modulator.name,
                    onClick:  () => this.connect(modulator.uuid, this.props.selectedParameter),
                    selected: selected
                }
            }));
        }

        return [];
    }

    connect(modulatorId, selected) {
        if (modulatorId == -1) {
            // Unplug
            selected.unplug();
        } else {
            // Plug
            let modulator = null;
            this.props.modulators.every((mod) => {
                if (mod.uuid == modulatorId) {
                    modulator = mod;
                    return false;
                }

                return true;
            });

            selected.plug(modulator.IO.output, modulator);
            selected.modulate(true);
        }
    }

    renderTitleButtons() {
        return (
            <RefreshedButton input={this.props.coreState.IO.mute} activeText="On" inactiveText="Off" onClick={(value) => this.props.onParameterChanged("mute", !value)} />
        );
    }

    renderDropMenu() {
        if (!this.props.selectedParameter) {
            return null;
        } else {
            let menus = this.buildParameterList();

            let dropMenuStyle = {
                position: 'absolute',
                top:  this.state.dropMenuY,
                left: this.state.dropMenuX,
            };

            return (
                <div style={dropMenuStyle}>
                    <DropMenu
                        items={menus}
                        onDropMenuItemSelected={() => this.props.onParameterSelected(null) }
                        onClickOutside={() => this.props.onParameterSelected(null) }
                    />
                </div>
            );
        }
    }
}
