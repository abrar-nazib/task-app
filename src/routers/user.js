const User = require("../models/user.js");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth.js"); // Express middleware to handle authentication
// Don't import anything autometically

router.post("/users", async (req, res) => {
  // registration mechanism
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  email = req.body.email;
  password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message); // special case for showing message. Doesn't show anything if message not printed.
  }
});

router.post("/users/logout", auth, async (req, res) => {
  console.log("-------------------------------------------");
  console.log(req.user.tokens);
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    console.log("--------!!!------------");
    console.log(req.user.tokens);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const _id = req.params.id;

  //----------------------Handling invalid update keys
  const requestedUpdateKeys = Object.keys(req.body); // returns all the keys of the object inside an array
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOpertaion = requestedUpdateKeys.every(
    (key) => allowedUpdates.includes(key) // Will return boolean true if every key in the request body is present in allowerUpdates.
  );
  if (!isValidOpertaion) {
    return res.status(400).send({ error: "Invalid update keys" });
  }

  try {
    const user = req.user;

    requestedUpdateKeys.forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove(); // Delete the user from mongodb
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
