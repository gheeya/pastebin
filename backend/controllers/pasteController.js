const Paste = require("../models/Paste.model");
const mongoose = require("mongoose");

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
    const pasteOp = {
      content: paste.content,
      remaining_views: paste.max_views ?? "infinite",
      expires_at: paste.ttl_seconds ?? "never",
    };
    res
      .status(200)
      .json({ status: true, msg: "Paste returned successfully", ...pasteOp });
  } catch (error) {
    console.log("ERROR GETTING PASTE", error.message);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports = { checkHealth, createPaste, getPasteById };
