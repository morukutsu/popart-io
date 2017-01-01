import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import onClickOutside                  from 'react-onclickoutside';

class DropMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            currentChildren: null
        };
    }

    handleOnClick(handler, menu) {
        if (menu.children) {
            let newActiveMenu = null;
            if (this.state.currentChildren !== menu.children) {
                newActiveMenu = menu.children;
            }
            
            this.setState({
                currentChildren: newActiveMenu
            });
        } else {
            this.props.onDropMenuItemSelected && this.props.onDropMenuItemSelected();
            handler && handler();
        }
    }

    handleClickOutside(e) {
        this.props.onClickOutside && this.props.onClickOutside();
    }

    renderMenu(menuDescription, keyPrefix) {
        return menuDescription.map((menu, index) => {
            if (menu.name === "_separator") {
                return <div key={index} style={styles.separator} />;
            } else {
                return (
                    <div
                        key={keyPrefix + index}
                        style={[styles.item, menu.selected ? styles.selectedItem : null]}
                        onClick={() => this.handleOnClick(menu.onClick, menu)}
                    >
                        { menu.name }
                    </div>
                );
            }
        });
    }

    render() {
        let menus = this.renderMenu(this.props.items, "menus");
        let subMenu = this.state.currentChildren ? this.renderMenu(this.state.currentChildren, "submenus") : null;

        return (
            <div
                style={styles.container}
            >
                <div style={styles.menuItems}>
                    { menus }
                    { subMenu }
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
        width: 150,
    },

    menuItems: {
        display: 'flex',
        flexDirection: 'column',
    },

    item: {
        width: 140,
        color: "lightGrey",
        cursor: 'pointer',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,

        transition: 'background-color 0.05s',

        ':hover': {
            backgroundColor: '#0093D4',
        }
    },

    selectedItem: {
        fontWeight: 'bold',
        color:      '#FD5A35'
    },

    separator: {
        width: 140,
        borderBottom: '1px solid lightGrey',
        height: 1,
        opacity: 0.5,
        marginTop: 2,
        marginBottom: 2,
    }
};

export default onClickOutside(Radium(DropMenu));
