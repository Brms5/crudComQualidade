interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("/api/todos").then(async (response) => {
    const todosString = await response.text();
    const todosFromServer = JSON.parse(todosString).todos;
    console.log("page", page);
    console.log("limit", limit);

    const allTodos = todosFromServer;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTodos = allTodos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allTodos.length / limit);

    return {
      todos: paginatedTodos,
      total: allTodos.length,
      pages: totalPages,
    };
  });
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}
