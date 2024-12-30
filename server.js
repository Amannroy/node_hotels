import express from "express";
import db from "./db.js";
import bodyParser from "body-parser";
import Task from "./models/Task.js";
// Import the router files
import personRoutes from "./routes/personRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import passport from "./auth.js";

const app = express();

app.use(bodyParser.json());


// Middleware Function
const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`
  );
  next();
};

app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local', {session: false})

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Post /api/tasks - Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// /api/tasks that retrieve a list of all tasks from the database
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/idli", (req, res) => {
  let customied_idli = {
    name: "rava idli",
    size: "10 cm",
    is_Sambhar: true,
    is_Chutney: false,
  };
  res.send(customied_idli);
});

app.use("/person",localAuthMiddleware, personRoutes);
app.use("/menu", menuRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
