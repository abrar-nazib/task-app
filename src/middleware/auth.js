const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "ajairaString");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); // Will find a user having this particular id and that particular token present in the database

    if (!user) {
      throw new Error("Invalid auth-token");
    }

    req.token = token;
    req.user = user; // the route handler will have access to the retreived user as body object.
    // Using because of saving resoureces. Won't need to call the database twice to retreive the same user.
    next(); // Give control to the route handler
  } catch (error) {
    res.status(401).send({
      Error: error,
      Summary: "You can't access this page if you are unauthorized",
    });
  }
};

module.exports = auth;
