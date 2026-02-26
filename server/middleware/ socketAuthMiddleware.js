const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/User");

const JWT_SECRET = "supersecretKey";

const socketAuthMiddleware = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;

    if (!rawCookies) {
      return next(new Error("Unauthorized"));
    }

    // Parse cookies manually (cookie-parser does NOT work here)
    const parsedCookies = cookie.parse(rawCookies);
    const token = parsedCookies.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    // Attach user to socket
    socket.user = user;
   //  console.log(socket.user)

    next();

  } catch (err) {
    return next(new Error("Unauthorized"));
  }
};

module.exports = socketAuthMiddleware;