const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hack:hackthetank@cluster0.r3mu0mi.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => {
    console.log(err + "not connected");
  });
