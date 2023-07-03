import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
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

  const output = todoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    todos: output.todos,
    total: output.total,
    pages: output.pages,
  });
}

export const todoController = {
  get,
};
