import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNotice from 'channel/AddNotice';
import { getNotice, deleteNotice as deleteNoticeAPI } from 'API';
import { getUser } from 'API';
import { useAuthContext } from 'context/AuthContext';
import Header from 'Header';
import Tag from 'Tag';
const Notice = ({
  match: {
    params: { channelId, noticeId },
  },
}) => {
  channelId = parseInt(channelId);
  noticeId = parseInt(noticeId);
  const [notice, setNotice] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const {
    value: { userInfo },
  } = useAuthContext();
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
    getNotice({ channelId, noticeId }).then((response) => {
      setNotice(response);
      console.log(response);
    });
    window.scrollTo(0, 0);
  }, [isModifying]);
  console.log(findURL(notice?.contents));
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
      {notice ? (
        <div className="card">
          <div className="notice-info">
            <Tag
              id={notice.channel}
              name={notice.channel_name}
              onClick={() => navigate(`/channel/${notice.channel}`)}
            />
            <h3>{notice?.title}</h3>
            <div>
              {new Date(notice.created_at).toLocaleString('ko-kr').slice(0, -3)}
            </div>
            <div className="grey-text">{notice.writer_name}</div>
          </div>
          <div className="notice-content">{findURL(notice.contents)}</div>
          {userInfo?.managing_channels.has(channelId) ? (
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
const addATag = (string) => <a href={string}>string</a>;
const findURL = (string) => {
  if (typeof string !== 'string') return;
  const arr = [];
  let result;
  let lastIndex = 0;
  const reURL = /https?:\/\/[\S]+\.[\S]+/g;
  console.log(string?.split(reURL));
  while ((result = reURL.exec(string)) !== null) {
    console.log(result);
    console.log(reURL.lastIndex);
    arr.push(string.slice(lastIndex, result.index));
    arr.push(<a href={result[0]}>{result[0]}</a>);
    lastIndex = reURL.lastIndex;
  }
  arr.push(string.slice(lastIndex));
  console.log(arr);
  return arr;
  return string?.replaceAll(reURL, `<a href='$&'>$&</a>`);
};
export default Notice;
