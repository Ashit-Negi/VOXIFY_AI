const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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
