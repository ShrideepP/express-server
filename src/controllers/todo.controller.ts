import { Request, Response } from "express";
import { TodoModel } from "../models/todo.model";

export async function getTodos(request: Request, response: Response) {
  try {
    const todos = await TodoModel.find();
    response.status(200).json(todos);
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
