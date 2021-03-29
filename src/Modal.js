import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ header, content, button, isActive }) => {
  return (
    <div
      className='modal-background'
      onClick={(e) => {
        e.stopPropagation();
        isActive(() => false);
      }}
    >
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        {header}
        {content}
        {button}
      </div>
    </div>
  );
};
export default Modal;
