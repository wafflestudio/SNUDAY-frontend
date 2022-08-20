import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
//!!!Modal should come first of all siblings in order to blur the background content
export const ModalBackground = ({ children, isActive }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);
  return (
    <div
      className="modal-background"
      role="dialog"
      aria-label="modal-background"
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
  return ReactDOM.createPortal(
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
    </ModalBackground>,
    document.getElementById('root')
  );
};
export default Modal;
