import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserNotices, getChannelNotices, searchUserNotices } from 'API';
import { useAuthContext } from 'context/AuthContext';
import Tag from 'Tag';
import useInfiniteScroll from 'useInfiniteScroll';
const NoticeCard = ({ notice, includeChannelName }) => {
  const history = useHistory();
  return (
    <li
      className="selectable card"
      onClick={() =>
        history.push(`/channel/${notice.channel}/notice/${notice.id}`)
      }
    >
      {includeChannelName ? (
        <Tag
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/channel/${notice.channel}`);
          }}
          id={notice.channel}
          name={notice.channel_name}
        />
      ) : (
        <></>
      )}
      <div className="notice-list-title">{notice.title}</div>
      <div className="notice-list-date">
        {new Date(notice.created_at).toLocaleDateString()}
      </div>
    </li>
  );
};
const NoticeList = ({ channelId, type, keyword, limit, ...rest }) => {
  const listRef = useRef(null);
  const [notices, setNotices] = useState(null);
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (notices?.next) fetchNotices(notices.next);
    console.log('isFetching');
  }, listRef.current);
  const {
    value: { isLoggedIn, userInfo },
  } = useAuthContext();
  const fetchNotices = async (cursor) => {
    if (channelId)
      getChannelNotices({ id: channelId, cursor }).then((response) => {
        setNotices((notices) =>
          cursor
            ? {
                ...response,
                results: [...notices.results, ...response.results],
              }
            : response
        );
      });
    else if (isLoggedIn && userInfo)
      if (keyword)
        searchUserNotices({ type, q: keyword, cursor })
          .then((response) => {
            setNotices(() =>
              cursor
                ? {
                    ...response,
                    results: [...notices.results, ...response.results],
                  }
                : response
            );
          })
          .catch((error) => {
            setNotices(() => null);
          });
      else
        getUserNotices({ cursor }).then((response) => {
          setNotices((notices) =>
            cursor
              ? {
                  ...response,
                  results: [...notices.results, ...response.results],
                }
              : response
          );
          console.log(response);
        });
  };
  useEffect(() => {
    fetchNotices();
  }, [channelId, type, keyword, limit, userInfo]);
  if (!notices?.results) return <></>;
  return (
    <ul ref={listRef} className="notice-list" {...rest}>
      {notices.results.length !== 0 ? (
        notices.results
          .slice(0, limit)
          .map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              includeChannelName={!channelId}
            />
          ))
      ) : (
        <div className="error">공지사항이 없습니다.</div>
      )}
    </ul>
  );
};
export default NoticeList;
