import React, { Component, PropTypes } from 'react';
import Radium                          from 'radium';
import MdClose                         from 'react-icons/lib/md/close';
import PureRenderMixin                 from 'react-addons-pure-render-mixin';
import onClickOutside                  from 'react-onclickoutside';

class DropMenu extends React.Component {
    constructor() {
        super();
    }

    handleOnClick(handler) {
        this.props.onDropMenuItemSelected();
        handler && handler();
    }

    handleClickOutside(e) {
        this.props.onClickOutside();
    }

    renderMenu(menuDescription) {
        return menuDescription.map((menu, index) => {
            return (
                <div
                    key={index}
                    style={styles.item}
                    onClick={() => this.handleOnClick(menu.onClick)}
                >
                    { menu.name }
                </div>
            );
        });
    }

    render() {
        let menus = this.renderMenu(this.props.items);

        return (
            <div
                style={styles.container}
            >
                <div style={styles.menuItems}>
                    { menus }
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
    }
};

export default onClickOutside(Radium(DropMenu));
