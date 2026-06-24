'use client';

import { useState } from "react";

export function TextArea() {
  const [text, setText] = useState("");

  const handleDocumentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  return (
    <textarea value={text}
      onChange={handleDocumentChange}
      name="document"
      className="h-full text-xl w-full resize-none outline-none "
      autoFocus
    />
  );
}
