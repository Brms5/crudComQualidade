import { Todo, todoSchema } from "@ui/schema/todo";
import {z as schema} from "zod";

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
  return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const todosString = await response.text();
      const responseParsed = parseTodosFromServer(JSON.parse(todosString));

      return {
        todos: responseParsed.todos,
        total: responseParsed.total,
        pages: responseParsed.pages,
      };
    }
  );
}

export async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      // MIME type
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Error creating todo");
  }

  const serverReponse = await response.json();
  const serverResponseSchema = schema.object({
    todo: todoSchema,
  });

  const serverResponseParsed = serverResponseSchema.safeParse(serverReponse);
  if (!serverResponseParsed.success) {
    throw new Error("Error creating todo");
  }

  const todo = serverResponseParsed.data.todo;
  return todo;
  // return serverReponse;
}

export const todoRepository = {
  get,
  createByContent,
};

function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Array<Todo>;
} {
  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "total" in responseBody &&
    "todos" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
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
          date: date,
          done: String(done).toLowerCase() === "true",
        };
      }),
    };
  }

  return {
    pages: 1,
    total: 0,
    todos: [],
  };
}
