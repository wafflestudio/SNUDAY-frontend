import React from 'react';
import { useHistory } from 'react-router-dom';
const Header = ({ children, left, right }) => {
  const history = useHistory();
  return (
    <header className="header">
      {left ? (
        React.cloneElement(left, {
          className: 'header-left',
        })
      ) : (
        <img
          src="/resources/arrow-back.svg"
          alt="back to previous page"
          className="header-left"
          onClick={history.goBack}
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
  );
};
export default Header;
