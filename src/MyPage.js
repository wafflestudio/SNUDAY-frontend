import { useHistory } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

const MyPage = () => {
  let history = useHistory();
  const {
    value: { isLoggedIn, userInfo },
    action: { setIsLoggedIn, setToken },
  } = useAuthContext();
  const logout = () => {
    setToken({ undefined, undefined });
    setIsLoggedIn(false);
  };
  console.log(userInfo);
  return isLoggedIn ? (
    <>
      <h1>
        {userInfo?.last_name}
        {userInfo?.first_name}님,
        <br />
        환영합니다!
      </h1>
      <p onClick={logout}>로그아웃</p>
    </>
  ) : (
    <>{setTimeout(() => history.push('/signin'), 0)}</>
  );
};
export default MyPage;
