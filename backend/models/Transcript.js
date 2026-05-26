const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },

    transcription: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transcript", transcriptSchema);
