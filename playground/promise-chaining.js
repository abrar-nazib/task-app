require("../src/db/mongoose.js");
const User = require("../src/models/user.js");

// 625583eb9ab6a6e1b4759fc5

const _id = "62545252b296a0f75da2226c";

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount(_id, 11)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
