import React from "react";
import useSearch from "@/hooks/useSearch";
import { InputEvent } from "@/types";
import {CiSearch} from "react-icons/ci";

interface SearchBarProps {
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({placeholder = "Search..."}) => {
  const { onSetSearch } = useSearch();
  return (
    <div className="flex gap-x-2 items-center w-full  border px-4 focus-within:border-blue-500 focus-within:border-2 border-gray-300 py-1 rounded-[4px]">
        <CiSearch size={23} className="text-gray-800" />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-white w-full text-[16px] font-normal placeholder:text-gray-800 outline-none"
        onChange={(e: InputEvent) => onSetSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
