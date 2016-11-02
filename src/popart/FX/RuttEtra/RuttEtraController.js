import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import Knob                            from '../../../gui/control/Knob';
import BaseController                  from '../BaseController';
import Color                           from '../../../gui/control/Color';
import { RefreshedKnob, RefreshedColor, RefreshedButton } from '../../../gui/control/RefreshedComponents';

class RuttEtraController extends BaseController {
    constructor() {
        super();
    }

    render() {
        return (
            <div
                style={styles.container}
            >
                { this.renderTitle() }

                <div style={styles.main}>
                    <div style={styles.row}>
                        <RefreshedKnob text="multiplier" {...this.knobsProps["multiplier"]} />
                        <RefreshedKnob text="distance"   {...this.knobsProps["distance"]}   />
                        <RefreshedKnob text="smooth"     {...this.knobsProps["smooth"]}     />
                        <RefreshedKnob text="thresh"     {...this.knobsProps["thresh"]}     />
                        <RefreshedKnob text="x window"   {...this.knobsProps["xWindow"]}    />
                        <RefreshedKnob text="y window"   {...this.knobsProps["yWindow"]}    />
                    </div>
                    <div style={styles.row}>
                        <RefreshedKnob text="R" {...this.knobsProps["colorR"]} />
                        <RefreshedKnob text="G" {...this.knobsProps["colorG"]} />
                        <RefreshedKnob text="B" {...this.knobsProps["colorB"]} />
                        <RefreshedColor inputs={[this.props.coreState.IO.colorR, this.props.coreState.IO.colorG, this.props.coreState.IO.colorB]} />
                    </div>
                </div>

                { this.renderDropMenu() }
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        width: 640,
        flexDirection: 'column',
        flex: 1,
        margin: 10,
    },

    topBar: {
        height: 5,
        backgroundColor: '#FD5A35',
        marginBottom: 5,
        marginLeft: 1,
        marginRight: 1,
    },

    alignedRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1
    },

    title: {
        height: 50,
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

    row: {
        display: 'flex',
        flexDirection: 'row'
    },

    main: {
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: '#464646',
    }
};

export default Radium(RuttEtraController);
