import fs from "fs"; // ES6
import { v4 as uuid } from 'uuid';

const DB_FILE_PATH = "./core/db";

// console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

export function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content,
    done: false,
  }

  const todos: Todo[] = [
    ...read(), // Spread operator
    todo
  ];

  // Salvar o content no sistema
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({todos}, null, 2));
  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) { // Fail fast validations
    return [];
  }
  return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if(isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos,
  }, null, 2));

  if(!updatedTodo) {
    throw new Error("Please, provide another ID!")
  }

  return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
  return update(id, {content});
}

export function updateDoneById(id: UUID, done: boolean): Todo {
  return update(id, {done});
}

function deleteById(id: UUID): void {
  const todos = read();
  const todosWithoutOne = todos.filter((currentTodo) => {
    if(currentTodo.id === id) {
      return false;
    }
    return true;
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
    todos: todosWithoutOne,
  }, null, 2));

} 

function clearDB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
// clearDB();
// const firstTodo = create("Primeira TODO!");
// const secondTodo = create("Segunda TODO!");
// const thirdTodo = create("Terceira TODO!");
// deleteById(secondTodo.id);
// update(primeiraTodo.id, {content: "Primeira TODO atualizada!"});
// updateContentById(firstTodo.id, "Primeira TODO atualizada!");
// updateDoneById(thirdTodo.id, true);
// console.log(read());
// updateContentById("a282cc59-fb6e-4620-ac7e-8334c19d1f86", "Terceira TODO!");
