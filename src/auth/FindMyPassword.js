import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import { findUserPassword } from 'API';
import { usernamePattern, namePattern } from 'Constants';
import { InputBox } from 'Input';
import Header from 'Header';

const FindMyPassword = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const {
    value: { user },
  } = useAuthContext();
  const sendPassword = () => {
    setIsSent(() => true);
    findUserPassword({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
    })
      .then(() => {
        alert('메일이 전송되었습니다.');
        setTimeout(() => setIsSent(() => false), 60000);
      })
      .catch((error) => {
        alert(error.response.data);
        setIsSent(() => false);
      });
  };

  if (user) return <Navigate to="/mypage" replace={false} />;
  return (
    <>
      <Header>비밀번호 재발급</Header>
      <div
        className="card mobile-max-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            padding: '16px 24px',
            wordBreak: 'keep-all',
          }}
        >
          mySNU 이메일로 임시 비밀번호를 보내드립니다.
        </div>
        <form>
          <InputBox
            label="아이디"
            type="text"
            value={username}
            setValue={setUsername}
            pattern={usernamePattern}
            message="5글자 이상의 영소문자 또는 숫자"
          />
          <div className="input-fullname-container">
            <InputBox
              label="성"
              type="text"
              value={lastName}
              setValue={setLastName}
              pattern={namePattern}
              message="필수 항목"
            />
            <InputBox
              label="이름"
              type="text"
              value={firstName}
              setValue={setFirstName}
              pattern={namePattern}
              message="필수 항목"
            />
          </div>
          <InputBox
            label="mySNU 이메일"
            type="text"
            value={email}
            setValue={setEmail}
            pattern={/^[\w-.]+@snu.ac.kr$/}
            disabled={isSent}
          ></InputBox>

          <button
            disabled={
              !(
                username.match(usernamePattern) &&
                firstName.match(namePattern) &&
                lastName.match(namePattern) &&
                email.match(/^[\w-.]+@snu.ac.kr$/)
              ) || isSent
            }
            className="button-big"
            onClick={() => sendPassword()}
            style={{ width: '100%', marginTop: '10px' }}
          >
            비밀번호 받기
          </button>
        </form>
      </div>
    </>
  );
};
export default FindMyPassword;
