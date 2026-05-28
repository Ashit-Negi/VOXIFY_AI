const express = require("express");

const cors = require("cors");

require("dotenv").config();

const path = require("path");

const http = require("http");

const connectDB = require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");

const transcriptRoutes = require("./routes/transcriptRoutes");

const initializeSocket = require("./socket/socketServer");

const app = express();

const server = http.createServer(app);

connectDB();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/upload", uploadRoutes);

app.use("/api/transcribe", transcriptRoutes);

app.get("/", (req, res) => {
  res.send("Voxify AI Backend Running...");
});

// INITIALIZE SOCKET SERVER
initializeSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
