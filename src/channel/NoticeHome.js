import React, { useState } from 'react';
import { SearchBox } from 'Input';
import NoticeList from 'channel/NoticeList';
const NoticeHome = () => {
  const searchOptions = { all: '전체', title: '제목', contents: '내용' };
  const [searchOption, setSearchOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  return (
    <div className="main-container">
      <div style={{ padding: ' 0 20px', margin: '20px 0' }}>
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchOptions={searchOptions}
          setSearchOption={setSearchOption}
        />
      </div>
      <div className="card">
        <NoticeList type={searchOption} keyword={searchValue} />
      </div>
    </div>
  );
};

export default NoticeHome;
