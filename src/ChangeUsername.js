import { useEffect, useState } from 'react';
import { InputBox } from 'Input';
import { checkDuplicateID, patchUser } from 'API';
import { usernamePattern } from 'Constants';
import Header from 'Header';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
const ChangeUsername = () => {
  const history = useHistory();
  const {
    value: { isLoggedIn },
    action: { initUserInfo },
  } = useAuthContext();
  const [username, setUsername] = useState('');
  const [isDuplicateId, setIsDuplicateId] = useState(false);
  const [] = useState(false);
  const sendUsername = () => {
    patchUser({ username })
      .then(() => {
        initUserInfo();
        alert('아이디가 변경되었습니다.');
        history.push('/mypage');
      })
      .catch(() => alert('다시 시도해주세요.'));
  };
  useEffect(() => {
    checkDuplicateID(username).then(setIsDuplicateId);
  }, [username]);
  if (!isLoggedIn) history.push('/signin');
  return (
    <>
      <Header>아이디 변경</Header>
      <div className="card">
        <div
          style={{
            fontWeight: 'bold',
            padding: '16px',
            wordBreak: 'keep-all',
          }}
        >
          변경할 아이디를 입력해주세요.
        </div>
        <InputBox
          type="text"
          value={username}
          setValue={setUsername}
          pattern={isDuplicateId ? /^$/ : usernamePattern}
          message={
            isDuplicateId
              ? '이미 사용 중인 아이디입니다.'
              : '5글자 이상의 영소문자 또는 숫자'
          }
        />
        <button
          disabled={!usernamePattern.test(username) || isDuplicateId}
          className="button-big"
          onClick={() => sendUsername()}
          style={{ width: '100%', margin: '1rem 0' }}
        >
          변경
        </button>
      </div>
    </>
  );
};
export default ChangeUsername;
