require("../src/db/mongoose.js");
const Task = require("../src/models/task");

const _id = "625452e302f87b5f4d935d0d";

// Task.findByIdAndDelete(_id)
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((incompleteCount) => {
//     console.log(incompleteCount);
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

const deleteTaskAndCount = async (id) => {
  const deletedTask = await Task.findByIdAndDelete(id);
  const incompleteTask = await Task.countDocuments({ completed: false });
  return {
    incompleteTask,
    deletedTask,
  };
};

deleteTaskAndCount(_id)
  .then((incompleteTask) => {
    console.log(incompleteTask);
  })
  .catch((error) => {
    console.log(error.message);
  });
