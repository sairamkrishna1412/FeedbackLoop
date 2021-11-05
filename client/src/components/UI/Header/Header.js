import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Nav from '../../Nav/Nav';

function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <header className={`header-wrapper`}>
      <div className={`logo`}>
        <Link to="/" className="link logoLink">
          FeedbackLoop
        </Link>
      </div>
      <Nav isLoggedIn={isLoggedIn}></Nav>
    </header>
  );
}

export default Header;
