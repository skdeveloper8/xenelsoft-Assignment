const jwt = require("jsonwebtoken");

function authenticate_user(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded.user || decoded;
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        expiredAt: error.expiredAt,
      });
    }

    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authenticate_user;
