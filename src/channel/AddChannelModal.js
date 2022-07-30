import { useEffect, useReducer, useState } from 'react';
import Modal from 'Modal';
import { ReactComponent as ClosedLock } from 'resources/lock-closed.svg';
import { ReactComponent as OpenLock } from 'resources/lock-open.svg';
import {
  addChannel,
  patchChannel,
  checkDuplicateID,
  getChannel,
  searchUser,
} from 'API';
import { useAuthContext } from 'context/AuthContext';
import { ReactComponent as XButton } from 'resources/x.svg';

const ImageSelector = ({ image, setImage }) => {
  console.log('image', image);
  return (
    <label
      style={{
        position: 'relative',
        width: '66px',
        height: '66px',
        margin: '1rem',
      }}
    >
      <img
        className="avatar"
        src={
          image
            ? typeof image === 'string'
              ? image
              : URL.createObjectURL(image)
            : '/resources/default-image.svg'
        }
      ></img>
      <img
        style={{ position: 'absolute', bottom: 0, right: 0 }}
        src="/resources/button-add-small.svg"
      />
      <input
        hidden
        id="profile-picture-input"
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          console.log(e.target);
          if (e.target.files.length) setImage(e.target.files[0]);
        }}
      />
    </label>
  );
};
const AddChannelModalContent = ({ channel, setChannel }) => {
  const { name, description, is_private, image, managers } = channel;
  const X = XButton;
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [userSearchList, setUserSearchList] = useState([]);
  useEffect(() => {
    if (selectedUser) setUsername(selectedUser);
  }, [selectedUser]);
  useEffect(() => {
    username.length > 1 && selectedUser !== username
      ? searchUser(username)
          .then((users) => users.map((user) => user.username))
          .then(setUserSearchList)
          .catch(setUserSearchList([]))
      : setSelectedUser('') || setUserSearchList([]);
    return () => console.log(username);
  }, [username]);
  const AddManager = (username) => {
    if (managers.filter((m) => m.username === username).length > 0)
      alert('이미 추가된 사용자입니다!');
    else
      checkDuplicateID(username).then((isValid) => {
        if (isValid)
          searchUser(username).then((users) => {
            for (const user of users)
              if (user.username === username) {
                setChannel({ key: 'managers', value: [...managers, user] });
                break;
              }
          });
        else {
          alert('사용자를 찾을 수 없습니다!');
          setUsername('');
        }
      });
    setUsername('');
  };
  const deleteManager = (id) => {
    setChannel({
      key: 'managers',
      value: managers.filter((manager) => id !== manager.id),
    });
  };
  return (
    <div className="event-input-container">
      <ImageSelector
        image={image}
        setImage={(file) => setChannel({ key: 'image', value: file })}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'fit-content',
          padding: '2px 10px',
          margin: '0',
          color: channel.is_private ? '#aaaaaa' : '#3b77ff',
          border: channel.is_private
            ? '1px solid var(--grey)'
            : '1px solid #3b77ff',
          borderRadius: '12px',
          fontSize: '0.8rem',
          transition: 'none',
        }}
        onClick={() =>
          setChannel({ key: 'is_private', value: !channel.is_private })
        }
      >
        {channel.is_private ? (
          <>
            <ClosedLock />
            <span style={{ fontSize: '0.8rem', paddingLeft: '5px' }}>
              비공개
            </span>
          </>
        ) : (
          <>
            <OpenLock />
            <span style={{ fontSize: '0.8rem', paddingLeft: '5px' }}>공개</span>
          </>
        )}
      </div>
      <input
        className="input-flat input-title"
        type="text"
        placeholder="채널 이름"
        value={channel.name}
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
      {/* <span
        style={{
          paddingLeft: '16px',
          margin: 0,
          fontWeight: 'bold',
        }}
      >
        매니저
      </span>
      <ul className="userlist">
        {managers.map((manager) => (
          <li key={manager.id}>
            {manager.username}
            {userInfo.username === manager.username ? (
              <></>
            ) : (
              <X onClick={() => deleteManager(manager.id)} />
            )}
          </li>
        ))}
      </ul>
      <InputButtonBox
        name="추가"
        submit={(e) => {
          e.preventDefault();
          AddManager(username);
        }}
        type="text"
        value={username}
        setValue={setUsername}
        style={{
          height: '2.5rem',
          borderRadius: '1.25rem',
          marginLeft: '1rem',
          width: 'calc(100% - 1rem)',
        }}
        pattern={usernamePattern}
      >
        {userSearchList.length ? (
          <ul
            className="userlist dropdown"
            style={{
              marginLeft: '1rem',
              boxShadow: '0 0 5px var(--grey-light)',
            }}
          >
            {userSearchList.map((user) => (
              <li
                onClick={() => {
                  setSelectedUser(user);
                }}
              >
                {user}
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </InputButtonBox> */}
    </div>
  );
};
const AddChannelModalButton = ({ sendChannel, name }) => {
  return (
    <div>
      <hr />
      <button className="button-save" onClick={sendChannel}>
        {name}
      </button>
    </div>
  );
};
export const EditChannelModal = ({ isActive, channelId }) => {
  const [channel, setChannel] = useState(null);
  useEffect(() => {
    getChannel(channelId).then((channel) => {
      setChannel({
        managers_id: channel.managers.username, //channel.managers.map((m) => m.id),
        ...channel,
      });
    });
  }, []);
  return channel ? (
    <AddChannelModal isActive={isActive} init={channel} />
  ) : (
    <></>
  );
};
const AddChannelModal = ({ isActive, init }) => {
  console.log(init);
  const {
    value: { userInfo },
    action: { initUserInfo },
  } = useAuthContext();
  console.table(userInfo);
  const initialState = init ?? {
    name: '',
    description: '',
    managers_id: userInfo.username, //[userInfo],
    is_private: false,
    image: null,
    //is_official:false
  };
  const reducer = (state, action) => {
    console.log(state, action);
    const key = action.key;
    const value = action.value;
    if (key in state) {
      let newState = { ...state, [key]: value };
      return newState;
    }
  };
  const [channel, setChannel] = useReducer(reducer, initialState);
  const postChannel = () => {
    const channelData = {
      ...channel,
      name: channel.name.trim(),
      // managers_id: channel.managers, //.map((m) => m.username),
    };
    // delete channelData.managers;
    //FIXIT: image upload error
    if (!(channelData.image instanceof Blob)) delete channelData.image;
    // delete channelData.image;
    console.log(channelData);
    const sendChannel = init ? patchChannel : addChannel;

    let formData = new FormData();
    for (let key in channelData) {
      if (channelData[key] === undefined) continue;
      if (key === 'image')
        formData.append(key, channelData[key], channelData[key].name);
      else
        formData.append(
          key,
          Array.isArray(channelData[key])
            ? JSON.stringify(channelData[key])
            : channelData[key]
        );
    }
    console.log([...formData.entries()]);
    sendChannel(formData)
      .then((data) => {
        console.log('data', data);
        alert(
          init
            ? '채널을 수정하였습니다.'
            : `${channel.name} 채널을 만들었습니다.`
        );
        initUserInfo();
        isActive(false);
      })
      .catch((e) => {
        let error = e.response.data;
        if (typeof error === 'string') {
          alert(error);
          return;
        }
        let message = '';
        for (const [key, value] of Object.entries(error)) {
          switch (key) {
            case 'name':
              message += `채널 이름: ${value}\n`;
              break;
            case 'description':
              message += `채널 소개: ${value}\n`;
              break;
            case 'error':
            case 'detail':
              message += `${value}\n`;
              break;
            default:
              message += `${key}: ${value}\n`;
          }
        }
        alert(message);
      });
  };
  return (
    <Modal
      isActive={isActive}
      header={
        <h3 className="title">{init ? '채널 정보 수정' : '새 채널 만들기'}</h3>
      }
      content={
        <AddChannelModalContent channel={channel} setChannel={setChannel} />
      }
      button={
        <AddChannelModalButton
          sendChannel={postChannel}
          name={init ? '수정하기' : '만들기'}
        />
      }
    ></Modal>
  );
};
export default AddChannelModal;
