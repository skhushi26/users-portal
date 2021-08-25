const bcrypt = require("bcrypt");

const User = require("../models/User");
const response = require("../utils/response");

exports.postRegisterUser = async (req, res) => {
  const { profile_media, first_name, last_name, username, email, password } =
    req.body;

  const hash = await bcrypt.hash(password, 10);

  const userData = new User({
    profile_media,
    first_name,
    last_name,
    username,
    email,
    password: hash,
  });

  try {
    // adds user data to database
    await userData.save((err) => {
      if (err) {
        if (err.code === 11000) {
          // Duplicate username
          return res.send(response(null, null, "user already exists", 500));
        }

        // Some other error
        return res.status(422).send(err);
      }

      res.send(response(null, { user: userData }, "User added", 200));
    });
  } catch (error) {
    // sends response if error occurred in adding user details
    return res.send(response(error, null, "Error", 500));
  }
};
