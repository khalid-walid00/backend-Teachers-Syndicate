const { Server } = require("socket.io");

function initSocket(server) {
  if (!global.io) {
    global.io = new Server(server, {
      cors: { origin: "*", credentials: true },
    });

    const clients = {};

    global.io.on("connection", (socket) => {
      console.log("✅ New socket connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  }

  return global.io;
}

module.exports = { initSocket };
