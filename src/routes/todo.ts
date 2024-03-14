import express from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  sse,
} from "../controllers/todo.controller";

const router = express.Router();

router.get("/", getTodos);

router.post("/", addTodo);

router.patch("/:todoId", updateTodo);

router.delete("/:todoId", deleteTodo);

router.get("/sse", sse);

export { router as todoRoutes };
