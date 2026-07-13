import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";

export const documentsTable = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar(),
  text: text()
});

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar().unique(),
  password: varchar()
})
