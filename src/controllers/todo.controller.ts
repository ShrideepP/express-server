import { Request, Response } from "express";
import { TodoModel } from "../models/todo.model";

export async function getTodos(request: Request, response: Response) {
  try {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    const todos = await TodoModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await TodoModel.countDocuments();

    response.status(200).json({
      todos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalTodos: totalCount,
    });
  } catch (error) {
    console.log("Error in get todo's route.", error);
    response.status(500).send("Internal server error.");
  }
}

export async function addTodo(request: Request, response: Response) {
  try {
    const todo = new TodoModel(request.body);
    await todo.save();
    response.status(201).json(todo);
  } catch (error) {
    console.log("Error in add todo route.", error);
    response.status(500).send("Internal server error.");
  }
}

export async function updateTodo(request: Request, response: Response) {
  try {
    const { todoId } = request.params;
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todoId,
      request.body,
      { new: true }
    );
    await updatedTodo?.save();
    response.status(200).json(updatedTodo);
  } catch (error) {
    console.log("Error in update todo route.", error);
    response.status(500).send("Internal server error.");
  }
}

export async function deleteTodo(request: Request, response: Response) {
  try {
    const { todoId } = request.params;
    await TodoModel.findByIdAndDelete(todoId);
    response.status(204).end();
  } catch (error) {
    console.log("Error in delete todo route.", error);
    response.status(500).send("Internal server error.");
  }
}

export async function sse(request: Request, response: Response) {
  try {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    response.write(": keep-alive\n\n");

    const changeStream = TodoModel.watch();
    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        response.write(
          `data: ${JSON.stringify({
            type: "insert",
            todo: change.fullDocument,
          })}\n\n`
        );
      } else if (change.operationType === "update") {
        const updatedTodo = await TodoModel.findById(change.documentKey._id);
        response.write(
          `data: ${JSON.stringify({ type: "update", todo: updatedTodo })}\n\n`
        );
      } else if (change.operationType === "delete") {
        response.write(
          `data: ${JSON.stringify({
            type: "delete",
            todoId: change.documentKey._id,
          })}\n\n`
        );
      }
    });
  } catch (error) {
    console.log("Error in todo's sse route.", error);
    response.status(500).send("Internal server error.");
  }
}
