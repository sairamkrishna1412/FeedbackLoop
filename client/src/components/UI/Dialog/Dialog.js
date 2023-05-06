import React from "react";
import PlainCard from "../Card/PlainCard/PlainCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

export const Dialog = (props) => {
  return (
    <div>
      <div
        onClick={props.onClose}
        className="fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-40"
      ></div>
      <PlainCard className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 m-0 md:-translate-y-1/2">
        <span
          className="absolute right-5 top-3 cursor-pointer text-4xl"
          onClick={props.onClose}
        >
          <FontAwesomeIcon icon={faWindowClose}></FontAwesomeIcon>
        </span>
        {props.children}
      </PlainCard>
    </div>
  );
};
