import { useState } from 'react';
import { InputBox } from './Input';
import { patchUserPassword } from './API';
import { pwPattern } from './Constants';
import Header from './Header';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
const ChangePassword = () => {
  const history = useHistory();
  const {
    value: { isLoggedIn },
    action: { initUserInfo },
  } = useAuthContext();
  const [oldPw, setOldPw] = useState('');
  const [pw, setPw] = useState('');
  const [pwAgain, setPwAgain] = useState('');

  const sendPassword = () => {
    patchUserPassword({ old_password: oldPw, new_password: pw })
      .then((response) => {
        initUserInfo();
        alert('비밀번호가 변경되었습니다.');
        history.push('/mypage');
      })
      .catch(() => alert('다시 시도해주세요.'));
  };
  if (!isLoggedIn) history.push('/signin');
  return (
    <>
      <Header>비밀번호 변경</Header>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* <div
          style={{
            fontWeight: 'bold',
            padding: '16px',
            wordBreak: 'keep-all',
          }}
        >
          변경할 비밀번호를 입력해주세요.
        </div> */}
        <form>
          <InputBox
            label="기존 비밀번호"
            type="password"
            value={oldPw}
            setValue={setOldPw}
            pattern={pwPattern}
          />
          <InputBox
            label="새 비밀번호"
            type="password"
            value={pw}
            setValue={setPw}
            pattern={pwPattern}
            message="8자 이상의 숫자와 영문자"
          />
          <InputBox
            label="새 비밀번호 확인"
            type="password"
            value={pwAgain}
            setValue={setPwAgain}
            pattern={'^' + pw + '$'}
            message="비밀번호가 일치하지 않습니다."
          />
          <button
            disabled={!(pw.match(pwPattern) && pw === pwAgain)}
            className="button-big"
            onClick={() => sendPassword()}
            style={{ width: '100%', marginTop: '100px' }}
          >
            변경
          </button>
        </form>
      </div>
    </>
  );
};
export default ChangePassword;
