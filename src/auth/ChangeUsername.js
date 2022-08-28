import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useAuthContext } from 'context/AuthContext';
import { checkDuplicateID, patchUser } from 'API';
import { usernamePattern } from 'Constants';
import { InputBox } from 'Input';
import Header from 'Header';

const ChangeUsername = () => {
  const [username, setUsername] = useState('');
  const [isDuplicateId, setIsDuplicateId] = useState(false);
  const [navigate, location] = [useNavigate(), useLocation()];
  const queryClient = useQueryClient();
  const {
    value: { user },
  } = useAuthContext();
  const { mutate: patchUsername } = useMutation(patchUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      alert('아이디가 변경되었습니다.');
      navigate('/mypage');
    },
    onError: () => alert('다시 시도해주세요.'),
  });
  useEffect(() => {
    checkDuplicateID(username).then(setIsDuplicateId);
  }, [username]);
  if (!user)
    return <Navigate to="signin" state={{ prev: location.pathname }} />;
  return (
    <>
      <Header>아이디 변경</Header>
      <div className="card main-container mobile-max-container">
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
          onClick={() => patchUsername({ username })}
          style={{ width: '100%', marginTop: '10px' }}
        >
          변경
        </button>
      </div>
    </>
  );
};
export default ChangeUsername;
