const jwt = require("express-jwt");
const User = require("../models/User");

module.exports = authorize;

function authorize() {
  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: "u$eRm0dulE", algorithms: ["HS256"] }),

    async (req, res, next) => {
      const user = await User.findOne({ _id: req.user.user_id });
      if (!user) {
        // user is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      next();
    },
  ];
}
