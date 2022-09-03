import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getUserNotices, getChannelNotices, searchUserNotices } from 'API';
import { useAuthContext } from 'context/AuthContext';
import useInfiniteScroll from 'useInfiniteScroll';
import Tag from 'Tag';
import Spinner from 'Spinner';
const NoticeCard = ({ notice, includeChannelName }) => {
  const navigate = useNavigate();
  return (
    <li
      className={`selectable card notice-card ${notice ? '' : 'loading'}`}
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
      <div className="notice-list-title">{notice?.title ?? '제목'}</div>
      <time className="notice-list-date" dateTime={notice?.created_at}>
        {notice
          ? new Date(notice.created_at).toLocaleDateString()
          : '0000.00.00.'}
      </time>
    </li>
  );
};
const useNotices = ({ channelId, type, keyword }) => {
  const {
    value: { user },
  } = useAuthContext();
  const [prev, setPrev] = useState(undefined);
  const queryClient = useQueryClient();
  let getNotices;
  if (channelId)
    getNotices = ({ pageParam }) =>
      getChannelNotices({ id: channelId, cursor: pageParam });
  else if (user)
    if (keyword)
      getNotices = ({ pageParam }) =>
        searchUserNotices({ type, q: keyword, cursor: pageParam });
    else
      getNotices = ({ pageParam }) => {
        console.log(pageParam);
        return getUserNotices({ cursor: pageParam });
      };
  else getNotices = () => Promise.reject('invalid parameter');

  return useInfiniteQuery(
    ['notices', { channelId, type, keyword }],
    getNotices,
    {
      onSuccess: (response) => {
        response.pages
          .at(-1)
          .results.forEach((notice) =>
            queryClient.setQueryData(['notice', notice.id], notice)
          );
      },
      onError: () => setPrev(),
      getNextPageParam: (lastPage, pages) => lastPage.next,
    }
  );
};
const NoticeList = ({ channelId, type, keyword, limit, ...rest }) => {
  const listRef = useRef(null);
  const notices = useNotices({
    channelId,
    type,
    keyword,
  });
  const results = notices.data?.pages.map((page) => page.results).flat(1);
  const [isFetching, setIsFetching] = useInfiniteScroll(
    notices.hasNextPage ? notices.fetchNextPage : undefined,
    listRef.current
  ); //??

  return (
    <ul ref={listRef} className="notice-list" {...rest}>
      {!results ? (
        [...Array(limit ?? 10)].map((v, i) => (
          <NoticeCard key={i} includeChannelName={!channelId} />
        ))
      ) : results.length === 0 ? (
        <div className="error">공지사항이 없습니다.</div>
      ) : (
        results
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
