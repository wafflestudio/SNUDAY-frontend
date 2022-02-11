import { useEffect } from 'react';
import { useHistory } from 'react-router';
import Calendar from './calendar/Calendar';
import { useAuthContext } from './context/AuthContext';
const Home = () => {
  useEffect(() => {
    document.title = 'SNUDAY';
  }, []);
  const history = useHistory();
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  if (!isLoggedIn) history.replace('/signin');
  return isLoggedIn ? <Calendar type="main" /> : <></>;
};
export default Home;
