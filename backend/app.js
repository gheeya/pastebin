const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { v4: uuid } = require("uuid");
const { connectDB } = require("./db/dbConnection");
const pasteRoute = require("./routes/pasteRoutes");

const PORT = process.env.PORT || 8000;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", pasteRoute);

app.get("/p/:id", (req, res) => {
  res.status(200).json({
    status: true,
    msg: "Paste returned successfully",
    content: "This is content",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
