import { read } from "@db-crud-todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({ page, limit }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const allTodos = read();

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

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
