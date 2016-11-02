import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import DropMenu                        from '../menu/DropMenu';
import EffectsDatabase                 from '../../popart/EffectsDatabase';

let Block = (props) => {
    return (
        <div
            style={styles.effect}
            onClick={props.onClick}
        >
            <div style={styles.title}>{ props.title }</div>
            <div style={styles.description}>{ props.description }</div>
        </div>
    );
}

Block = Radium(Block);

class Toolbar extends React.Component {
    constructor() {
        super();

        this.state = {
            activeCategory: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.activeCategory != this.state.activeCategory;
    }

    setActiveCategory(i) {
        this.setState({
            activeCategory: i
        });
    }

    render() {
        let isEffect = EffectsDatabase.categories[this.state.activeCategory].isEffect;
        let effects = EffectsDatabase.categories[this.state.activeCategory].items.map((elem, i) => {
            return (
                <Block
                    key={i}
                    onClick={isEffect ? () => this.props.onEffectClick(elem.name) : () => this.props.onModulatorClick(elem.name)}
                    title={elem.name}
                    description={elem.description}
                />
            );
        });

        let menus = EffectsDatabase.categories.map((elem, i) => (
            { name: elem.name, onClick: () => this.setActiveCategory(i) }
        ));

        menus = [
            { name: 'Palette'    },
            { name: '_separator' }
        ].concat(menus);

        return (
            <div
                style={styles.container}
            >
                <DropMenu items={menus} />

                <div style={styles.effectContainer}>
                    { effects }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: 320,
        overflow: 'hidden',
        minWidth: 0,
    },

    effectContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflowX: 'auto',
        minWidth: 0,
    },

    effect: {
        height: 150,
        width: 150,
        borderRadius: 8,
        margin: 5,
        padding: 5,
        flexShrink: 0,

        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#464646',
        cursor: 'pointer',
        color: 'white',

        ':hover': {
            backgroundColor: '#F77177',
        },

        transition: 'background-color 0.2s',
    },

    title: {
        fontWeight: 'bold',
    },

    description: {
        textAlign: 'center'
    }
};

export default Radium(Toolbar);
