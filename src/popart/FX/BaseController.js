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

    buildDropMenu() {
        if (this.props.modulators) {
            let list = [
                {
                    name: "Reset value",
                    onClick: () => this.props.selectedParameter.resetValue()
                },

                {
                    name: "Type value...",
                },

                { name: "_separator" },

                {
                    name:    "None",
                    onClick:  () => this.connect(-1, this.props.selectedParameter),
                },
            ];

            return list.concat(this.props.modulators.map((modulator, index) => {
                let selected = false;

                if (modulator.outputList.length > 1) {
                    if (this.props.selectedParameter.pluggedIo) {
                        if (modulator.uuid == this.props.selectedParameter.pluggedEntity.uuid &&
                            this.props.selectedParameter.pluggedIo
                        )
                        {
                            selected = true;
                        }
                    }

                    return {
                        name:     modulator.name,
                        selected: false,
                        children: modulator.outputList.map((io) => {
                            if (this.props.selectedParameter.pluggedIo) {
                                if (modulator.uuid == this.props.selectedParameter.pluggedEntity.uuid &&
                                    io.name == this.props.selectedParameter.pluggedIo.name)
                                {
                                    selected = true;
                                } else {
                                    selected = false;
                                }
                            }

                            return {
                                name:     io.name,
                                selected: selected,
                                onClick:  () => this.connect(modulator.uuid, this.props.selectedParameter, io.name),
                            };
                        })
                    }
                } else {
                    if (this.props.selectedParameter.pluggedIo) {
                        if (modulator.uuid == this.props.selectedParameter.pluggedEntity.uuid) {
                            selected = true;
                        }
                    }

                    return {
                        name:     modulator.name,
                        onClick:  () => this.connect(modulator.uuid, this.props.selectedParameter, "output"),
                        selected: selected
                    }
                }
            }));
        }

        return [];
    }

    connect(modulatorId, selected, outputName) {
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

            selected.plug(modulator.IO[outputName], modulator);
            selected.modulate(true);
        }
    }

    renderTitleButtons() {
        return (
            <RefreshedButton input={this.props.coreState.IO.mute} activeText="Off" inactiveText="On" onClick={(value) => this.props.onParameterChanged("mute", value)} />
        );
    }

    renderDropMenu() {
        if (!this.props.selectedParameter) {
            return null;
        } else {
            let menus = this.buildDropMenu();

            let dropMenuStyle = {
                position: 'absolute',
                top:  this.state.dropMenuY,
                left: this.state.dropMenuX,
            };

            return (
                <div style={dropMenuStyle}>
                    <DropMenu
                        displayChildren={true}
                        items={menus}
                        onDropMenuItemSelected={() => this.props.onParameterSelected(null) }
                        onClickOutside={() => this.props.onParameterSelected(null) }
                    />
                </div>
            );
        }
    }

    renderTitle() {
        let styles = {
            title: {
                height: 45,
                padding: 10,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                fontSize: 20,
                fontWeight: 'bold',
                backgroundColor: '#FD5A35',
                color: 'white',
                flex: 1,
            },

            alignedRight: {
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                flex: 1
            },
        };

        return (
            <div style={styles.title}>
                { this.props.coreState.name }

                <div style={styles.alignedRight}>
                    { this.renderTitleButtons() }
                </div>
            </div>
        );
    }
}
