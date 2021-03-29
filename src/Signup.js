import { useEffect, useState } from 'react';
import './Signup.css';
import { checkDuplicateID, postUser } from './API';
import {InputBox, InputButtonBox} from './Input'
const Signup = () => {
  const [id, setId] = useState('');
  const [isDuplicateId, setIsDuplicateId] = useState(false);
  const idPattern = isDuplicateId ? /^$/ : /^[a-z0-9]{5,}$/;
  const pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  const namePattern = /^[A-Za-z가-힣]+$/;
  const [pw, setPw] = useState('');
  const [pwAgain, setPwAgain] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [authNumberInput, setAuthNumberInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState({
    all: false,
    service: false,
    privacy: false,
  });
  const checkAgreement = () => {
    const { all, ...rest } = agreementChecked;
    for (const checkbox of Object.values(rest)) {
      if (!checkbox) {
        setAgreementChecked((prev) => ({ ...prev, all: false }));
        return;
      }
    }
    setAgreementChecked((prev) => ({ ...prev, all: true }));
  };
  useEffect(() => {
    checkAgreement();
  }, [agreementChecked.service, agreementChecked.privacy]);
  useEffect(() => {
    checkDuplicateID(id).then(setIsDuplicateId)
  }, [id]);
  const sendForm = (e) => {
    e.preventDefault();
    const form = {
      username: id,
      password: pw,
      first_name: firstName,
      last_name: lastName,
      email,
    };
    console.log(form);
    postUser(form).then(console.log).catch(console.log);
  };
  const sendVerification = (e) => {
    console.log('email:' + email);
  };
  const verify = () => {
    console.log('authNum:' + authNumber);
  };
  return (
    <>
      <header className='signup-header'>회원가입</header>
      <form className='signup-form'>
        <h3>스누데이에 오신 것을 환영합니다.</h3>
        <InputBox
          label='아이디'
          type='text'
          value={id}
          setValue={setId}
          pattern={idPattern}
          message={
            isDuplicateId
              ? '이미 사용 중인 아이디입니다.'
              : '5글자 이상의 영소문자 또는 숫자'
          }
        />
        <InputBox
          label='비밀번호'
          type='password'
          value={pw}
          setValue={setPw}
          pattern={pwPattern}
          message='8~16글자의 영문 대/소문자, 숫자, 특수문자'
        />
        <InputBox
          label='비밀번호 확인'
          type='password'
          value={pwAgain}
          setValue={setPwAgain}
          pattern={'^' + pw + '$'}
          message='비밀번호가 일치하지 않습니다.'
        />
        <div className='input-fullname-container'>
          <InputBox
            label='성'
            type='text'
            value={lastName}
            setValue={setLastName}
            pattern={namePattern}
            message='필수 항목'
          />
          <InputBox
            label='이름'
            type='text'
            value={firstName}
            setValue={setFirstName}
            pattern={namePattern}
            message='필수 항목'
          />
        </div>
        <InputButtonBox
          name='인증'
          submit={(e) => {
            e.preventDefault();
            sendVerification();
          }}
          label='mySNU 이메일'
          type='email'
          value={email}
          setValue={setEmail}
          pattern={/^[\w-.]+$/}
          message='구성원 인증이 필요합니다.'
        />
        <InputButtonBox
          name='확인'
          submit={(e) => {
            e.preventDefault();
            verify();
          }}
          label='인증번호'
          type='number'
          value={authNumber}
          setValue={setAuthNumber}
          pattern={/\d+/}
          message='인증 메일을 확인하세요.'
        />
        <div className='agreement-container'>
          <label className='label-agreement'>
            <input
              type='checkbox'
              checked={agreementChecked['all']}
              onChange={(e) => {
                const newState = { ...agreementChecked };
                for (const [k, v] of Object.entries(newState)) {
                  newState[k] = e.target.checked;
                }
                setAgreementChecked(() => newState);
              }}
            />
            <div>
              {`스누데이 이용약관, 개인정보 수집 및 이용에 `}
              <span style={{ textDecoration: 'underline' }}>모두 동의</span>
              합니다.
            </div>
          </label>
          <label className='label-agreement'>
            <input
              id='service'
              type='checkbox'
              checked={agreementChecked['service']}
              onChange={(e) => {
                setAgreementChecked((prev) => ({
                  ...prev,
                  service: e.target.checked,
                }));
              }}
            />
            스누데이 이용약관 동의
            <span style={{ color: '#3b77ff' }}>(필수)</span>
          </label>
          <label className='label-agreement'>
            <input
              id='privacy'
              type='checkbox'
              checked={agreementChecked['privacy']}
              onChange={(e) => {
                setAgreementChecked((prev) => ({
                  ...prev,
                  privacy: e.target.checked,
                }));
              }}
            />
            개인정보 수집 및 이용 동의
            <span style={{ color: '#3b77ff' }}>(필수)</span>
          </label>
        </div>
        <button
          disabled={!agreementChecked.all}
          className='button-big'
          onClick={(e) => sendForm(e)}
        >
          가입하기
        </button>
      </form>
    </>
  );
};
export default Signup;
