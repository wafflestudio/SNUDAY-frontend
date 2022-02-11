import { useState } from 'react';
import { InputButtonBox } from 'Input';
import { findUserId } from 'API';
import Header from 'Header';
const FindMyId = () => {
  const [address, setAddress] = useState('');
  const [isSent, setIsSent] = useState(false);
  const sendId = () => {
    setIsSent(() => true);
    findUserId(address)
      .then((response) => {
        alert('메일이 전송되었습니다.');
        setTimeout(() => setIsSent(() => false), 60000);
      })
      .catch((error) => {
        alert(error.response.data);
        setIsSent(() => false);
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
            fontWeight: 'bold',
          }}
        >
          mySNU 이메일로 가입하신 아이디를 보내드립니다.
        </div>
        <InputButtonBox
          name="전송"
          submit={sendId}
          value={address}
          setValue={setAddress}
          pattern={/^[\w-.]+@snu.ac.kr$/}
          disabled={isSent}
        ></InputButtonBox>
      </div>
    </>
  );
};
export default FindMyId;
