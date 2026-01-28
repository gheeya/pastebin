const express = require("express");
const router = express.Router();
const { renderPaste } = require("../controllers/pasteController");

router.get("/:id", renderPaste);

module.exports = router;
