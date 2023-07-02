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
    const todosFromServer = parseTodosFromServer(JSON.parse(todosString)).todos;
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

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "todos" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    console.log("responseBody", responseBody.todos);
    return {
      todos: responseBody.todos.map((todo: unknown) => {
        if (typeof todo !== "object" || todo === null) {
          throw new Error("Invalid todo from server");
        }

        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          date: new Date(date),
          done: String(done).toLowerCase() === "true",
        };
      }),
    };
  }
  
  return {
    todos: [],
  };
}
