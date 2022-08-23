import React, { useState } from 'react';
import { SearchBox } from 'Input';
import NoticeList from 'channel/NoticeList';
import Header from 'Header';
const NoticeHome = () => {
  const searchOptions = { all: '전체', title: '제목', contents: '내용' };
  const [searchOption, setSearchOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  return (
    <>
      <Header left={<></>}>공지</Header>
      <div className="main-container" style={{ height: 'calc(100% - 3rem)' }}>
        <div
          style={{
            padding: '10px 20px',
            margin: 0,
            position: 'sticky',
            top: 0,
            backgroundColor: '#ededed',
          }}
        >
          <SearchBox
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchOptions={searchOptions}
            setSearchOption={setSearchOption}
          />
        </div>
        <div className="card" style={{ flexShrink: 1, overflowY: 'auto' }}>
          <NoticeList type={searchOption} keyword={searchValue} />
        </div>
      </div>
    </>
  );
};

export default NoticeHome;
