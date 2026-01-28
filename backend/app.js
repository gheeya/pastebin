const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { connectDB } = require("./db/dbConnection");
const pasteRoute = require("./routes/pasteRoutes");
const renderPasteRoute = require("./routes/renderPasteRoute");

const PORT = process.env.PORT || 8000;

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", pasteRoute);
app.use("/p", renderPasteRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
