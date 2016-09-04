import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import Knob                            from '../control/Knob';

class ParameterDetails extends React.Component {
    constructor() {
        super();
    }

    connect(event, selected) {
        let modulatorName = event.target.value;

        if (modulatorName == "none") {
            // Unplug
            selected.unplug();
        } else {
            // Plug
            // Retrieve the DOM node of the selected option
            let selectedOption = null;
            for (var i = 0; i < event.target.options.length; i++) {
                if (event.target.options[i].selected) {
                    selectedOption = event.target.options[i];
                    break;
                }
            }

            // Retrieve the modulator using its unique id
            let modulatorId = selectedOption.dataset.modulatorId;

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

    render() {
        let content = null;
        if (this.props.selectedParameter) {
            // TODO: how to manage modulators with multiple outputs?
            let options = this.props.modulators.map((modulator, index) => (
                <option
                    key={index}
                    data-modulator-id={modulator.uuid}
                >
                    { modulator.name }
                </option>
            ));

            let selectedValue = "none";
            if (this.props.selectedParameter.pluggedIo) {
                selectedValue = this.props.selectedParameter.pluggedEntity.name;
            }

            content = (
                <div>
                    <span style={styles.modulator}>{ this.props.selectedParameter.name }</span>
                    <select
                        value={selectedValue}
                        onChange={(event) => this.connect(event, this.props.selectedParameter)}
                    >
                        <option>none</option>
                        { options }
                    </select>
                </div>
            );
        }

        return (
            <div
                style={styles.container}
            >
                 { content }
            </div>
        );
    }
};

const styles = {
    container: {
        padding: 8,
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: '#464646',
    },

    modulator: {
        fontWeight: 'bold',
        userSelect: 'none',
        color:      'white',
        fontSize:   12,
        marginRight: 8,
    }
};

export default Radium(ParameterDetails);
