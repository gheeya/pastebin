const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.TEMP_DB_NAME,
    });
    console.log("MONGOOSE CONNECTION ESTABLISHED");
  } catch (error) {
    console.log("MONGOOSE CONNECTION ERROR", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
