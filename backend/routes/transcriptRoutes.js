const express = require("express");

const router = express.Router();

const upload = require("../middleware/multerMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  transcribeAudio,
  getAllTranscripts,
  getSingleTranscript,

  deleteTranscript,
} = require("../controllers/transcriptController");

router.post("/", protect, upload.single("audio"), transcribeAudio);

router.get("/", protect, getAllTranscripts);

router.get("/:id", protect, getSingleTranscript);

router.delete("/:id", protect, deleteTranscript);

module.exports = router;
