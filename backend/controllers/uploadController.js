exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }
    res.status(200).json({
      success: true,
      message: "Audio file uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.error("Error uploading audio file:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
