import jwt  from "jsonwebtoken";

export default function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Missing Authorization" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Authorization" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
