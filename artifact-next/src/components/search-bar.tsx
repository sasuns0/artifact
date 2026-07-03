'use client';

import { queryDocument } from "@/app/lib/actions";
import { IDocument } from "@/app/lib/types";
import { useEffect, useState } from "react";

export function SearchBar() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<IDocument[]>([]);

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
    <div className="flex flex-col gap-4 p-4 w-144 bg-black-500 h-full">
      <input
        name="search"
        onChange={handleSearchChange}
        value={search}
        placeholder="search your data..."
        className="w-full bg-gray-700 outline-none p-2"
        type="text"
      />
      <div className="flex flex-col gap-2">
        {
          searchResults.map((document) => (
            <div key={document.id} className="flex flex-col gap-2 border-neutral-700 border-1 outline-none p-4">
              <span>{document.title}</span>
              <span className="truncate">{document.text}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
