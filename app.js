const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const responseLogger = require('./config/response.logger')
const fs = require("fs");
const path = require('path');
const morgan = require('morgan');
const app = express();
const authMiddleware = require("./middlewares/auth.middleware");

// ─── CORS HELPERS ────────────────────────────────────────────────────────────

const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== 'string') return null;
  const trimmed = origin.trim().replace(/\/+$/, ''); // strip trailing slashes
  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch (_) {
    return trimmed.toLowerCase();
  }
};

const STATIC_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost",
  "http://192.168.1.36:5173",
  "http://172.20.10.11:5173",
  "https://zproster.thecanatech.com",
];

const getAllowedOrigins = () => {
  const origins = [...STATIC_ORIGINS];
  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
  if (process.env.ALLOWED_ORIGINS) {
    origins.push(...process.env.ALLOWED_ORIGINS.split(','));
  }
  return [...new Set(origins.map(normalizeOrigin).filter(Boolean))];
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, same-origin)
    if (!origin) return callback(null, true);

    const normalized = normalizeOrigin(origin);
    const allowedOrigins = getAllowedOrigins();

    if (process.env.NODE_ENV === 'production') {
      if (!allowedOrigins.includes(normalized)) {
        console.warn(`[CORS] Blocked: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
      }
    } else {
      // Dev mode: warn but allow any origin so teammates on new IPs aren't blocked
      if (!allowedOrigins.includes(normalized)) {
        console.warn(`[CORS] Allowed (dev): ${origin}`);
      }
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// ─── PREFLIGHT CATCH-ALL ──────────────────────────────────────────────────────
// Ensures OPTIONS requests for every route are handled before any auth middleware
app.options('/{*any}', cors(corsOptions));

// ─── CORE MIDDLEWARE ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(responseLogger);

// ─── STATIC UPLOADS ───────────────────────────────────────────────────────────
app.use("/uploads", cors({ origin: '*', credentials: false, methods: ['GET', 'HEAD', 'OPTIONS'] }), express.static("uploads"));

// ─── FRONTEND SPA ─────────────────────────────────────────────────────────────
const appPath = path.join(__dirname, 'public');
app.use(express.static(appPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
  }
}));
app.get('/{*any}', (req, res, next) => {  if (req.path.startsWith('/api') || req.path.includes('.')) return next();
  res.sendFile(path.join(appPath, 'index.html'));
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth/auth.route'));
app.use('/api/departments', require('./routes/system/department.route'));
app.use('/api/roles', require('./routes/system/role.route.js'));
app.use('/api/permissions', require('./routes/system/permission.route.js'));
app.use('/api/castes', require('./routes/system/caste.route.js'));
app.use('/api/cadres', require('./routes/system/cadre.route.js'));
app.use('/api/posts', require('./routes/system/post.route.js'));
app.use('/api/zp', require('./routes/zp/zp.route'));
app.use('/api/districts', require('./routes/system/district.route.js'));
app.use('/api/employee', require('./routes/employee/profile.route.js'));
app.use('/api/system', require('./routes/system/system.route'));
app.use('/api/masters', require('./routes/system/master.route.js'));

// ─── HEALTH & LOGS ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => res.status(200).json({ status: "success", code: 200 }));

app.get("/api/logs", (req, res) => {
  const d = new Date().toISOString().split("T")[0];
  const logs = fs.readFileSync("logs/app.log." + d, "utf8")
    .trim().split("\n").map(line => JSON.parse(line));
  res.json(logs.reverse());
});

app.get("/api/logs_clean", (req, res) => {
  fs.writeFileSync("logs/app.log." + new Date().toISOString().split("T")[0], "");
  res.json({ message: "Logs cleaned" });
});

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
const error_handler = require("./middlewares/error_handler.middleware");
app.use(error_handler);

app.use((req, res) => res.status(404).json({ error: "Route not found", code: 404 }));

module.exports = app;