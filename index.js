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

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI not defined in environment variables.");
  process.exit(1);
}

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(responseHelper);

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

// ⚡ Socket.io بدون جلسات
const server = http.createServer(app);
initSocket(server); // سيبها زي ما هي

const PORT = process.env.PORT || 5000; 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});ئئئئ