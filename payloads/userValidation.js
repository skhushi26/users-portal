const Joi = require("joi");
const validateRequest = require("../utils/validation");

module.exports = {
  registrationSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
};

function registrationSchema(req, res, next) {
  const schemaRules = {
    profile_media: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}

/*
  ------User login server side validation-------
*/

function loginSchema(req, res, next) {
  const schemaRules = {
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}

/*
  ---------Change password server side validation-------
*/
function changePasswordSchema(req, res, next) {
  const schemaRules = {
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}

/*
  ----------Forgot password server side validation---------
*/
function forgotPasswordSchema(req, res, next) {
  const schemaRules = {
    email: Joi.string().email().required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}
