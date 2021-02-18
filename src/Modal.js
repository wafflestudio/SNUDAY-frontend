import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ children, isActive }) => {
  return (
    <div className='modal-background' onClick={() => isActive(false)}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
export default Modal;
