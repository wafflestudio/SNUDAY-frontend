import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navigation.css';
import { ReactComponent as MyCal } from './resources/nav-1.svg';
import { ReactComponent as Notice } from './resources/nav-2.svg';
import { ReactComponent as Search } from './resources/nav-3.svg';
import { ReactComponent as Channel } from './resources/nav-4.svg';
import { ReactComponent as MyPage } from './resources/nav-5.svg';
const Menu = ({ name, image, route }) => {
  const Icon = image;

  return (
    <div className='nav-item'>
      <Icon />
      <p>{name}</p>
    </div>
  );
};
const Navigation = () => {
  console.log(window.location.href.split('/')[3]);
  const menuList = [
    { name: '내 일정', image: MyCal, route: '/' },
    { name: '공지사항', image: Notice, route: '/notice' },
    { name: '검색', image: Search, route: '/search' },
    { name: '채널', image: Channel, route: '/channel' },
    { name: 'My Page', image: MyPage, route: '/mypage' },
  ];
  return (
    <div className='nav-container'>
      {menuList.map((menu, index) => (
        <Menu key={index} name={menu.name} image={menu.image} />
      ))}
    </div>
  );
};
export default Navigation;
