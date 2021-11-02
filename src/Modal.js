import React, { useState } from 'react';
import './Modal.css';
//!!!Modal should come first of all siblings in order to blur the background content
const Modal = ({ header, content, button, isActive, style }) => {
  return (
    <div
      className="modal-background"
      onClick={(e) => {
        e.stopPropagation();
        isActive(() => false);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="modal-container"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {header}
        {content}
        {button}
      </div>
    </div>
  );
};
export default Modal;
