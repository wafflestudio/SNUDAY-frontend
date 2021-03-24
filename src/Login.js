import { ReactComponent as Logo } from './resources/logo.svg';
import './Login.css';
import { useHistory } from 'react-router-dom';
const Login = () => {
  let history = useHistory();
  return (
    <>
      <div className='login-header'>
        <img
          className=' login-logo'
          width='94.202'
          height='82.214'
          src='/resources/logo.svg'
          alt='SNUDAY'
        />
      </div>
      <form className='login-form'>
        <input className='input-round' type='text' placeholder='아이디' />
        <input className='input-round' type='password' placeholder='비밀번호' />
        <button className='button-big'>로그인</button>
      </form>
      <div className='login-helper'>
        <button>아이디 찾기</button>
        <button onClick={() => history.push('/signup')}>회원가입</button>
      </div>
    </>
  );
};
export default Login;
