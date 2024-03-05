require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const userRouter = require("./router/user");
const taskRouter = require("./router/task");

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/auth", userRouter);
app.use("/task", taskRouter);

app.use((err, req, res, next) => {
  if (err.code === "P2002") {
    return res.status(400).send({ error: "Duplicate Entry" });
  }
  if (err.code === "23505") {
    return res.status(400).send({ error: "Duplicate Entry" });
  }
  if (err.code === "P2003") {
    return res.status(400).send({ error: "validation error" });
  }
  if (err.code === "P2016") {
    return res.status(400).send({ error: "Invalid Data" });
  }
  res.status(500).send({ error: err.message });
});

module.exports = app;