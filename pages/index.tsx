/* eslint-disable @typescript-eslint/no-explicit-any */
import { todoController } from "@ui/controller/todo";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import React from "react";

const bg = "/bg.jpeg"; // local image in public folder

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

function HomePage() {
  const initialLoadComplete = React.useRef<boolean>(false);
  const [newTodoContent, setNewTodoContent] = React.useState<string>("");
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1); // [1, 2, 3, 4, 5
  const [search, setSearch] = React.useState<string>(""); // ["", "a", "ab", "abc"
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [todos, setTodos] = React.useState<HomeTodo[]>([]);

  const filteredTodos = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search
  );

  const hasMorePages = totalPages > page;
  const hasNoTodos = filteredTodos.length === 0 && !isLoading;

  // Load informações quando a página é carregada
  React.useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="coolGrey" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              // .then
              onSuccess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setNewTodoContent("");
              },
              // .catch
              onError(customMessage) {
                alert(customMessage || "Erro ao criar novo item");
              },
            });
          }}
        >
          <input
            name="add-todo"
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodoContent}
            onChange={function newTodoHandler(event) {
              setNewTodoContent(event.target.value);
            }}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            value={search}
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredTodos.map((todo: any) => {
              return (
                <tr key={todo.id}>
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked={todo.done}
                      onChange={function handleToggle() {
                        todoController.toggleDone({
                          id: todo.id,
                          onError() {
                            alert("Erro ao atualizar a TODO!");
                          },
                          updateTodoOnScreen() {
                            setTodos((currentTodos) => {
                              return currentTodos.map((currentTodo) => {
                                if (currentTodo.id === todo.id) {
                                  return {
                                    ...currentTodo,
                                    done: !currentTodo.done,
                                  };
                                }
                                return currentTodo;
                              });
                            });
                          },
                        });
                      }}
                    />
                  </td>
                  <td>{todo.id.substring(0, 4)}</td>
                  <td>{todo.done ? <s>{todo.content}</s> : todo.content}</td>
                  <td align="right">
                    <button
                      data-type="delete"
                      onClick={function handleClick() {
                        todoController
                          .deleteById(todo.id)
                          .then(() => {
                            setTodos((currentTodos) => {
                              return currentTodos.filter((currentTodo) => {
                                return currentTodo.id !== todo.id;
                              });
                            });
                          })
                          .catch(() => {
                            console.error("Failed to delete TODO!");
                          });
                      }}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => [...oldTodos, ...todos]);
                          setTotalPages(pages);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default HomePage;
