import { useHistory } from 'react-router';
import Calendar from './calendar/Calendar';
import { useAuthContext } from './context/AuthContext';
const Home = () => {
  const history = useHistory();
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  if (!isLoggedIn) history.replace('/signin');
  return isLoggedIn ? <Calendar /> : <></>;
};
export default Home;
