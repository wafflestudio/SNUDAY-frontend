import { ReactComponent as Logo } from './resources/logo.svg';
import './Login.css';
import { useHistory } from 'react-router-dom';
import { loginUser } from './API';
import { useEffect, useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import { InputBox } from './Input';
const Login = () => {
  let history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const {
    action: { setToken, setIsLoggedIn },
  } = useAuthContext();
  const login = () => {
    loginUser({ username, password })
      .then((data) => {
        setToken(data);
        setIsLoggedIn(true);
        history.push('/');
      })
      .catch((status) => {
        setShowMessage(true);
      });
  };
  useEffect(() => {
    setShowMessage(false);
  }, [username, password]);
  return (
    <>
      <div className="login-header">
        <Logo className="login-logo" />
      </div>
      <form className="login-form">
        <InputBox
          value={username}
          setValue={setUsername}
          type="text"
          message={showMessage ? '아이디를 입력하세요.' : undefined}
          showMessage={true}
          pattern={/^.+$/}
          placeholder="아이디"
        ></InputBox>
        <InputBox
          value={password}
          setValue={setPassword}
          type="password"
          message={showMessage ? '비밀번호를 입력하세요.' : undefined}
          showMessage={showMessage}
          pattern={/^.+$/}
          placeholder="비밀번호"
        ></InputBox>
        {showMessage && username !== '' && password !== '' ? (
          <p className="input-condition-message">
            존재하지 않는 아이디이거나 잘못된 비밀번호입니다.
          </p>
        ) : (
          <></>
        )}
        <button
          className="button-big"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
        >
          로그인
        </button>
      </form>
      <div className="login-helper">
        <button onClick={() => history.push('./findmyid')}>아이디 찾기</button>
        <button onClick={() => history.push('/signup')}>회원가입</button>
      </div>
    </>
  );
};
export default Login;
