const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const routes = require("./routes");
const pagination = require("./middleware/pagination");
const responseHelper = require("./middleware/responsiveHandler");
const { renderPageBySlug } = require("./services/render.service");
const http = require("http");
const { initSocket } = require("./services/realTime.service");
const session = require("express-session");
const RedisStore = require("connect-redis").default; 
const { createClient } = require("redis");

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI not defined in environment variables.");
  process.exit(1);
}

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(responseHelper);

// ⚡ Redis session (أفضل من MemoryStore في الإنتاج)
const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redisClient.connect().catch(console.error);

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true فقط في https
    maxAge: 1000 * 60 * 60 * 24, // يوم واحد
  },
});

app.use(sessionMiddleware);

// 🛣️ Routes
app.use("/api", pagination(20), routes);

// 🌐 Dynamic page rendering
app.get("*", async (req, res) => {
  const slug = req.path === "/" ? "home" : req.path.slice(1);
  console.log("slug", slug);

  try {
    const html = await renderPageBySlug(slug);
    res.send(html);
  } catch (error) {
    console.log("error rendering page:", error);
    res.status(404).send("الصفحة غير موجودة");
  }
});

// Middleware
app.use(notFound);
app.use(errorHandler);

// ⚡ Socket.io
const server = http.createServer(app);
initSocket(server, sessionMiddleware);

// ⚡ استخدام البورت الذي يحدده Fly.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
