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

const multer = require("multer");
const upload = multer({
  dest: "images",
});

app.post("/upload", upload.single("upload"), (req, res) => {
  res.send();
});
// testfunc();
