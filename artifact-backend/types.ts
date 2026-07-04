import Type, { Static } from "typebox";

export const Document = Type.Object({
  title: Type.String(),
  text: Type.String(),
})

export const CreateDocumentResponse = Type.Object({
  status: Type.Number(),
  data: Document
})

export type DocumentType = Static<typeof Document>;

export type CreateDocumentResponseType = Static<typeof CreateDocumentResponse>;

export interface ISearchQueryString {
  title: string;
  text: string;
}
