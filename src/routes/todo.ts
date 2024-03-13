import express from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller";

const router = express.Router();

router.get("/", getTodos);

router.post("/", addTodo);

router.patch("/:todoId", updateTodo);

router.delete("/:todoId", deleteTodo);

export { router as todoRoutes };
