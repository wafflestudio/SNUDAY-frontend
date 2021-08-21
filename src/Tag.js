import { useEffect, useState } from 'react';
import { getChannel } from './API';

const Tag = ({ id, name, color }) => {
  const [channel, setChannel] = useState(null);
  useEffect(() => {
    if (!name) getChannel(id).then(setChannel);
  }, []);
  return (
    <div className="tag" style={{ backgroundColor: color }}>
      {name ?? channel?.name}
    </div>
  );
};
export default Tag;
