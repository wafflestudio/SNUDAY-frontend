import { useReducer, useState } from 'react';
import { InputButtonBox } from './Input';
import Modal from './Modal';
import ToggleButton from './ToggleButton';
import { ReactComponent as ClosedLock } from './resources/lock-closed.svg';
import { ReactComponent as OpenLock } from './resources/lock-open.svg';
import { addChannel, checkDuplicateID } from './API';
import { useAuthContext } from './context/AuthContext';
import { ReactComponent as XButton } from './resources/x.svg';
import { idPattern } from './Constants';
const AddChannelModalHeader = () => {
  return (
    <>
      <h3 className="title">새로운 채널 만들기</h3>
    </>
  );
};
const ImageSelector = ({ url, setUrl }) => {
  const setImage = () => {
    const input = prompt('채널 이미지로 쓰일 사진의 URL을 입력하세요.');
    setUrl(input);
  };
  return (
    <div
      onClick={setImage}
      style={{ position: 'relative', width: '66px', margin: '1rem' }}
    >
      <img
        className="channel-card-image"
        src={url ? url : '/resources/logo.svg'}
      ></img>
      <img
        style={{ position: 'absolute', bottom: 0, right: 0 }}
        src="/resources/button-add-small.svg"
      />
    </div>
  );
};
const AddChannelModalContent = ({ channel, setChannel }) => {
  const { name, description, is_private, image, managers_id } = channel;
  const X = XButton;
  const {
    value: { isLoggedIn, userInfo },
  } = useAuthContext();
  const [id, setId] = useState('');
  const AddManager = (id) => {
    if (managers_id.includes(id) || (isLoggedIn && userInfo.username === id))
      alert('이미 추가된 사용자입니다!');
    else
      checkDuplicateID(id).then((isValid) => {
        if (isValid)
          setChannel({ key: 'managers_id', value: [...managers_id, id] });
        else {
          alert('사용자를 찾을 수 없습니다!');
          setId('');
        }
      });
    setId('');
  };
  const deleteManager = (id) => {
    setChannel({
      key: 'managers_id',
      value: managers_id.filter((mId) => id !== mId),
    });
  };
  return (
    <div className="event-input-container">
      <ImageSelector
        url={image}
        setUrl={(url) => setChannel({ key: 'image', value: url })}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '4.5rem',
          padding: '2px 10px',
          margin: '0',
          color: channel.is_private ? '#aaaaaa' : '#3b77ff',
          border: channel.is_private
            ? '1px solid #b8b8b8'
            : '1px solid #3b77ff',
          borderRadius: '12px',
          fontSize: '0.8rem',
        }}
        onClick={() =>
          setChannel({ key: 'is_private', value: !channel.is_private })
        }
      >
        {channel.is_private ? (
          <>
            <ClosedLock />
            {` 비공개`}
          </>
        ) : (
          <>
            <OpenLock />
            {` 공개`}
          </>
        )}
      </div>
      <input
        className="input-flat input-title"
        type="text"
        placeholder="채널 이름"
        value={channel.title}
        onChange={(e) => setChannel({ key: 'name', value: e.target.value })}
      ></input>
      <textarea
        className="event-memo"
        placeholder="채널 소개"
        value={channel.description}
        onChange={(e) =>
          setChannel({ key: 'description', value: e.target.value })
        }
      ></textarea>
      <span
        style={{
          paddingLeft: '16px',
          margin: 0,
          fontWeight: 'bold',
        }}
      >
        매니저
      </span>
      <ul className="userlist">
        {managers_id.map((id) => (
          <li key={id}>
            {id}
            {userInfo.username === id ? (
              <></>
            ) : (
              <X onClick={() => deleteManager(id)} />
            )}
          </li>
        ))}
      </ul>
      <InputButtonBox
        name="추가"
        submit={(e) => {
          e.preventDefault();
          AddManager(id);
        }}
        type="text"
        value={id}
        setValue={setId}
        style={{
          height: '2.5rem',
          marginLeft: '1rem',
          width: 'calc(100% - 1rem)',
        }}
        pattern={idPattern}
        //message='구성원 인증이 필요합니다.'
      />
    </div>
  );
};
const AddChannelModalButton = ({ addChannel }) => {
  return (
    <div>
      <hr />
      <button className="button-save" onClick={addChannel}>
        만들기
      </button>
    </div>
  );
};
const AddChannelModal = ({ isActive }) => {
  const {
    value: { userInfo },
  } = useAuthContext();
  console.table(userInfo);
  const initialState = {
    name: '',
    description: '',
    managers_id: [userInfo.username],
    is_private: true,
    image: '',
    //is_official:false
  };
  const reducer = (state, action) => {
    console.log(state, action);
    const key = action.key;
    const value = action.value;
    if (key in state) {
      let newState = { ...state };
      newState[key] = value;
      return newState;
    }
  };
  const [channel, setChannel] = useReducer(reducer, initialState);
  const postChannel = () => {
    console.table(channel);
    addChannel(channel).then((data) => {
      console.log('data', data);
      alert(`${channel.name} 채널을 만들었습니다.`);
      isActive(false);
    });
  };
  return (
    <Modal
      isActive={isActive}
      header={<AddChannelModalHeader />}
      content={
        <AddChannelModalContent channel={channel} setChannel={setChannel} />
      }
      button={<AddChannelModalButton addChannel={postChannel} />}
    ></Modal>
  );
};
export default AddChannelModal;
