const jwt = require("jsonwebtoken");
const pool = require("../config/database"); 

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const userRes = await pool.query(
      `SELECT user_id, zp_id, role_id 
       FROM users 
       WHERE user_id = $1`,
      [payload.user_id]
    );
console.log("AUTH MIDDLEWARE HIT");
    if (userRes.rowCount === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userRes.rows[0]; 
console.log("Authenticated user:", req.user);
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};