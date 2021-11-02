import Header from 'Header';
import { useEffect, useRef, useState } from 'react';
import { InputBox } from 'Input';
import { patchNotice, postNotice } from 'API';

const AddNotice = ({
  channelId,
  noticeId,
  setIsDone,
  title: t,
  contents: c,
}) => {
  const [title, setTitle] = useState(t ? t : '');
  const [contents, setContents] = useState(c ? c : '');
  const saveNotice = () => {
    noticeId
      ? patchNotice({ title, contents, channelId, noticeId }).then(
          (response) => {
            alert('공지가 수정되었습니다.');
            setIsDone(true);
          }
        )
      : postNotice({ title, contents, channelId }).then((response) => {
          console.log(response);
          setIsDone(true);
        });
  };
  // const contentsRef = useRef(null);
  // useEffect(() => {
  //   contentsRef.current.height = '';
  //   contentsRef.current.style.height = contentsRef.current.scrollHeight + 'px';
  // }, [contents]);
  return (
    <>
      <Header
        left={
          <img
            src="/resources/arrow-back.svg"
            alt="back to previous page"
            className="header-left"
            onClick={() => setIsDone(true)}
          />
        }
      >
        {noticeId ? '공지 수정하기' : '공지 올리기'}
      </Header>
      <div className="channel-add-notice">
        <InputBox value={title} setValue={setTitle} placeholder="제목" />
        {/* <span
          className="input-round"
          role="textbox"
          onChange={(e) => setTitle(e.target.value)}
        >
          {title}
        </span> */}
        <textarea
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder="내용"
        />
        <button className="button-big" onClick={saveNotice}>
          {noticeId ? '수정하기' : '올리기'}
        </button>
      </div>
    </>
  );
};
export default AddNotice;
