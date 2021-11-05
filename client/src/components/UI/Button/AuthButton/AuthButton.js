import React from 'react';
// import { Link } from 'react-router-dom';
import styles from './AuthButton.module.css';

function AuthButton(props) {
  //two types of buttons are there black and white both with blue on hoved
  return (
    <a
      href={props.to}
      className={`${props.className ? props.className : ''} ${
        styles.authButton
      }`}
    >
      {props.children}
    </a>
  );
}

export default AuthButton;
