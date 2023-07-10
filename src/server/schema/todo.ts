import { z as schema } from "zod";

export const todoSchema = schema.object({
  id: schema.string().uuid(),
  content: schema.string().nonempty(),
  date: schema.string().transform((value) => new Date(value).toISOString()),
  done: schema.string().transform((value) => value === "true"),
});

export type Todo = schema.infer<typeof todoSchema>;
