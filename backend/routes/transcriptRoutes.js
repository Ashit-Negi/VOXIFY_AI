const express = require("express");

const router = express.Router();

const upload = require("../middleware/multerMiddleware");

const {
  transcribeAudio,
  getAllTranscripts,
  getSingleTranscript,
  deleteTranscript,
} = require("../controllers/transcriptController");

router.post("/", upload.single("audio"), transcribeAudio);

router.get("/", getAllTranscripts);

router.get("/:id", getSingleTranscript);

router.delete("/:id", deleteTranscript);

module.exports = router;
