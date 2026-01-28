const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { v4: uuid } = require("uuid");

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/healthz", (req, res) => {
  res.status(200).json({ status: true, msg: "The app health is optimal!!!" });
});

app.post("/api/pastes", (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;
  if (!content) {
    res
      .status(400)
      .json({ status: false, msg: "Missing content body in the request" });
  }
  if (ttl_seconds && (!Number.isFinite(ttl_seconds) || ttl_seconds < 1)) {
    res.status(400).json({ status: false, msg: "Invalid ttl_seconds format" });
  }
  if (max_views && (!Number.isFinite(max_views) || max_views < 1)) {
    res.status(400).json({ status: false, msg: "Invalid max_views format" });
  }
  const id = uuid();
  const newPaste = {
    id,
    url: `/api/pastes/${id}`,
    ttl_seconds,
    max_views,
  };
  console.log("This is the paste", newPaste);
  res.status(200).json({
    status: true,
    msg: "New Paste has been successfully created",
    id: newPaste.id,
    url: newPaste.url,
  });
});

app.get("/api/pastes/:id", (req, res) => {
  res.status(200).json({
    status: true,
    msg: "Paste returned successfully",
    content: "This is content",
    remaining_views: 1,
    expires_at: Date.now(),
  });
});

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
