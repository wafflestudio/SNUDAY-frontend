import { useHistory } from 'react-router-dom';

const MyPage = () => {
  let history = useHistory();
  const isLoggedIn = false;
  if (!isLoggedIn) history.push('/signin');
  return <></>;
};
export default MyPage;
