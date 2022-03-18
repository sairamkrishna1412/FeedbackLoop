import React from 'react';

const NavItem = (props) => {
  const { active } = props;
  const onClickHandler = (e) => {
    props.onClickHandler(props.title);
  };
  return (
    <div>
      <span
        className={` pb-1 cursor-pointer border-0 border-blue-400 hover:border-b-2 hover:text-gray-800 ${
          active && 'border-b-2 text-gray-800'
        }`}
        onClick={onClickHandler}
      >
        {props.title}
      </span>
    </div>
  );
};

export default NavItem;
