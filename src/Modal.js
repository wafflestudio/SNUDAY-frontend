import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ children, isActive }) => {
  return (
    <div className='modal-background' onClick={() => isActive(false)}>
      <div className='modal-container'>{children}</div>
    </div>
  );
};
export default Modal;
