require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 1000;

// create server (IMPORTANT)
const server = require("http").createServer(app);

// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔══════════════════════════════════╗
║   🚀 ZP Backend Server           ║
║   📍 Port: ${PORT}
║   🌍 Environment: ${process.env.NODE_ENV || "development"}
╚══════════════════════════════════╝
  `);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    pool.end(() => {
      console.log("Database pool closed");
      process.exit(0);
    });
  });
});