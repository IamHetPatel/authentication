const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentRegistration")
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => {
    console.log(err + "not connected");
  });
