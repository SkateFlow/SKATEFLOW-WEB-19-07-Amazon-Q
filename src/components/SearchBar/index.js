import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { SearchContainer, SearchInput, SearchIcon } from './SearchBarElements';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <SearchContainer>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchContainer>
  );
};

export default SearchBar;