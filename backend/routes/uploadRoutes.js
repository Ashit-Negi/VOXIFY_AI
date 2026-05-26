const express = require("express");

const router = express.Router();

const upload = require("../middleware/multerMiddleware");

const { uploadAudio } = require("../controllers/uploadController");

router.post("/", upload.single("audio"), uploadAudio);

module.exports = router;
