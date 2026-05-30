const { Server } = require("socket.io");

const WebSocket = require("ws");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "https://voxify-ai-lovat.vercel.app"],
      methods: ["GET", "POST"],
    },
  });
  

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    const assemblySocket = new WebSocket(
      `wss://streaming.assemblyai.com/v3/ws?sample_rate=48000&speech_model=universal-streaming-multilingual`,
      {
        headers: {
          Authorization: process.env.ASSEMBLYAI_API_KEY,
        },
      },
    );

    assemblySocket.on("open", () => {
      console.log("AssemblyAI Realtime Connected");
    });

    assemblySocket.on("message", (message) => {
      const data = JSON.parse(message);

      console.log("ASSEMBLY DATA:", data);

      if (data.type === "Turn" && data.transcript) {
        console.log("LIVE TRANSCRIPT:", data.transcript);

        socket.emit("live-transcript", data.transcript);
      }
    });

    assemblySocket.on("error", (error) => {
      console.log(error);
    });

    socket.on("audio-chunk", (data) => {
      if (assemblySocket.readyState === WebSocket.OPEN) {
        assemblySocket.send(data.audio);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");

      if (assemblySocket.readyState === WebSocket.OPEN) {
        assemblySocket.close();
      }
    });
  });
};

module.exports = initializeSocket;
