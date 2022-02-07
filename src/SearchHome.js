import React, { useState } from 'react';
import ChannelList from 'channel/ChannelList';
import { useAuthContext } from 'context/AuthContext';
import { SearchBox } from 'Input';
import Header from 'Header';

const SearchHome = () => {
  const searchOptions = { all: '전체', name: '이름', description: '소개' };
  const [searchOption, setSearchOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const {
    value: { isLoggedIn },
  } = useAuthContext();
  return (
    <>
      <Header left={<></>}>채널 찾기</Header>
      <div className="main-container">
        <div style={{ padding: ' 0 20px', margin: '20px 0' }}>
          <SearchBox
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchOptions={searchOptions}
            setSearchOption={setSearchOption}
          />
        </div>
        <ChannelList type={searchOption} keyword={searchValue} />
      </div>
    </>
  );
};

export default SearchHome;
