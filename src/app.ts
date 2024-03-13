import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { todoRoutes } from "./routes/todo";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todo", todoRoutes);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    app.listen(3001, () => {
      console.log(
        "Database connected successfully and server started on PORT: 3001"
      );
    });
  })
  .catch((error) => {
    console.log("Oops! something went wrong while connecting to the database");
  });

export default app;
