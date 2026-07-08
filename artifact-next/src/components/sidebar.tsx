'use client';

import { queryDocument } from "@/app/lib/actions";
import { Document } from "@/app/lib/types";
import { useEffect, useState } from "react";

export function SideBar() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Document[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await queryDocument(search);
      setSearchResults(res);
    }, 200)
    return () => clearTimeout(timer);
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
