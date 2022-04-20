//----------- Server and database setup-------------
const express = require("express");
require("./db/mongoose.js"); // For database conncetion
const app = express();
const port = process.env.PORT || 3000; // If no port is set, will be listening on port 3000

//--------Express Routers--------------------------------
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

//--------Global vairables-------------------------------

//------- Express Middleware ----------------------------
// Used for handling authentication

//--------- Express customizations--------------
app.use(express.json()); // For parsing the incoming json into javascript object
app.use(userRouter); // router
app.use(taskRouter); // router

//------------------------Tasks------------------------

app.listen(port, () => {
  console.log("Server is running on port ", port);
});

const Task = require("./models/task.js");
const User = require("./models/user.js");

const testfunc = async () => {
  // const task = await Task.findById("625fb6b84dccdf310b921d99");
  // const populatedTask = await task.populate("owner");
  // console.log(task.owner);
  // 625fb4e05c75c5df632baf45
  const user = await User.findById("625fb4e05c75c5df632baf45");
  await user.populate("tasks");
  console.log(user.tasks);
};

// testfunc();
