import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}

async function get(params: TodoControllerGetParams) {
  return todoRepository.get({ page: params.page, limit: 10 });
}

function filterTodosByContent<Todo>(
  todos: Array<Todo & { content: string }>,
  search: string
): Array<Todo> {
  const filteredTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return filteredTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onSuccess: (todo: Todo) => void;
  onError: (customMessage?: string) => void;
}

async function create({
  content,
  onSuccess,
  onError,
}: TodoControllerCreateParams) {
  // Fail fast
  const parsedParams = schema.string().nonempty().safeParse(content);
  if (!parsedParams.success) {
    onError("Content is required");
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleDoneParams {
  id: string;
  onError: () => void;
  updateTodoOnScreen: () => void;
}

function toggleDone({
  id,
  onError,
  updateTodoOnScreen,
}: TodoControllerToggleDoneParams) {
  // Update on screen
  // Optimistic Update
  todoRepository.toggleDone(id).then(() => {
    // Update on screen;
    updateTodoOnScreen();
  })
  .catch(() => {
    onError();
  });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
};
