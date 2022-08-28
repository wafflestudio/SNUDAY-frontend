import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuthContext } from 'context/AuthContext';
import { patchUserPassword } from 'API';
import { pwPattern } from 'Constants';
import { InputBox } from 'Input';
import Header from 'Header';

const ChangePassword = () => {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwAgain, setNewPwAgain] = useState('');
  const [navigate, location] = [useNavigate(), useLocation()];
  const queryClient = useQueryClient();
  const {
    value: { user },
  } = useAuthContext();
  const { mutate: patchPassword } = useMutation(patchUserPassword, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      alert('비밀번호가 변경되었습니다.');
      navigate('/mypage');
    },
    onError: (e) => {
      if (e.response.data.old_password) alert('비밀번호가 올바르지 않습니다.');
      else alert('다시 시도해주세요.');
    },
  });
  if (!user)
    return <Navigate to="signin" state={{ prev: location.pathname }} />;
  return (
    <>
      <Header>비밀번호 변경</Header>
      <div
        className="card main-container mobile-max-container"
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
          />
          <InputBox
            label="새 비밀번호"
            type="password"
            value={newPw}
            setValue={setNewPw}
            pattern={pwPattern}
            message="8자 이상의 숫자와 영문자"
          />
          <InputBox
            label="새 비밀번호 확인"
            type="password"
            value={newPwAgain}
            setValue={setNewPwAgain}
            pattern={'^' + newPw + '$'}
            message="비밀번호가 일치하지 않습니다."
          />
          <button
            disabled={!(newPw.match(pwPattern) && newPw === newPwAgain)}
            className="button-big"
            onClick={() =>
              patchPassword({ old_password: oldPw, new_password: newPw })
            }
            style={{ width: '100%', marginTop: '10px' }}
          >
            변경
          </button>
        </form>
      </div>
    </>
  );
};
export default ChangePassword;
