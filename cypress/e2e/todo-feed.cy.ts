const BASE_URL = "http://localhost:3000";

describe("/ - Todos Feed", () => {
  it("should display the todo feed", () => {
    cy.visit(BASE_URL);
    // cy.get("h1").should("contain", "Todo Feed");
  });
  it("when create a new todo, it must appears in the screen", () => {
    // 0 - Preparação
    cy.intercept("POST", `${BASE_URL}/api/todos`, (req) => {
      req.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "e5499b16-3fe4-4610-9447-5f80a9a4d9aa",
            date: "2023-07-07T11:49:04.216Z",
            content: "Test TODO",
            done: false,
          },
        },
      });
    }).as("createTodo");
    // 1 - Abrir a página
    cy.visit(BASE_URL);
    // 2 - Selecionar o input de criar nova TODO
    // 3 - Digitar no input de criar nova TODO
    cy.get("input[name='add-todo']").type("Test TODO");
    // 4 - Clicar no botão de criar nova TODO
    cy.get("[aria-label='Adicionar novo item']").click();
    // 5 - Verificar se a nova TODO apareceu na tela
    cy.get("table > tbody").contains("Test TODO");

    // Criar validações a partir de valores
    expect("text").to.be.equal("text");
  });
});
