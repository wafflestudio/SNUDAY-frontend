import { useEffect, useState } from 'react';
import './Signup.css';
import {
  checkDuplicateID,
  postUser,
  sendAuthEmail,
  verifyAuthEmail,
} from 'API';
import { InputBox, InputButtonBox } from 'Input';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Uncheckedbox } from 'resources/checkbox_unchecked.svg';
import {
  usernamePattern,
  pwPattern,
  namePattern,
  emailPattern,
  authNumberPattern,
} from 'Constants';
import Header from 'Header';
const Signup = () => {
  const history = useHistory();
  const [id, setId] = useState('');
  const [isDuplicateId, setIsDuplicateId] = useState(false);
  const [pw, setPw] = useState('');
  const [pwAgain, setPwAgain] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [authNumber, setAuthNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState({
    all: false,
    service: false,
    privacy: false,
  });
  const checkValidForm = () => {
    return (
      !isDuplicateId &&
      id.match(usernamePattern) &&
      pw.match(pwPattern) &&
      pw === pwAgain &&
      firstName.match(namePattern) &&
      lastName.match(namePattern) &&
      email.match(emailPattern) &&
      isVerified
    );
  };
  const checkAgreement = () => {
    const { all, ...rest } = agreementChecked;
    for (const checkbox of Object.values(rest))
      if (!checkbox) {
        setAgreementChecked((prev) => ({ ...prev, all: false }));
        return;
      }

    setAgreementChecked((prev) => ({ ...prev, all: true }));
  };
  useEffect(() => {
    checkAgreement();
  }, [agreementChecked.service, agreementChecked.privacy]);
  useEffect(() => {
    checkDuplicateID(id).then(setIsDuplicateId);
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
    postUser(form)
      .then((response) => {
        alert('가입을 축하합니다!');
        history.push('/signin');
      })
      .catch((error) => {
        alert(Object.values(error.response.data));
      });
  };
  const sendVerification = (addr) => {
    setIsSent(() => true);
    sendAuthEmail(addr)
      .then((response) => {
        alert(response);
        setTimeout(() => setIsSent(() => false), 60000);
      })
      .catch((error) => {
        console.log(error);
        setIsSent(() => false);
      });
  };
  const verify = () => {
    console.log('authNum:' + authNumber);
  };
  return (
    <>
      <Header>회원가입</Header>
      <form className="card signup-form">
        <h3>SNUDAY에 오신 것을 환영합니다.</h3>
        <InputBox
          label="아이디"
          type="text"
          value={id}
          setValue={setId}
          pattern={isDuplicateId ? /^$/ : usernamePattern}
          message={
            isDuplicateId
              ? '이미 사용 중인 아이디입니다.'
              : '5글자 이상의 영소문자 또는 숫자'
          }
        />
        <InputBox
          label="비밀번호"
          type="password"
          value={pw}
          setValue={setPw}
          pattern={pwPattern}
          message="8자 이상의 숫자와 영문자"
        />
        <InputBox
          label="비밀번호 확인"
          type="password"
          value={pwAgain}
          setValue={setPwAgain}
          pattern={'^' + pw + '$'}
          message="비밀번호가 일치하지 않습니다."
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
        <InputButtonBox
          name={'인증'}
          submit={(e) => {
            e.preventDefault();
            sendVerification(email);
          }}
          label="mySNU 이메일"
          type="email"
          value={email}
          setValue={setEmail}
          pattern={/^[\w-.]+@snu.ac.kr$/}
          disabled={isSent || isVerified}
          message="구성원 인증이 필요합니다."
        />
        <InputButtonBox
          name={isVerified ? '완료' : '확인'}
          submit={(e) => {
            e.preventDefault();
            verifyAuthEmail(email, authNumber)
              .then((response) => {
                setIsVerified(true);
              })
              .catch((error) => {
                console.log(error);
                alert('인증번호를 다시 확인해주세요.');
              });
          }}
          label="인증번호"
          type="text"
          value={authNumber}
          setValue={(v) => {
            if (!isVerified && v.match(/^[a-zA-Z0-9]*$/) && v.length <= 6)
              setAuthNumber(v.toUpperCase());
          }}
          pattern={authNumberPattern}
          disabled={isVerified}
          message="인증 메일을 확인하세요."
        />
        <div className="agreement-container">
          <label className="label-agreement">
            <input
              type="checkbox"
              checked={agreementChecked['all']}
              onChange={(e) => {
                const newState = { ...agreementChecked };
                for (const [k, v] of Object.entries(newState))
                  newState[k] = e.target.checked;

                setAgreementChecked(() => newState);
              }}
            />
            <Uncheckedbox className="checkmark" />
            <div>
              {`스누데이 이용약관, 개인정보 수집 및 이용에 `}
              <u>모두 동의</u>
              합니다.
            </div>
          </label>
          <label className="label-agreement">
            <input
              id="service"
              type="checkbox"
              checked={agreementChecked['service']}
              onChange={(e) => {
                setAgreementChecked((prev) => ({
                  ...prev,
                  service: e.target.checked,
                }));
              }}
            />
            <Uncheckedbox className="checkmark" />
            스누데이 이용약관 동의
            <span style={{ color: '#3b77ff' }}>(필수)</span>
          </label>
          <label className="label-agreement">
            <input
              id="privacy"
              type="checkbox"
              checked={agreementChecked['privacy']}
              onChange={(e) => {
                setAgreementChecked((prev) => ({
                  ...prev,
                  privacy: e.target.checked,
                }));
              }}
            />
            <Uncheckedbox className="checkmark" />
            개인정보 수집 및 이용 동의
            <span style={{ color: '#3b77ff' }}>(필수)</span>
          </label>
        </div>
        <button
          disabled={!agreementChecked.all || !checkValidForm()}
          className="button-big"
          onClick={(e) => sendForm(e)}
        >
          가입하기
        </button>
      </form>
    </>
  );
};
export default Signup;
