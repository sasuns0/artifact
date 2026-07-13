import Type, { Static } from "typebox";
import { Document } from ".";

export const CreateDocumentResponse = Type.Object({
  status: Type.Number(),
  data: Document
})

export type DocumentType = Static<typeof Document>;

export type CreateDocumentResponseType = Static<typeof CreateDocumentResponse>;

export type SearchQueryString = {
  title: string;
  text: string;
}
