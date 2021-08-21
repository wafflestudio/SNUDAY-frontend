import { useState } from 'react';
import { InputButtonBox } from './Input';
import { findUserId } from './API';
import Header from './Header';
const FindMyId = () => {
  const [address, setAddress] = useState('');
  const sendId = () => {
    findUserId(address)
      .then((response) => {
        alert('메일이 전송되었습니다.');
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };
  return (
    <>
      <Header>아이디 찾기</Header>
      <div className="card">
        <div
          style={{
            padding: '16px',
            marginBottom: '32px',
            wordBreak: 'keep-all',
          }}
        >
          mySNU 이메일로 가입하신 아이디를 보내드려요.
        </div>
        <InputButtonBox
          name="전송"
          submit={sendId}
          value={address}
          setValue={setAddress}
          pattern={/^[\w-.]+@snu.ac.kr$/}
        ></InputButtonBox>
      </div>
    </>
  );
};
export default FindMyId;
