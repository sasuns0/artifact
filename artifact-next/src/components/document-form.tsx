'use client';

import { useState } from "react";
import { TextArea } from "./textarea";
import { createDocument } from "@/app/lib/actions";

export function DocumentForm() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  function handleDocumentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  async function handleSubmit(title: string, text: string) {
    await createDocument(title, text);
    setText("");
    setTitle("");
  }

  return (
    <div className="flex flex-col flex-1 p-4 min-h-full border-r-1 border-orange-500 gap-4">
      <div className="flex w-full h-12 gap-2">
        <input value={title} onChange={handleTitleChange} placeholder="Enter Title" type="text" className="flex-1 border-neutral-700 border-1 px-4 outline-none" />
        <button onClick={() => handleSubmit(title, text)} className="cursor-pointer border-orange-500 border-1 px-4">Save</button>
      </div>
      <TextArea text={text} setTextAction={handleDocumentChange} />
    </div>
  );
}
