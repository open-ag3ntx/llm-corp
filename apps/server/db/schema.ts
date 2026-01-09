import { integer, pgTable, varchar } from "drizzle-orm/pg-core"


export const employeesTable = pgTable("employees", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  position: varchar().notNull(),
});

export const modelsTable = pgTable("models", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  version: varchar().notNull(),
});

export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  description: varchar().notNull(),
  status: varchar().notNull(),
});