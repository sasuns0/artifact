'use client';

import { useState } from "react";
import { TextArea } from "./textarea";
import { createDocument } from "@/app/lib/actions";

export function DocumentForm() {
  const [text, setText] = useState("");

  function handleDocumentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  async function handleSubmit(text: string) {
    await createDocument(text);
  }

  return (
    <div className="flex flex-col flex-1 p-4 min-h-full border-r-1 border-orange-500 gap-4">
      <div className="flex w-full h-12">
        <button onClick={() => handleSubmit(text)} className="cursor-pointer border-orange-500 border-1 px-4">Save</button>
      </div>
      <TextArea text={text} setTextAction={handleDocumentChange} />
    </div>
  );
}
