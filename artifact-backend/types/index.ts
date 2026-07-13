import Type from "typebox"

export const Document = Type.Object({
  title: Type.String(),
  text: Type.String(),
})

export const User = Type.Object({
  username: Type.String(),
  password: Type.String()
})
