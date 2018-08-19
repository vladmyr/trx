import { TCPServer } from "../Common/Network/TCPTransport"

const Speaker = require("speaker");

const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000
});

const server = new TCPServer(1373);

server.getServer().on("connection", () => {
  const socket = server.getClient().getSocket();

  socket.on("close", () => console.log("close"));
  socket.on("listening", () => console.log("listening"));
  socket.on("error", () => console.log("error"));
  socket.on("data", (buffer) => console.log(buffer));
})
