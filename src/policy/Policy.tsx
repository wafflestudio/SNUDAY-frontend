import { Navigate, useParams } from 'react-router-dom';
import Header from 'Header';
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
const Policy = () => {
  let { type } = useParams();
  const title = getTitle(type);
  return (
    <>
      <Header>{title}</Header>
    </>
  );
};
export default Policy;
