export type Document = {
  id: string;
  title: string;
  text: string;
}

export type QueryResponse = {
  status: number,
  data: Document[]
}
