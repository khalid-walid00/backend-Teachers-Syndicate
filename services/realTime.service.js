const { Server } = require("socket.io");
const sharedSession = require("express-socket.io-session");

function initSocket(server, sessionMiddleware) {
  if (!global.io) {
    global.io = new Server(server, {
      cors: { origin: "*",credentials: true,  },
    });

    // 1️⃣ اربط session Express مع socket.io
    global.io.use(sharedSession(sessionMiddleware, {
      autoSave: true,
    }));

    const clients = {};

    global.io.on("connection", (socket) => {
        const session = socket.handshake.session; 
        const user = session;
console.log("xxxxxxx", socket.handshake);
    //   if (userId) {
    //     clients[userId] = socket.id;
    //     console.log("✅ connected:", userId);
    //   } else {
    //     console.log("⚠️ connected guest");
    //   }

      socket.on("disconnect", () => {
        // if (userId) {
        //   delete clients[userId];
        //   console.log("❌ disconnected:", userId);
        // }
      });
    });
  }

  return global.io;
}

module.exports = { initSocket };
