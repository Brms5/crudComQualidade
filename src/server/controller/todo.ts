import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "@server/repository/todo";
import { HttpNotFoundError } from "@server/infra/errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

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

  res.status(201).json({
    todo: createdTodo,
  });
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "Invalid todo ID",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDoneById(todoId as string);
    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  // TODO Validate query schema
  const querySchema = schema.object({
    id: schema.string().uuid().nonempty(),
  });

  // Fail fast
  const parsedQuery = querySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: "Invalid TODO ID",
        description: parsedQuery.error.message,
      },
    });
    return;
  }

  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      return res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
