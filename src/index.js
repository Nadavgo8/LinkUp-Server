require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  const server = http.createServer(app);

  //   const io = new Server(server, {
  //     cors: { origin: process.env.CLIENT_ORIGIN || '*' }
  //   });

  //   io.on('connection', (socket) => {
  //     console.log('socket connected', socket.id);

  //     socket.on('joinChat', ({ chatId }) => {
  //       if (chatId) socket.join(chatId);
  //     });

  //     socket.on('sendMessage', (payload) => {
  //       // payload: { chatId, fromUserId, text, ... }
  //       if (payload && payload.chatId) {
  //         io.to(payload.chatId).emit('newMessage', payload);
  //       }
  //     });

  //     socket.on('disconnect', () => {
  //       console.log('socket disconnected', socket.id);
  //     });
  //   });

  server.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start", err);
  process.exit(1);
});
