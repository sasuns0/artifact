"use client";

import { SearchBar } from "@/components/search-bar";
import { DocumentForm } from "@/components/document-form";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1">
      <DocumentForm />
      <SearchBar />
    </div>
  );
}
