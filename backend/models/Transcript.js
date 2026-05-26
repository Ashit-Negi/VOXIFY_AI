const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    transcript: {
      type: String,
      required: true,
    },

    audioUrl: {
      type: String,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transcript", transcriptSchema);
