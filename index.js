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
const sharedsession = require("express-socket.io-session");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(responseHelper);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // خليه true لو شغال https
});

app.use(sessionMiddleware);
app.use("/api", pagination(20), routes);
app.get("*", async (req, res) => {
  const path = req.path;
  const slug = path === "/" ? "home" : path.slice(1);
  console.log("slug", slug);

  try {
    const html = await renderPageBySlug(slug);
    res.send(html);
  } catch (error) {
    console.log("error", error);
    res.status(404).send("الصفحة غير موجودة");
  }
});

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
initSocket(server, sessionMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
