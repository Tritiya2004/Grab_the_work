require("dotenv").config();
const jwt = require("jsonwebtoken");

const tokenVerification = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.json({ msg: "Authorization header is missing", status: 403 });
  
  const token = authHeader.split(" ")[1];
  if (!token) return res.json({ msg: "Token Required", status: 403 });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.json({ msg: "Invalid Token", status: 401 });

    req.userId = user.userId;
    next();
  });
};


module.exports = tokenVerification;