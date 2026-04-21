const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const responseLogger = require('./config/response.logger')
const fs = require("fs");
const path = require('path');
const cron = require("node-cron");
const morgan = require('morgan');
const app=express();
const authMiddleware = require("./middlewares/auth.middleware");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://zproster.thecanatech.com"
]
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// require("./cron/retirementCron");
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(responseLogger);

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use((req, res, next) => {
//     console.log(req.originalUrl);
//     next();
// });

// FRONTEND BINDING
const appPath = path.join(__dirname, 'public');

// Serve user app frontend static files under root
app.use(express.static(appPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
// SPA fallback for user app routes (everything else)
app.get('', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return next();
  // Skip if it has a file extension (static assets)
  if (req.path.includes('.')) return next();

  res.sendFile(path.join(appPath, 'index.html'));
});


// ROUTES
app.use('/api/auth', require('./routes/auth/auth.route'));
app.use('/api/departments', require('./routes/system/department.route'));
app.use('/api/roles', require('./routes/system/role.route.js'));
app.use('/api/permissions', require('./routes/system/permission.route.js'));
app.use('/api/castes', require('./routes/system/caste.route.js'));
app.use('/api/posts', require('./routes/system/post.route.js'));
app.use('/api/zp', require('./routes/zp/zp.route'));
app.use('/api/districts', require('./routes/system/district.route.js'));
app.use('/api/employee', require('./routes/employee/profile.route.js'));
app.use('/api/system', require('./routes/system/system.route'));
app.use('/api/masters', require('./routes/system/master.route.js'));
// app.use('/zps', require('./routes/zp/zp.route.js'));
// app.use('/zp',require('./routes/zp/zp.route'));




// ERROR HANDLING
const error_handler = require("./middlewares/error_handler.middleware")
app.use(error_handler)


// 200 Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", code: 200 });
});


// LOGS

app.get("/api/logs", (req, res) => {
  const d = new Date().toISOString().split("T")[0];
  const logs = fs.readFileSync("logs/app.log." + d, "utf8")
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));
  res.json(logs.reverse());
});

app.get("/api/logs_clean", (req, res) => {
  fs.writeFileSync("logs/app.log." + new Date().toISOString().split("T")[0], "");
  res.json({ message: "Logs cleaned" });
});


// NOT FOUND ERROR
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", code: 404 });
});

module.exports = app;
