'use client';

import { queryDocument } from "@/app/lib/actions";
import { useEffect, useState } from "react";

export function SideBar() {
  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState<() => void>();

  const createSearchDebounce = function() {
    let timer: ReturnType<typeof setTimeout>;

    return function(queryString: string) {
      clearInterval(timer);

      timer = setTimeout(async () => {
        const res = await queryDocument(queryString);
        console.log(res);
      }, 500);
    }
  }

  useEffect(() => {
    setSearchDebounce(() => createSearchDebounce());
  }, []);

  useEffect(() => {
    searchDebounce && searchDebounce();
  }, [search]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <div className="p-4 w-144 bg-black-500 h-full">
      <input
        name="search"
        onChange={handleSearchChange}
        value={search}
        placeholder="search your data..."
        className="w-full bg-gray-700 outline-none p-2"
        type="text"
      />
    </div>
  )
}
