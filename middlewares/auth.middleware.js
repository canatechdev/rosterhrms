const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("AUTH HEADER:", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  // console.log("TOKEN:", token); 

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};