import React, { useState } from 'react';
import './Modal.css';
//!!!Modal should come first of all siblings in order to blur the background content
export const ModalBackground = ({ children, isActive }) => {
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
      {children}
    </div>
  );
};
const Modal = ({ header, content, button, isActive, style }) => {
  return (
    <ModalBackground isActive={isActive}>
      <div
        className="modal-container"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {header}
        {content}
        {button}
      </div>
    </ModalBackground>
  );
};
export default Modal;
