import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Header = ({ children, left, right }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = children + ' | SNUDAY';
  }, [children]);
  return (
    <>
      <div className="header-background"></div>
      <header
        className="header"
        onClick={() => {
          window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        {left ? (
          React.cloneElement(left, {
            className: 'header-left',
          })
        ) : (
          <img
            src="/resources/arrow-back.svg"
            alt="back to previous page"
            className="header-left"
            onClick={() => navigate(-1)}
          />
        )}
        {children}
        {right ? (
          React.cloneElement(right, {
            className: 'header-right',
          })
        ) : (
          <></>
        )}
      </header>
    </>
  );
};
export default Header;
