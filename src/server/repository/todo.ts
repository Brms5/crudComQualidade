import { read, create, updateDoneById } from "@db-crud-todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({ page, limit }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const allTodos = read().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = allTodos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTodos.length / currentLimit);

  return {
    todos: paginatedTodos,
    total: allTodos.length,
    pages: totalPages,
  };
}

async function createByContent(content: string): Promise<Todo> {
  const newTodo = create(content);
  return newTodo;
}

async function toggleDoneById(id: string): Promise<Todo> {
  const currentTodo = read().find((todo) => todo.id === id);
  if (!currentTodo) {
    throw new Error(`Todo with ID "${id}" not found!`);
  }

  const updatedTodo = updateDoneById(currentTodo.id, !currentTodo.done);
  return updatedTodo;
}

export const todoRepository = {
  get,
  createByContent,
  toggleDoneById,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
