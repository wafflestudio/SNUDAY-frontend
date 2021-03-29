const Tag = ({ name, color }) => {
  return (
    <li className='tag' style={{ backgroundColor: color }}>
      {name}
    </li>
  );
};
export default Tag;
