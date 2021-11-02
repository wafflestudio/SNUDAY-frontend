import React, { useState } from 'react';
import ChannelList from 'channel/ChannelList';
import { useAuthContext } from 'context/AuthContext';
import { SearchBox } from 'Input';

const SearchHome = () => {
  const searchOptions = { all: '전체', name: '이름', description: '소개' };
  const [searchOption, setSearchOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const {
    value: { isLoggedIn },
  } = useAuthContext();
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
      <ChannelList type={searchOption} keyword={searchValue} />
    </div>
  );
};

export default SearchHome;
