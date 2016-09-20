import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import DropMenu                        from './DropMenu';
import Actions                         from '../../actions/Actions';
import EffectFactory                   from '../../popart/FX/EffectFactory';

class Menu extends React.Component {
    constructor() {
        super();

        this.menus = [
            {
                name: "File",
                onClick: () => this.setActiveDropMenu(0),
                children: [
                    { name: "New",          onClick: () => null                            },
                    { name: "Open File...", onClick: () => Actions.openFile(EffectFactory) },
                    { name: "Save",         onClick: () => null                            },
                    { name: "Save as...",   onClick: () => Actions.saveFile()              },
                    { name: "Quit",         onClick: () => Actions.quit()                  },
                ]
            },
            {
                name: "Edit",
                onClick: () => this.setActiveDropMenu(1),
            },
            {
                name: "Render",
                onClick: () => this.setActiveDropMenu(2),
            }
        ];

        this.state = {
            activeDropMenu: null
        };

        this.onDropMenuItemSelected = this.onDropMenuItemSelected.bind(this);
    }

    setActiveDropMenu(id) {
        // Close drop menu if we are trying to open the current menu
        if (this.state.activeDropMenu == this.menus[id].children) {
            this.setState({
                activeDropMenu: null
            });
        } else {
            this.setState({
                activeDropMenu: this.menus[id].children
            });
        }
    }

    onDropMenuItemSelected() {
        this.setState({
            activeDropMenu: null
        });
    }

    renderMenu(menuDescription) {
        return menuDescription.map((menu, index) => {
            return (
                <div
                    key={index}
                    style={styles.item}
                    onClick={menu.onClick}>{ menu.name }
                </div>
            );
        });
    }

    render() {
        let menus = this.renderMenu(this.menus);

        return (
            <div>
                <div
                    style={styles.container}
                >
                    <div style={styles.menuItems}>
                        { menus }
                    </div>
                    <div style={styles.draggableArea}></div>
                </div>

                <div style={styles.dropMenu}>
                    {
                        this.state.activeDropMenu ?
                        <DropMenu
                            items={this.menus[0].children}
                            onDropMenuItemSelected={this.onDropMenuItemSelected}
                        />
                        :
                        null
                    }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        backgroundColor: '#090909',
        display: 'flex',
        flexDirection: 'row',
        padding: 4,
        position: 'relative'
    },

    menuItems: {
        display: 'flex',
        flexDirection: 'row',
    },

    draggableArea: {
        WebkitAppRegion: "drag",
        display: 'flex',
        flex: 1,
    },

    item: {
        color: "lightGrey",
        marginRight: 20,
        cursor: 'pointer',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,

        transition: 'background-color 0.1s',

        ':hover': {
            backgroundColor: '#0093D4',
        }
    },

    dropMenu: {
        position: 'absolute'
    }
};

export default Radium(Menu);
