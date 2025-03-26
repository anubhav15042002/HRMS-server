const mongoose = require("mongoose");
const localDB = process.env.LOCAL_DB;

const connectDB = async () => {
  await mongoose.connect(localDB);
  console.log("MongoDB Connected");
};

module.exports = connectDB;
