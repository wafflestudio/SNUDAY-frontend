import { useHistory, useLocation } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

import './Navigation.css';
import { ReactComponent as MyCal } from './resources/nav-1.svg';
import { ReactComponent as Notice } from './resources/nav-2.svg';
import { ReactComponent as Search } from './resources/nav-3.svg';
import { ReactComponent as Channel } from './resources/nav-4.svg';
import { ReactComponent as MyPage } from './resources/nav-5.svg';
const Menu = ({ name, image, route }) => {
  const Icon = image;
  let history = useHistory();
  const location = useLocation();
  let className = 'nav-item';
  console.log(location.pathname);
  if ('/' + location.pathname.split('/')[1] === route) className += ' active';
  return (
    <div
      className={className}
      onClick={() => {
        //const currentRoute = location.pathname.split('/')[1];
        if (location.pathname !== route) {
          //if (currentRoute === 'signin' && route === 'mypage') return;
          history.push(route);
          window.scrollTo(0, 0);
        }
      }}
    >
      <Icon />
      <p>{name}</p>
    </div>
  );
};
const Navigation = () => {
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  const menuList = isLoggedIn
    ? [
        { name: '내 일정', image: MyCal, route: '/' },
        { name: '공지사항', image: Notice, route: '/notice' },
        { name: '검색', image: Search, route: '/search' },
        { name: '채널', image: Channel, route: '/channel' },
        { name: 'My Page', image: MyPage, route: '/mypage' },
      ]
    : [
        { name: '내 일정', image: MyCal, route: '/' },
        { name: '공지사항', image: Notice, route: '/notice' },
        { name: '검색', image: Search, route: '/search' },
        { name: 'My Page', image: MyPage, route: '/mypage' },
      ];
  return (
    <div className="nav-container" id="navigation-bar">
      {menuList.map((menu, index) => (
        <Menu
          key={index}
          name={menu.name}
          image={menu.image}
          route={menu.route}
        />
      ))}
    </div>
  );
};
export default Navigation;
