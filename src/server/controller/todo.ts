import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "@server/repository/todo";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  console.log("query", query);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "Invalid page",
      },
    });
    return;
  }

  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "Invalid limit",
      },
    });
    return;
  }

  const output = await todoRepository.get({
    page,
    limit,
  });

  console.log("TYPE", typeof "");
  res.status(200).json({
    todos: output.todos,
    total: output.total,
    pages: output.pages,
  });
}

const todoCreateBodySchema = schema.object({
  content: schema.string(),
});
async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = todoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "Invalid content",
        description: body.error.message,
      },
    });
    return;
  }

  const createdTodo = await todoRepository.createByContent(body.data.content);

  // res.status(200).json({ todo: output.todo });
  res.status(201).json({
    todo: createdTodo,
  });
}

export const todoController = {
  get,
  create,
};
