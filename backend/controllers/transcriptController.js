const fs = require("fs");

const groq = require("../config/groq");

const Transcript = require("../models/Transcript");

exports.transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    const filePath = req.file.path;

    // GROQ WHISPER API
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),

      model: "whisper-large-v3",
    });

    // SAVE TO DATABASE
    const savedTranscript = await Transcript.create({
      fileName: req.file.filename,

      originalName: req.file.originalname,

      transcript: transcription.text,

      audioUrl: `/uploads/${req.file.filename}`,
    });

    res.status(200).json({
      success: true,

      message: "Transcription successful",

      data: savedTranscript,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

exports.getAllTranscripts = async (req, res) => {
  try {
    const transcripts = await Transcript.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: transcripts.length,
      data: transcripts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transcript,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      });
    }

    await transcript.deleteOne();

    res.status(200).json({
      success: true,
      message: "Transcript deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
