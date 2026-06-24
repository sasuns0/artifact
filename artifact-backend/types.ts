import Type, { Static } from "typebox";

export const Document = Type.Object({
  text: Type.String(),
})

export type DocumentType = Static<typeof Document>;

