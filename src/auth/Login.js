import { ReactComponent as Logo } from 'resources/logo.svg';
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, refresh } from 'API';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { InputBox } from 'Input';
import { usernamePattern, pwPattern } from 'Constants';
const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    document.title = '로그인 | SNUDAY';
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const {
    action: { isLoggedIn, setToken, setIsLoggedIn },
  } = useAuthContext();
  const login = () => {
    loginUser({ username, password })
      .then((data) => {
        setToken(data);
        setIsLoggedIn(true);
        navigate(location.state?.prev ? -1 : '/');
      })
      .catch((status) => {
        console.log(status);
        setShowMessage(true);
      });
  };
  useEffect(() => {
    setShowMessage(false);
  }, [username, password]);
  useEffect(() => {
    if (isLoggedIn) {
      navigate(location.state?.prev ? -1 : '/');
      console.log('goback');
    } //FIX: 이미 로그인시 이전 페이지 유지
    if (!isLoggedIn) {
      refresh()
        .then((data) => {
          setToken(data); //data.access
          setIsLoggedIn(true);
          navigate(location.state?.prev ? -1 : '/');
          console.log('goback!');
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, []);
  if (isLoading) return <></>;
  return (
    <>
      <div className="login-header">
        <Logo onClick={() => navigate('/')} className="login-logo" />
      </div>
      <form className="login-form mobile-max-container">
        <InputBox
          aria-label="ID"
          value={username}
          setValue={setUsername}
          type="text"
          message={showMessage ? '아이디를 입력하세요.' : undefined}
          showMessage={true}
          pattern={usernamePattern}
          placeholder="아이디"
        />
        <InputBox
          aria-label="password"
          value={password}
          setValue={setPassword}
          type="password"
          message={showMessage ? '비밀번호를 입력하세요.' : undefined}
          showMessage={showMessage}
          pattern={pwPattern}
          placeholder="비밀번호"
        />
        {showMessage && username !== '' && password !== '' ? (
          <p className="input-condition-message">
            존재하지 않는 아이디이거나 잘못된 비밀번호입니다.
          </p>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className="button-big"
          onClick={(e) => {
            login();
            e.preventDefault();
          }}
        >
          로그인
        </button>
      </form>
      <div className="login-helper mobile-max-container">
        <button onClick={() => navigate('/findmyid')}>아이디 찾기</button>
        <button onClick={() => navigate('/findmypw')}>비밀번호 찾기</button>
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </div>
    </>
  );
};
export default Login;
