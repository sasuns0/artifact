'use server';

import { QueryResponse } from "./types";

export async function createDocument(title: string, text: string) {
  const res = await fetch("http://localhost:8080/document", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, title }),
  });

  return res.json();
}

export async function queryDocument(queryString: string): Promise<QueryResponse> {
  const res = await fetch(`http://localhost:8080/search?text=${queryString}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const resData = await res.json() as QueryResponse;
  return resData;
}
