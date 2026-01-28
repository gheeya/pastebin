const Paste = require("../models/Paste.model");
const mongoose = require("mongoose");
const escapeHtml = require("escape-html");

const checkHealth = (req, res) => {
  return res
    .status(200)
    .json({ status: true, msg: "The app health is optimal!!!" });
};

const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ status: false, msg: "Missing content body in the request" });
    }
    if (ttl_seconds && (!Number.isFinite(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({
        status: false,
        msg: "Invalid ttl_seconds format and/or value",
      });
    }
    if (max_views && (!Number.isFinite(max_views) || max_views < 1)) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid max_views format and/or value" });
    }
    const newPaste = await Paste.create({ content, ttl_seconds, max_views });
    const id = newPaste._id;
    res.status(200).json({
      status: true,
      msg: "Paste created successfully",
      id,
      url: `/api/pastes/${id}`,
    });
  } catch (error) {
    console.log("ERROR CREATING PASTE", error.message);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

const getPasteById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, msg: "Invalid/Missing ID" });
    }
    const paste = await Paste.findByIdAndUpdate(
      { _id: id },
      [
        {
          $set: {
            max_views: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$max_views", null] },
                    { $gt: ["$max_views", 0] },
                  ],
                },
                { $subtract: ["$max_views", 1] },
                "$max_views",
              ],
            },
            exhausted: {
              $cond: [
                {
                  $eq: ["$max_views", 0],
                },
                true,
                false,
              ],
            },
          },
        },
      ],
      { new: true, updatePipeline: true },
    );
    if (!paste || paste.exhausted) {
      return res.status(404).json({
        status: false,
        msg: "Paste with the given ID not found/expired",
      });
    }
    let expires_at = paste.ttl_seconds
      ? new Date(paste.createdAt + paste.ttl_seconds * 1000)
      : "never";
    expires_at = expires_at.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const pasteOp = {
      content: paste.content,
      remaining_views: paste.max_views ?? "infinite",
      expires_at,
    };
    res
      .status(200)
      .json({ status: true, msg: "Paste returned successfully", ...pasteOp });
  } catch (error) {
    console.log("ERROR GETTING PASTE", error.message);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

const renderPaste = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send(`<!DOCTYPE html>
        <html>
      <body>
      <h1>400: Invalid/Missing ID</h1>
      </body>
    </html>`);
    }
    const paste = await Paste.findById({ _id: id });
    console.log("This is the paste", paste);
    if (!paste || paste.exhausted) {
      return res.status(404).send(`<!DOCTYPE html>
        <html>
      <body>
      <h1>404: Paste Not Found/Expired</h1>
      </body>
    </html>`);
    }
    res.status(200).send(`<!DOCTYPE html>
    <html>
    <body>
    <p>${escapeHtml(paste.content)}</p>
    </body>
    </html>`);
  } catch (error) {
    console.log("ERROR RENDERING HTML", error.message);
    res.status(500).send(`<!DOCTYPE html>
    <html>
    <body>
    <h1>Internal Server Error</h1>
    </body>
    </html>`);
  }
};

module.exports = { checkHealth, createPaste, getPasteById, renderPaste };
