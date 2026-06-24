'use client';

import { useState } from "react";

export function SideBar() {
  const [search, setSearch] = useState("");

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
