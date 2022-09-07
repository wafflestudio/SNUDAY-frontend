import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import { CHANNEL_SNUDAY } from 'Constants';
import Header from 'Header';
const MyPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const {
    value: { user, isLoading },
    action: { logout },
  } = useAuthContext();
  if (isLoading) return <></>;
  if (!user)
    return <Navigate to="/signin" state={{ prev: location.pathname }} />;
  const name = /[a-zA-Z]+/.test(user.last_name + user.first_name)
    ? `${user.first_name} ${user.last_name}`
    : user.last_name + user.first_name;
  return (
    <>
      <Header left={<></>}>My Page</Header>
      <div className="main-container">
        <div className="card">
          <header className="card-header card-header-small">계정</header>
          <ul className="menu-list">
            <li>
              <div>{`${name} 님`}</div>
              <div>{user.username}</div>
            </li>
            <li onClick={() => navigate('/mypage/changeId')}>
              아이디 변경{' '}
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li onClick={() => navigate('/mypage/changePw')}>
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
            <li onClick={() => navigate(`/channel/${CHANNEL_SNUDAY}/notice`)}>
              공지사항
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li onClick={() => navigate('/policy/terms')}>
              서비스 이용약관
              <img
                className="arrow"
                src="/resources/right-arrow.svg"
                alt="more"
              />
            </li>
            <li onClick={() => navigate('/policy/privacy')}>
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
  );
};
export default MyPage;
