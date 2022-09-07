import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotice, deleteNotice as deleteNoticeAPI } from 'API';
import { useAuthContext } from 'context/AuthContext';
import { parseURL } from 'Constants';
import AddNotice from 'channel/AddNotice';
import Header from 'Header';
import Tag from 'Tag';
const Notice = () => {
  let { channelId, noticeId } = useParams();
  channelId = +channelId;
  noticeId = +noticeId;
  const [isModifying, setIsModifying] = useState(false);
  const {
    value: { user },
  } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: notice, isLoading } = useQuery(
    ['notice', noticeId],
    () => getNotice({ channelId, noticeId }),
    {
      onSuccess: (notice) => {
        document.title = notice.title + ' | SNUDAY';
      },
    }
  );
  const { mutate: updateNotice } = useMutation(
    () => getNotice({ channelId, noticeId }),
    {
      onSuccess: (notice) => {
        queryClient.setQueryData(['notice', noticeId], notice);
      },
    }
  );
  const navigate = useNavigate();
  const deleteNotice = () => {
    const confirm = window.confirm('정말 공지를 삭제할까요?');
    if (confirm)
      deleteNoticeAPI({ channelId, noticeId }).then((response) => {
        alert('공지가 삭제되었습니다.');
        navigate(`/channel/${channelId}/notice`);
      });
  };
  useEffect(() => {
    if (!isModifying) updateNotice();
    window.scrollTo(0, 0);
  }, [isModifying]);
  console.log(parseURL(notice?.contents));
  // if (isLoading) return <></>;
  return isModifying ? (
    <AddNotice
      channelId={channelId}
      noticeId={noticeId}
      title={notice.title}
      contents={notice.contents}
      setIsDone={(done) => setIsModifying(!done)}
    />
  ) : (
    <>
      <Header>공지</Header>
      <div className="card main-container">
        {notice ? (
          <>
            <div className="notice-info">
              <Tag
                id={notice.channel}
                name={notice.channel_name}
                onClick={() => navigate(`/channel/${notice.channel}`)}
              />
              <h3>{notice?.title}</h3>
              <time dateTime={notice.created_at}>
                {new Date(notice.created_at)
                  .toLocaleString('ko-kr')
                  .slice(0, -3)}
              </time>
              <div style={{ color: 'var(--grey-text)' }}>
                {notice.writer_name}
              </div>
            </div>
            <div className="notice-content">{parseURL(notice.contents)}</div>
            {user?.managing_channels.has(channelId) ? (
              <div className="notice-menu">
                <button
                  className="button-big button-delete"
                  onClick={deleteNotice}
                >
                  삭제
                </button>
                <button
                  className="button-big"
                  onClick={() => setIsModifying(true)}
                >
                  수정
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default Notice;
