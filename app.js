const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const responseLogger = require('./config/response.logger')
const fs = require("fs");
const cron = require("node-cron");
const morgan = require('morgan');

const authMiddleware = require("./middlewares/auth.middleware");
const app = express();
// app.use((req, res, next) => {
//     console.log(req.originalUrl);
//     next();
// });
app.use(cors());
require("./cron/retirementCron");
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(morgan('combined')); 
app.use(responseLogger);


// ROUTES
app.use('/auth', require('./routes/auth/auth.route'));
app.use('/departments',require('./routes/system/department.route'));
app.use('/roles', require('./routes/system/role.route.js'));
app.use('/castes', require('./routes/system/caste.route.js'));
app.use('/posts', require('./routes/system/post.route.js'));
app.use('/zp',require('./routes/zp/zp.route'));
app.use('/districts', require('./routes/system/district.route.js'));
app.use('/profile', require('./routes/system/profile.route.js'));
// app.use('/zps', require('./routes/zp/zp.route.js'));
// app.use('/system', require('./routes/system/system.route'));
// app.use('/masters', require('./routes/system/master.route.js'));
// app.use('/zps', require('./routes/zp/zp.route.js'));
// app.use('/zp',require('./routes/zp/zp.route'));




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
