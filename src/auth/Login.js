import './Login.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import { ReactComponent as Logo } from 'resources/logo.svg';
import { InputBox } from 'Input';
import { usernamePattern, pwPattern } from 'Constants';
import Spinner from 'Spinner';
const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    document.title = '로그인 | SNUDAY';
  }, []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const isInvalidAccount = showMessage && username !== '' && password !== '';
  const {
    value: { isLoggedIn, isLoading },
    action: { login },
  } = useAuthContext();
  const processLogin = () => {
    setIsProcessing(true);
    login({ username, password }).catch((status) => {
      console.log(status);
      setIsProcessing(false);
      setShowMessage(true);
    });
  };
  useEffect(() => {
    setShowMessage(false);
  }, [username, password]);
  useEffect(() => {
    if (isLoggedIn)
      if (location.state?.prev) {
        navigate(-1);
        console.log('goback');
      } else {
        navigate('/');
        console.log('gohome');
      }
    //FIX: 이미 로그인시 이전 페이지 유지
  }, [isLoggedIn, isLoading]);
  if (isLoggedIn | isLoading) return <></>;
  return (
    <div className="login-page">
      <div className="login-header">
        <Logo onClick={() => navigate('/')} className="login-logo" />
      </div>
      <div className="login-body">
        <form className="login-form mobile-max-container">
          <InputBox
            aria-label="ID"
            value={username}
            setValue={setUsername}
            type="text"
            message={
              showMessage && !isInvalidAccount
                ? username
                  ? '아이디는 5글자 이상입니다.'
                  : '아이디를 입력하세요.'
                : undefined
            }
            showMessage={true}
            pattern={usernamePattern}
            placeholder="아이디"
          />
          <InputBox
            aria-label="password"
            value={password}
            setValue={setPassword}
            type="password"
            message={
              showMessage && !isInvalidAccount
                ? '비밀번호를 입력하세요.'
                : undefined
            }
            showMessage={showMessage}
            pattern={pwPattern}
            placeholder="비밀번호"
          />
          {isInvalidAccount ? (
            <p className="input-condition-message">
              존재하지 않는 아이디이거나 잘못된 비밀번호입니다.
            </p>
          ) : (
            <></>
          )}
          <button
            disabled={isProcessing}
            type="submit"
            className={`button-big ${isProcessing ? 'progress' : ''}`}
            onClick={(e) => {
              processLogin();
              e.preventDefault();
            }}
          >
            {isProcessing ? <Spinner size={30} /> : '로그인'}
          </button>
        </form>
        <div className="login-helper mobile-max-container">
          <button onClick={() => navigate('/findmyid')}>아이디 찾기</button>
          <button onClick={() => navigate('/findmypw')}>비밀번호 찾기</button>
          <button onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
