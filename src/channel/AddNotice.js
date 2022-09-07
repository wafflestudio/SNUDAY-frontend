import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchNotice, postNotice } from 'API';
import Header from 'Header';
import { InputBox } from 'Input';

const AddNotice = ({
  channelId,
  noticeId,
  setIsDone,
  title: t,
  contents: c,
}) => {
  const [title, setTitle] = useState(t ?? '');
  const [contents, setContents] = useState(c ?? '');
  const saveNotice = () => {
    return noticeId
      ? patchNotice({ title, contents, channelId, noticeId }).then(
          (response) => {
            alert('공지가 수정되었습니다.');
            return response;
          }
        )
      : postNotice({ title, contents, channelId }).then((response) => response);
  };
  const queryClient = useQueryClient();
  const { mutate: updateNotice } = useMutation(saveNotice, {
    onSuccess: (notice) => {
      queryClient.setQueryData(['notice', noticeId], notice);
      setIsDone(true);
    },
  });
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
        <button
          className="button-big"
          onClick={updateNotice}
          disabled={!title.trim() || !contents.trim()}
        >
          {noticeId ? '수정하기' : '올리기'}
        </button>
      </div>
    </>
  );
};
export default AddNotice;
