const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  // useCreateIndex: true
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
});
// Definition of mongoose model "User"

const me = new User({ name: "Abrar", age: 22 });
// Instanciation of model User

me.save()
  .then(() => {
    console.log(me);
  })
  .catch((error) => {
    console.log(error.message);
  });

const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
  },
});

// const task1 = new Task({
//   description: "Test task",
//   completed: false,
// });

// task1
//   .save()
//   .then(() => {
//     console.log(task1);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });
