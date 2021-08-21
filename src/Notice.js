import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddNotice from './AddNotice';
import { getNotice, deleteNotice as deleteNoticeAPI } from './API';
import { getUser } from './API';
import Header from './Header';
const Notice = ({
  match: {
    params: { channelId, noticeId },
  },
}) => {
  const [notice, setNotice] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const history = useHistory();
  const deleteNotice = () => {
    const confirm = window.confirm('정말 공지를 삭제할까요?');
    if (confirm)
      deleteNoticeAPI({ channelId, noticeId }).then((response) => {
        alert('공지가 삭제되었습니다.');
        history.push(`/channel/${channelId}/notice`);
      });
  };
  useEffect(() => {
    getNotice({ channelId, noticeId }).then((response) => {
      setNotice(response);
    });
    window.scrollTo(0, 0);
  }, [isModifying]);
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
      <Header>공지 보기</Header>
      {notice ? (
        <div className="card">
          <div className="notice-header">
            <h3>{notice?.title}</h3>
            <div>
              {new Date(notice?.created_at)
                .toLocaleString('ko-kr')
                .slice(0, -3)}
            </div>
            <div className="grey-text">{notice?.username}</div>
          </div>
          <div className="notice-content">{notice?.contents}</div>
          <div className="notice-menu">
            <button className="button-big button-grey" onClick={deleteNotice}>
              삭제
            </button>
            <button className="button-big" onClick={() => setIsModifying(true)}>
              수정
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Notice;
