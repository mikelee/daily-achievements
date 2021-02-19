import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './menu.styles.scss';

import Submenu from '../submenu/submenu.component'

import { toggleMenuVisible } from '../../redux/menu/menu.actions';
import { getSubmenuCategory } from '../../redux/menu/menu.selectors';
import { setSubmenuCategory } from '../../redux/menu/menu.actions'
import { setCurrentUser } from '../../redux/user/user.actions';

class Menu extends React.Component {

    logout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials' : true
            },
            credentials: 'same-origin'
        });

        this.props.setCurrentUser(null);

        this.props.toggleMenuVisible();

        document.body.style.setProperty('--color-primary', '#707eff');
        document.body.style.setProperty('--color-primary-faded', 'rgba(112, 126, 255, .7)');
        document.body.style.setProperty('--color-primary-dark', 'rgb(72, 86, 215)');
    }

    clickMenuItem = event => {
        let category = event.target.getAttribute('name');
        this.props.setSubmenuCategory(category);
    }

    render() {
        const { submenuCategory } = this.props; 
        
        return (
            <div className='menu'>
                {
                !submenuCategory ? 
                    <div className='menu-items' onClick={this.clickMenuItem}>
                        <p className='menu-item menu-colors' name='Color Theme'>Color Theme</p>
                        <p className='menu-item menu-logout-button' onClick={this.logout}>Logout</p>
                    </div>
                :
                    <Submenu />
                }
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
   submenuCategory: getSubmenuCategory
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    toggleMenuVisible: () => dispatch(toggleMenuVisible()),
    setSubmenuCategory: category => dispatch(setSubmenuCategory(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);