import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LinkButton from '../UI/Button/LinkButton/LinkButton';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './Nav.module.css';

function Nav({ isLoggedIn }) {
  const user = useSelector((state) => state.auth.user);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  let navRightContent;
  let navLeftContent;

  const toggleUserMenu = () => {
    setIsMenuVisible((curState) => !curState);
  };

  if (!isLoggedIn || !user) {
    navLeftContent = (
      <ul>
        <li>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.active}
            to="/home"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.active}
            to="/contact"
          >
            Contact Us
          </NavLink>
        </li>
      </ul>
    );
    navRightContent = (
      <ul>
        <li>
          <LinkButton to="/login" type="black">
            Log In
          </LinkButton>
        </li>
        <li>
          <LinkButton to="/signup" type="white">
            Sign Up
          </LinkButton>
        </li>
      </ul>
    );
  } else {
    navLeftContent = (
      <ul>
        <li>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.active}
            to="/home"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.active}
            to="/"
            exact
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            className={styles.navLink}
            activeClassName={styles.active}
            to="/campaign/new"
          >
            New Campaign
          </NavLink>
        </li>
      </ul>
    );
    navRightContent = (
      <ul>
        {/* <li>
          <LinkButton to="/auth/logout" type="white" default>
            Add Credits
          </LinkButton>
        </li>
        <li>
          <LinkButton to="/auth/logout" type="white" default>
            Available
          </LinkButton>
        </li> */}
        <li>
          <div className={styles['user-icon__cont']}>
            <button className={'button-default'}>
              <FontAwesomeIcon
                icon={faUserAlt}
                className={styles['user-icon']}
                onClick={toggleUserMenu}
              ></FontAwesomeIcon>
            </button>
          </div>
          {isMenuVisible && (
            <ul className={styles['user-menu']}>
              <li>{user.name}</li>
              <li>Available credits : {user.credits}</li>
              <li>
                <LinkButton to="/auth/logout" type="black" default>
                  Log Out
                </LinkButton>
              </li>
            </ul>
          )}
        </li>
      </ul>
    );
  }

  return (
    <React.Fragment>
      <nav className={styles.navLeft}>{navLeftContent}</nav>
      <nav className={styles.navRight}>{navRightContent}</nav>
    </React.Fragment>
  );
}

export default Nav;
