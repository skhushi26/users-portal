const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const nodemailer = require("nodemailer");

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

exports.postLoginUser = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions

  try {
    const { email, password } = req.body;
    // finds user by email Id
    const user = await User.findOne({ email });
    // compares req.body password with the user's password
    const isMatch = await bcrypt.compare(password, user.password);
    // checks whether isMatch is true or false
    if (isMatch) {
      // generates token for that particular user
      const token = await jwt.sign(
        { user_id: user._id.toString() },
        "u$eRm0dulE",
        {
          algorithm: "HS256",
        },
        { expiresIn: "1h" }
      );
      res.send(
        response(
          null,
          {
            user: {
              ...user.toJSON(),
              ...{ access_token: token },
            },
          },
          "User has successfully logged in",
          200
        )
      );
    } else {
      res.send(response(null, null, "Error", 500));
    }
  } catch (error) {
    // sends response if user can't logged in
    return res.send(response(error, null, "Error", 500));
  }
  return null;
};

exports.postUpdateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user_exist = await User.findOne({ _id });
    // finds user by _id and updates req.body details
    if (user_exist) {
      const updateUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
        upsert: true,
        timestamps: { createdAt: false, updatedAt: true },
      });
      // sends response if record updated successfully
      // eslint-disable-next-line quote-props
      res.send(
        response(null, { user: updateUser }, "User record updated", 200)
      );
    } else {
      res.send(response(null, null, "This user doesn't exists", 500));
    }
  } catch (error) {
    // sends response if error occurred in updating user's data
    res.send(response(error, null, "Error in updating", 500));
  }
};

exports.postChangePassword = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  try {
    const _id = req.params.id;
    const { password, newPassword, confirmPassword } = req.body;
    // find user by _id
    const user = await User.findOne({ _id });
    // compares req.body password with user's password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // if isMatch is true then bcrypts the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // compares newPassword and confirmPassword
      if (newPassword === confirmPassword) {
        // updates currentpassword with newPassword
        const updatePassword = await User.findByIdAndUpdate(
          { _id },
          { $set: { password: hashedPassword } },
          {
            new: true,
            upsert: true,
            timestamps: { createdAt: false, updatedAt: true },
          }
        );
        // sends response if password updated successfully
        // eslint-disable-next-line quote-props
        res.send(
          response(null, { user: updatePassword }, "Password Updated", 200)
        );
      } else {
        // sends response if newPassword and confirmPassword doesn't match
        res.send(
          response(
            null,
            null,
            "Password and confirm password doesn't match",
            500
          )
        );
      }
    } else {
      // sends response if currentpassword doesn't match with saved password
      res.send(
        response(
          null,
          null,
          "Current password doesn't match with your password",
          500
        )
      );
    }
  } catch (error) {
    // sends response if error occurred in updating password
    res.send(
      response(error, null, "Something went wrong in updating password", 500)
    );
  }
  return null;
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;
  const rand = uuid();
  // creates link to reset password
  const link = `http://${req.get("host")}/users/reset/${rand}`;
  // finds user by email ID
  const user = await User.findOne({ email });
  // checks whether user exists or not
  if (!user) {
    // sends response if user doesn't exists
    res.send(response(null, null, "User doesn't exists", 500));
  }
  // sets the user's resetToken and expiryToken
  user.resetToken = rand;
  user.expiryToken = Date.now() + 3600000;
  // saves user data
  await user.save();

  const fromMail = "portaluser025@gmail.com";
  const toMail = `${email}`;
  const subject = "Reset Password Link";
  const text = `Hello,<br> Please Click on the link to change your password.<br><a href="${link}">Click here to reset your password</a>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "portaluser025@gmail.com",
      pass: "#userportal&25",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: fromMail,
    to: toMail,
    subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, response1) => {
    if (error) {
      console.log(error);
    }
    res.send(
      response(
        null,
        null,
        "Reset password link has been sent successfully",
        200
      )
    );
    console.log("response1: ", response1);
  });
};
