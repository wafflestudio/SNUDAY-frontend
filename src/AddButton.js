import React, { useState } from 'react';
import AddScheduleModal from './AddScheduleModal';
const AddButton = () => {
  const [add, setAdd] = useState(false);
  return (
    <>
      <div className='button-add-container'>
        <img
          className='button-add'
          src='/resources/button-add.png'
          srcSet='/resources/button-add@2x.png 2x, /resources/button-add@3x.png 3x'
          alt='add schedule'
        />
        <svg
          className='button-add-circle'
          viewBox='0 0 100 100'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            fill='transparent'
            cx='47'
            cy='47'
            r='38.69'
            onClick={() => setAdd(true)}
          />
        </svg>
      </div>

      {add ? <AddScheduleModal isActive={setAdd} /> : <></>}
    </>
  );
};
export default AddButton;
