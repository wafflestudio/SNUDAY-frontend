import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserNotices, getChannelNotices, searchUserNotices } from './API';
import { useAuthContext } from './context/AuthContext';
import Tag from './Tag';
const NoticeCard = ({ notice, includeChannelName }) => {
  const history = useHistory();
  return (
    <li
      onClick={() =>
        history.push(`/channel/${notice.channel}/notice/${notice.id}`)
      }
    >
      {includeChannelName ? <Tag id={notice.channel} /> : <></>}
      <div className="notice-list-title">{notice.title}</div>
      <div className="notice-list-date">
        {new Date(notice.created_at).toLocaleDateString()}
      </div>
    </li>
  );
};
const NoticeList = ({ channelId, type, keyword, limit, ...rest }) => {
  const [notices, setNotices] = useState(null);
  const [cursor, setCursor] = useState(1);
  const {
    value: { isLoggedIn, userInfo },
  } = useAuthContext();
  useEffect(() => {
    if (channelId)
      getChannelNotices({ id: channelId, cursor }).then((response) => {
        setNotices(() => response.results);
        console.log(response);
      });
    else if (isLoggedIn && userInfo)
      if (keyword)
        searchUserNotices({ type, q: keyword })
          .then((response) => {
            setNotices(() => response.results);
            console.log(response);
          })
          .catch((error) => {
            setNotices(() => null);
          });
      else
        getUserNotices({ cursor }).then((response) => {
          setNotices(() => response.results);
          console.log(response);
        });
  }, [type, keyword]);
  return notices ? (
    notices.length !== 0 ? (
      <ul className="notice-list" {...rest}>
        {notices.slice(0, limit).map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            includeChannelName={!channelId}
          />
        ))}
      </ul>
    ) : (
      <div className="error">공지사항이 없습니다.</div>
    )
  ) : (
    <div className="error"></div>
  );
};
export default NoticeList;
