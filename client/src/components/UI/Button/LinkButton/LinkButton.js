import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LinkButton.module.css';

function LinkButton(props) {
  //two types of buttons are there black and white both with blue on hoved
  const type = props.type;
  let linkColor = styles.buttonWhite;
  if (type === 'black') {
    linkColor = styles.buttonBlack;
  }
  let link;
  if (props.default) {
    link = (
      <a
        href={props.to}
        className={`${props.className} ${styles.linkButton} ${linkColor}`}
      >
        {props.children}
      </a>
    );
  } else {
    link = (
      <Link
        to={props.to}
        className={`${props.className} ${styles.linkButton} ${linkColor}`}
      >
        {props.children}
      </Link>
    );
  }

  return <div>{link}</div>;
}

export default LinkButton;
