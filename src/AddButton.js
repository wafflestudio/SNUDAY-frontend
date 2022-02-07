import React, { useState } from 'react';
const MainAddButton = ({ component, ...props }) => {
  const shrink = (e) => {
    e.target.parentElement.parentElement.classList.add('button-shrink');
  };
  const unshrink = (e) => {
    e.target.parentElement.parentElement.classList.remove('button-shrink');
  };
  return <ModalButton />;
};
const ModalButton = ({ component, style, button, ...props }) => {
  const Component = component;
  const [add, setAdd] = useState(false);
  const shrink = (e) => {
    e.target.parentElement.parentElement.classList.add('button-shrink');
  };
  const unshrink = (e) => {
    e.target.parentElement.parentElement.classList.remove('button-shrink');
  };
  return (
    <>
      {add ? <Component isActive={setAdd} {...props} /> : <></>}
      <div style={style} className="button-add-container" id="add-button">
        {button ?? (
          <img
            className="button-add"
            src="/resources/button-add.png"
            srcSet="/resources/button-add@2x.png 2x, /resources/button-add@3x.png 3x"
            alt="add"
          />
        )}
        <svg
          className="button-add-circle"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            fill="transparent"
            cx="47"
            cy="47"
            r="38.69"
            onClick={() => setAdd(true)}
            onPointerDown={(e) => shrink(e)}
            onPointerUp={(e) => unshrink(e)}
            onPointerLeave={(e) => unshrink(e)}
          />
        </svg>
      </div>
    </>
  );
};
export default ModalButton;
