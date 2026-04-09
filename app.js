const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const responseLogger = require('./config/response.logger')
const fs = require("fs");

const authMiddleware = require("./middlewares/auth.middleware");
const app = express();
app.use((req, res, next) => {
    console.log("URL HIT:", req.originalUrl);
    next();
});
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
//app.use(morgan('dev'));
app.use(responseLogger);


// ROUTES
app.use('/auth', require('./routes/auth/auth.route'));
app.use('/zp',require('./routes/zp/zp.route'));
app.use('/system', require('./routes/system/system.route'));
app.use('/system/districts', require('./routes/system/district.route.js'));
// app.use('/zps', require('./routes/zp/zp.route.js'));
app.use('/system/departments', require('./routes/system/department.route.js'));
app.use('/system/posts', require('./routes/system/post.route.js'));
app.use('/system/castes', require('./routes/system/caste.route.js'));
app.use('/system/roles', require('./routes/system/role.route.js'));



// ERROR HANDLING
const error_handler = require("./middlewares/error_handler.middleware")
app.use(error_handler)


// 200 Health Check
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", code: 200 });
});


// LOGS

app.get("/logs", (req, res) => {
  const d = new Date().toISOString().split("T")[0];
  const logs = fs.readFileSync("logs/app.log." + d, "utf8")
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));
  res.json(logs.reverse());
});

app.get("/logs_clean", (req, res) => {
  fs.writeFileSync("logs/app.log." + new Date().toISOString().split("T")[0], "");
  res.json({ message: "Logs cleaned" });
});


// NOT FOUND ERROR
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", code: 404 });
});

module.exports = app;
