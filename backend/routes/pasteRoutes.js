const express = require("express");
const router = express.Router();
const {
  checkHealth,
  createPaste,
  getPasteById,
  getAllPastes,
} = require("../controllers/pasteController");

router.get("/healthz", checkHealth);
router.post("/pastes", createPaste);
router.get("/pastes", getAllPastes);
router.get("/pastes/:id", getPasteById);

module.exports = router;
