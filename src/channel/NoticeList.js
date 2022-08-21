import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserNotices, getChannelNotices, searchUserNotices } from 'API';
import { useAuthContext } from 'context/AuthContext';
import Tag from 'Tag';
import useInfiniteScroll from 'useInfiniteScroll';
const NoticeCard = ({ notice, includeChannelName }) => {
  const navigate = useNavigate();
  return (
    <li
      className="selectable card"
      onClick={() => {
        if (notice) navigate(`/channel/${notice.channel}/notice/${notice.id}`);
      }}
    >
      {includeChannelName && notice ? (
        <Tag
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/channel/${notice.channel}`);
          }}
          id={notice.channel}
          name={notice.channel_name}
        />
      ) : (
        <></>
      )}
      <div className="notice-list-title">{notice?.title}</div>
      <time className="notice-list-date" datetime={notice.created_at}>
        {notice ? new Date(notice.created_at).toLocaleDateString() : ''}
      </time>
    </li>
  );
};
const NoticeList = ({ channelId, type, keyword, limit, ...rest }) => {
  const listRef = useRef(null);
  const [notices, setNotices] = useState(null);
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (notices?.next) fetchNotices(notices.next);
    console.log('isFetching');
  }, listRef.current); //??
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
  // if (!notices?.results)
  //   return (
  //     // <ul className="notice-list loading">
  //     //   {[...Array(limit ?? 0)].map(() => (
  //     //     <NoticeCard />
  //     //   ))}
  //     // </ul>
  //     <div className="error"></div>
  //   );
  return (
    <ul ref={listRef} className="notice-list" {...rest}>
      {!notices?.results ? (
        <div className="error"></div>
      ) : notices.results.length === 0 ? (
        <div className="error">공지사항이 없습니다.</div>
      ) : (
        notices.results
          .slice(0, limit)
          .map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              includeChannelName={!channelId}
            />
          ))
      )}
    </ul>
  );
};
export default NoticeList;
