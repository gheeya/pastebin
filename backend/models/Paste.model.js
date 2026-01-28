const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Paste Content is required"],
      trim: true,
    },
    ttl_seconds: {
      type: Number,
      default: null,
    },
    max_views: {
      type: Number,
      default: null,
    },
    exhaustedViewCnt: {
      type: Boolean,
      default: false,
    },
    exhaustedTime: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Paste", pasteSchema);
