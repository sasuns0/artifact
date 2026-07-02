'use client';

type TextAreaProps = {
  text: string
  setTextAction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
};

export function TextArea({ text, setTextAction }: TextAreaProps) {
  return (
    <textarea value={text}
      onChange={setTextAction}
      name="document"
      placeholder="Enter Text"
      className="border-neutral-700 border-1 p-4 h-full text-xl w-full resize-none outline-none"
      autoFocus
    />
  );
}
