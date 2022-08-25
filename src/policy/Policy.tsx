import { useParams } from 'react-router-dom';
import Header from 'Header';
import { useState, useEffect } from 'react';
import privacy from './privacy.txt';
import terms from './terms.txt';
const getTitle = (type: string | undefined) => {
  switch (type) {
    case 'terms':
      return '이용 약관';
    case 'privacy':
      return '개인정보 처리방침';
    default:
      return undefined;
  }
};
const getFile = (type: string | undefined) => {
  switch (type) {
    case 'terms':
      return terms;
    case 'privacy':
      return privacy;
    default:
      return undefined;
  }
};
const Policy = () => {
  let { type } = useParams();
  const [text, setText] = useState('');
  const title = getTitle(type);
  const file = getFile(type);
  useEffect(() => {
    if (getFile(type))
      fetch(file)
        .then((res) => res.text())
        .then(setText)
        .catch(console.log);
  }, [type]);
  return (
    <>
      <Header>{title}</Header>
      <div
        className="main-container card policy"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {text}
      </div>
    </>
  );
};
export default Policy;
