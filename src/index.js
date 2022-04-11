const express = require("express");
require("./db/mongoose.js"); // For database conncetion
const app = express();

const port = process.env.PORT || 3000;
// If no port is set, will be listening on port 3000

app.use(express.json());
// For parsing the incoming json into javascript object

app.post("/users", (req, res) => {
  res.send("testing post requests");
});

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
