import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// database connnection
import connectDatabase from "./config/database.js";
dotenv.config({ path: "./config/config.env" });
// connect to database

connectDatabase();

// setting up the middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const server = app.listen(process.env.PORT, () =>
  console.log(
    `server started at port ${process.env.PORT} in ${process.env.NODE_ENV}`
  )
);
