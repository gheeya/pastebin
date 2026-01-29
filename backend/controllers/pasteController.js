const Paste = require("../models/Paste.model");
const mongoose = require("mongoose");
const escapeHtml = require("escape-html");

const checkHealth = async (req, res) => {
  try {
    await Paste.findOne().select("_id").lean();
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
};

const getNow = (req) => {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
};
const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Invalid content" });
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res.status(400).json({ error: "Invalid max_views" });
    }

    let expiresAt = null;
    if (ttl_seconds) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    const paste = await Paste.create({
      content,
      ttl_seconds: ttl_seconds ?? null,
      max_views: max_views ?? null,
      expiresAt,
    });

    return res.status(201).json({
      id: paste._id.toString(),
      url: `https://pastebin-backend-umber.vercel.app/p/${paste._id}`,
    });
  } catch (err) {
    console.error("ERROR CREATING PASTE", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllPastes = async (req, res) => {
  try {
    const now = getNow(req);

    const pastes = await Paste.find({
      $and: [
        {
          $or: [
            { max_views: null },
            { $expr: { $lt: ["$views", "$max_views"] } },
          ],
        },
        {
          $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        },
      ],
    })
      .select("_id content expiresAt max_views views createdAt")
      .lean();

    return res.status(200).json({
      pastes: pastes.map((p) => ({
        id: p._id.toString(),
        content: p.content,
        remaining_views: p.max_views === null ? null : p.max_views - p.views,
        expires_at: p.expiresAt ? p.expiresAt.toISOString() : null,
      })),
    });
  } catch (err) {
    console.error("ERROR FETCHING ALL PASTES", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPasteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const now = getNow(req);

    const paste = await Paste.findOneAndUpdate(
      {
        _id: id,
        $and: [
          {
            $or: [
              { max_views: null },
              { $expr: { $lt: ["$views", "$max_views"] } },
            ],
          },
          {
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
          },
        ],
      },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!paste) {
      return res.status(404).json({ error: "Paste not found or unavailable" });
    }

    return res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.max_views === null ? null : paste.max_views - paste.views,
      expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null,
    });
  } catch (err) {
    console.error("ERROR GETTING PASTE", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const renderPaste = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("<h1>404</h1>");
    }

    const now = getNow(req);

    const paste = await Paste.findOneAndUpdate(
      {
        _id: id,
        $and: [
          {
            $or: [
              { max_views: null },
              { $expr: { $lt: ["$views", "$max_views"] } },
            ],
          },
          {
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
          },
        ],
      },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!paste) {
      return res.status(404).send("<h1>404: Paste Not Found</h1>");
    }

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("<h1>500</h1>");
  }
};

module.exports = {
  checkHealth,
  createPaste,
  getPasteById,
  renderPaste,
  getAllPastes,
};
