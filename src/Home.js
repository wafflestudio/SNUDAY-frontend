import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Calendar from './calendar/Calendar';
import { useAuthContext } from './context/AuthContext';
const Home = () => {
  useEffect(() => {
    document.title = 'SNUDAY';
  }, []);
  const navigate = useNavigate();
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  if (!isLoggedIn) navigate('/signin', { replace: true });
  return isLoggedIn ? <Calendar type="main" /> : <></>;
};
export default Home;
