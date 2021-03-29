import Tag from './Tag';

const colors = {
  red: '#d4515d',
  orange: '#e8914f',
  yellow: '#f3c550',
  green: '#b2d652',
};
const TagBar = () => {
  return (
    <ul className='tagbar'>
      <Tag name='컴퓨터공학부' color={colors.red} />
      <Tag name='내 일정' color={colors.orange} />
      <Tag name='본부공개' color={colors.yellow} />
      <Tag name='SNUDAY' color={colors.green} />
    </ul>
  );
};
export default TagBar;
