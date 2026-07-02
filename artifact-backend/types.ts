import Type, { Static } from "typebox";

export const Document = Type.Object({
  title: Type.String(),
  text: Type.String(),
})

export type DocumentType = Static<typeof Document>;

export interface ISearchQueryString {
  title: string;
  text: string;
}
