const multer = require("multer");
const express = require("express");
const router = new express.Router();

//------------------ Model --------------------------------------
const User = require("../models/user.js");

//------------------- Custom Middlewares -------------------------
const auth = require("../middleware/auth.js"); // Express middleware to handle authentication

//------------------ configure multer ----------------------------
const upload = multer({
  // dest: "avatar", // Destination folder where the file will be saved
  limits: {
    fileSize: 1000000, // Uploaded filesize should not exceed 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed")); // reject for other file types
    }
    cb(undefined, true); // continue to file upload process
  },
});

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
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
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

// Router for profile picture upload
router.post(
  "/users/me/avatar", // path
  auth, // authentication middleware
  upload.single("avatar"), // middleware for checking file validity
  async (req, res) => {
    // route handler
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    // error handler for middleware
    res.status(400).send({ Error: error.message });
  }
);

// Router for profile picture delete
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
