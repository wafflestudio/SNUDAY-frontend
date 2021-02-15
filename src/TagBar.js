const Tag = ({ name }) => {
  return <li className='tag'>{name}</li>;
};
const TagBar = () => {
  return (
    <ul className='tagbar'>
      <Tag name='컴퓨터공학부' />
      <Tag name='내 일정' />
      <Tag name='본부공개' />
      <Tag name='SNUDAY' />
    </ul>
  );
};
export default TagBar;
