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
      className="h-full text-xl w-full resize-none outline-none "
      autoFocus
    />
  );
}
