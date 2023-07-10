// import {
//   read,
//   create,
//   updateDoneById,
//   deleteById as dBDeleteById,
// } from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";
import { Todo, todoSchema } from "@server/schema/todo";
import { supabase } from "@server/infra/database/supabase";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
async function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit - 1;

  const { data, error, count } = await supabase
    .from("todos")
    .select("*", {
      count: "exact",
    })
    .order("date", { ascending: false })
    .range(startIndex, endIndex);
  if (error) throw new Error("Failed to fetch data");

  const parsedData = todoSchema.array().safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse TODO from database");
  }
  // TODO: Fix this to be properly validated by schema

  const todos = parsedData.data;
  const total = count || todos.length;
  const totalPages = Math.ceil(total / currentLimit);

  return {
    todos,
    total,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        content,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Failed to create todo");

  const parsedData = todoSchema.parse(data);

  return parsedData;

  // const newTodo = create(content);
  // return newTodo;
}

async function getTodoById(id: string): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Failed to get todo by id");

  const parsedData = todoSchema.safeParse(data);
  if (!parsedData.success) throw new Error("Failed to parse TODO created");

  return parsedData.data;
}

async function toggleDoneById(id: string): Promise<Todo> {
  const todo = await getTodoById(id);
  const { data, error } = await supabase
    .from("todos")
    .update({
      done: !todo.done,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Failed to get todo by id");

  const parsedData = todoSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Failed to return updated todo");
  }

  return parsedData.data;
}

async function deleteById(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().match({
    id,
  });

  if (error) throw new HttpNotFoundError(`Todo with id "${id}" not found`);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDoneById,
  deleteById,
};
