const express = require("express");
const { validate } = require("express-validation");
const Joi = require("joi");

const userController = require("../controller/userController");
const router = express.Router();
const authorize = require("../utils/requireLogin");

const {
  registrationSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
} = require("../payloads/userValidation");

router.post("/register", registrationSchema, userController.postRegisterUser);

router.post("/login", loginSchema, userController.postLoginUser);

router.patch("/edit-user/:id", userController.postUpdateUser);

router.patch(
  "/change-password/:id",
  changePasswordSchema,
  userController.postChangePassword
);

router.post(
  "/forgot-password",
  forgotPasswordSchema,
  userController.postForgotPassword
);

module.exports = router;
