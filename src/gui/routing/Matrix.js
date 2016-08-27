import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';

class Matrix extends React.Component {
    constructor() {
        super();
    }

    getIOByName(name) {
        return this.props.instance.IO[name];
    }

    connect(modulator, selected) {
        let io = this.getIOByName(selected);
        console.log(io);
        io.plug(modulator.IO.output);
        console.log("Plugged some IO with the LFO");
    }

    render() {
        let instanceIOs = this.props.instance.IO;

        // Iterate on all the modulators
        let lines = this.props.modulators.map((modulator, index) => {
            // Try to find if the the current modulator is connected to a parameter of the current effect
            let selectedValue = "none";
            /*modulator.IO.output.pluggedToMe.forEach((pluggedIo) => {
                // TODO: currently we use references for the plugging
                this.props.instance.inputList.forEach((IOFromCurrentEffectName) => {
                    let IOFromCurrentEffect = this.getIOByName(IOFromCurrentEffectName);
                    if (pluggedIo == IOFromCurrentEffect) {
                        selectedValue = IOFromCurrentEffect.name;
                    }
                });
            });*/

            let options = this.props.instance.inputList.map((input, k) => {
                return (
                    <option key={k}>
                        { input.name }
                    </option>
                );
            });

            return (
                <div
                    key={index}
                    style={styles.modulator}
                >
                    { modulator.name }

                    <select
                        defaultValue={selectedValue}
                        onChange={(selected) => this.connect(modulator, selected.target.value)}
                    >
                        <option>none</option>
                        { options }
                    </select>
                </div>
            );
        });

        return (
            <div
                style={styles.container}
            >
                { lines }
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
    }
};

export default Radium(Matrix);
