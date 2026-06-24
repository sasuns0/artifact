'use server';

export async function createDocument(text: string) {
  const res = await fetch("http://localhost:8080/document", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  return res.json();
}
