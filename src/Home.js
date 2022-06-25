import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Calendar from './calendar/Calendar';
import { useAuthContext } from './context/AuthContext';
const Home = () => {
  useEffect(() => {
    document.title = 'SNUDAY';
  }, []);
  return <Calendar type="main" />;
};
export default Home;
