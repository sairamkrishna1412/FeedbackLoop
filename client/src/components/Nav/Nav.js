import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import LinkButton from '../UI/Button/LinkButton/LinkButton';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faBars } from '@fortawesome/free-solid-svg-icons';

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
      <ul className="hidden sm:flex justify-between">
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
            to="/newCampaign"
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
        <li className={styles['user-icon__cont']}>
          <div>
            <button className={'button-default'}>
              <FontAwesomeIcon
                icon={faUserAlt}
                className={`hidden sm:inline-block ${styles['user-icon']}`}
                onClick={toggleUserMenu}
              ></FontAwesomeIcon>
              <FontAwesomeIcon
                icon={faBars}
                className={`sm:hidden ${styles['user-icon']}`}
                onClick={toggleUserMenu}
              ></FontAwesomeIcon>
            </button>
          </div>
          {isMenuVisible && (
            <ul className={styles['user-menu']}>
              <li>{user.name}</li>
              {/* <li>Available credits : {user.credits}</li>  */}
              <div className=" border-y sm:hidden">
                <li className="border-y">
                  <NavLink
                    onClick={toggleUserMenu}
                    className={`${styles.navLink} focus:font-medium`}
                    to="/"
                    exact
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="border-y">
                  <NavLink
                    onClick={toggleUserMenu}
                    className={`${styles.navLink} focus:font-medium`}
                    to="/newCampaign"
                  >
                    New Campaign
                  </NavLink>
                </li>
              </div>
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
