import { todoController } from "@server/controller/todo";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // TODO Organize to have only the delete method here

  if (request.method === "DELETE") {
    todoController.deleteById(request, response);
    return;
  }

  response.status(405).json({
    error: {
      message: "Method not allowed!",
    },
  });
}
