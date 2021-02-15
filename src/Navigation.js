import './Navigation.css';
import { ReactComponent as MyCal } from './resources/nav-1.svg';
import { ReactComponent as Notice } from './resources/nav-2.svg';
import { ReactComponent as Search } from './resources/nav-3.svg';
import { ReactComponent as Channel } from './resources/nav-4.svg';
import { ReactComponent as MyPage } from './resources/nav-5.svg';
const Menu = ({ name, image }) => {
  const Icon = image;
  return (
    <div className='nav-item'>
      <Icon />
      <p>{name}</p>
    </div>
  );
};
const Navigation = () => {
  return (
    <div className='nav-container'>
      <Menu name='내 일정' image={MyCal}></Menu>
      <Menu name='공지사항' image={Notice}></Menu>
      <Menu name='검색' image={Search}></Menu>
      <Menu name='채널' image={Channel}></Menu>
      <Menu name='My Page' image={MyPage}></Menu>
    </div>
  );
};
export default Navigation;
