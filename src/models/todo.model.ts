import mongoose from "mongoose";

interface ITodo {
  todo: string;
  completed: boolean;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    todo: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TodoModel = mongoose.model("Todo", todoSchema);
