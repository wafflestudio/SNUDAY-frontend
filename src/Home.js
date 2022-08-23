import { useEffect } from 'react';
import Calendar from './calendar/Calendar';
const Home = () => {
  useEffect(() => {
    document.title = 'SNUDAY';
  }, []);
  return <Calendar type="main" />;
};
export default Home;
