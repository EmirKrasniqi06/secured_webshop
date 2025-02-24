import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect("/login");
  }
};

export default authenticateJWT;
