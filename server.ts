import express from "express";
import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose";

import userRoute from "./routes/users";
import authRoute from "./routes/auth";
import postRoute from "./routes/posts";

const app = express();
const PORT = 3000;

dotenvConfig();

// データベース接続
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

// ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
