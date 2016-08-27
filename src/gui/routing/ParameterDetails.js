import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class ParameterDetails extends React.Component {
    constructor() {
        super();
    }

    connect(modulatorName, selected) {
        // TODO: solve modulators name conflicts with unique ids
        let modulator = null;
        this.props.modulators.every((mod) => {
            if (mod.name == modulatorName) {
                modulator = mod;
                return false;
            }

            return true;
        });

        selected.plug(modulator.IO.output, modulator);
        console.log("Plugged some IO with the LFO", modulatorName, selected.name);
    }

    render() {
        let content = null;
        if (this.props.selectedParameter) {
            let options = this.props.modulators.map((modulator, index) => (
                <option key={index}>{ modulator.name }</option>
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
                        onChange={(selected) => this.connect(selected.target.value, this.props.selectedParameter)}
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
