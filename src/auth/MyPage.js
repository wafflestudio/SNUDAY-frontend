import { useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import axios from 'axios';
import Header from 'Header';
const MyPage = () => {
  let history = useHistory();
  const {
    value: { isLoggedIn, userInfo },
    action: { setIsLoggedIn, setToken },
  } = useAuthContext();
  const logout = () => {
    delete axios.defaults.headers['Authorization'];
    localStorage.removeItem('refresh');
    setToken({ access: undefined, refresh: undefined });
    setIsLoggedIn(false);
  };
  console.log(userInfo);
  const name =
    isLoggedIn && userInfo
      ? /[a-zA-Z]+/.test(userInfo.last_name + userInfo.first_name)
        ? `${userInfo.first_name} ${userInfo.last_name}`
        : userInfo.last_name + userInfo.first_name
      : undefined;
  return isLoggedIn && userInfo ? (
    <>
      <Header left={<></>}>My Page</Header>
      <div className="main-container">
        <div className="card">
          <header className="card-header card-header-small">계정</header>
          <ul className="menu-list">
            <li>
              <div>{`${name} 님`}</div>
              <div>{userInfo.username}</div>
            </li>
            <li onClick={() => history.push('/mypage/ChangeId')}>
              아이디 변경{' '}
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li onClick={() => history.push('/mypage/ChangePw')}>
              비밀번호 변경{' '}
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li onClick={logout}>로그아웃</li>
          </ul>
        </div>
        <div className="card">
          <header className="card-header card-header-small">정보</header>
          <ul className="menu-list">
            <li>
              서비스 이용약관
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li>
              개인정보 처리방침
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  ) : (
    <>{setTimeout(() => history.push('/signin'), 0)}</>
  );
};
export default MyPage;
