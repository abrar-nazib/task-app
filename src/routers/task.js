const express = require("express");
const Task = require("../models/task.js");
const auth = require("../middleware/auth.js");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, // Will paste the key-value pairs of the request body here
    owner: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET tasks?completed=bool
// GET task?limit=10&skip=0
// GET task?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit), // will only send instructions to the database if inputted parameter is an integer.
        skip: parseInt(req.query.skip), // will ignore the n number of returned results and start from (n+1)th result.
        sort,
      },
    });

    const tasks = req.user.tasks;
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
    // 400 - Bad request
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  //----------------------Handling invalid update keys
  const requestedUpdateKeys = Object.keys(req.body); // returns all the keys of the object inside an array
  const allowedUpdates = ["description", "completed"];
  const isValidOpertaion = requestedUpdateKeys.every((requestedUpdate) =>
    allowedUpdates.includes(requestedUpdate)
  );
  if (!isValidOpertaion) {
    res.status(400).send({ error: "Invalid update keys" });
  }

  //
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    requestedUpdateKeys.forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
